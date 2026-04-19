/**
 * FTS-only index: upserts `page` and `page_section` from local MDX (no OpenAI / embeddings).
 *
 * Requires a Supabase project that already defines the docs-style `page` / `page_section`
 * tables and `docs_search_fts` RPC (see `packages/common/database-types.ts`).
 *
 * Environment:
 *   NEXT_PUBLIC_SUPABASE_URL — project URL
 *   SUPABASE_SERVICE_ROLE_KEY — service role key (recommended)
 *   SUPABASE_SECRET_KEY — alternative name (matches upstream `generate-embeddings.ts`)
 *
 * Usage:
 *   pnpm run index:docs
 *   pnpm run index:docs -- --dry-run
 *
 * Database: `page` must have a UNIQUE constraint on `path` for upsert onConflict to work.
 * Optional: run `pnpm run index:docs` in deploy CI after setting the env vars as secrets.
 *
 * Shop routes (`/shop/...`, except paths ending in `/overview`): catalog fields (`brand`, `family`, etc.)
 * are merged from `notion.fragrances` before indexing (same as runtime `resolveShopFragranceMeta`).
 */

import { config as loadDotenv } from 'dotenv'

loadDotenv()
loadDotenv({ path: '.env.local', override: true })

import { createClient } from '@supabase/supabase-js'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { Database, Json } from '../../packages/common/database-types'
import { fetchAllSources } from './sources/index.js'
import type { SearchPageSource } from './sources/index.js'
import type { MarkdownSource } from './sources/markdown.js'
import { resolveShopMetaForIndexing } from './resolveShopMetaForIndexing.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

type PageTable = 'page' | 'page_nimbus'
type PageSectionTable = 'page_section' | 'page_section_nimbus'

function getPageTables(): { pageTable: PageTable; pageSectionTable: PageSectionTable } {
  const enabledPath = join(__dirname, '../../packages/common/enabled-features/enabled-features.json')
  const enabledFeatures = JSON.parse(readFileSync(enabledPath, 'utf-8')) as Record<string, boolean>
  const useFullIndex = enabledFeatures['search:fullIndex'] !== false
  return useFullIndex
    ? { pageTable: 'page', pageSectionTable: 'page_section' }
    : { pageTable: 'page_nimbus', pageSectionTable: 'page_section_nimbus' }
}

function getServiceRoleKey(): string {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.SUPABASE_SECRET_KEY?.trim() ||
    ''
  )
}

function normalizePath(path: string): string {
  if (!path.startsWith('/')) return `/${path.replace(/^\/+/, '')}`
  return path
}

function stableChecksum(path: string, content: string): string {
  return createHash('sha256').update(`${path}\0${content}`, 'utf8').digest('base64')
}

function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key = getServiceRoleKey()
  if (!url || !key) {
    throw new Error(
      'Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY)'
    )
  }
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

async function upsertPageAndSections(
  client: ReturnType<typeof createSupabaseClient>,
  source: SearchPageSource,
  pageTable: PageTable,
  pageSectionTable: PageSectionTable
) {
  const processed = await source.process()
  const path = normalizePath(source.path)

  let meta: Record<string, unknown> = { ...(processed.meta ?? {}) }
  if (path.startsWith('/shop/')) {
    const merged = await resolveShopMetaForIndexing(client, meta, path)
    meta = merged
    if (source.type === 'markdown') {
      ;(source as MarkdownSource).meta = merged
    }
  }

  const content = source.extractIndexedContent()
  const useFileChecksum =
    !path.startsWith('/shop/') && Boolean(processed.checksum && processed.checksum.length > 0)
  const checksum =
    useFileChecksum && processed.checksum ? processed.checksum : stableChecksum(path, content)

  const metaJson = meta as Json
  const pageRow = {
    path,
    content,
    checksum,
    meta: metaJson,
    type: source.type,
    source: source.type === 'blog' ? 'blog' : 'markdown',
    version: 'aromaticat-fts',
  }

  const pageQuery = client.from(pageTable)
  const upserted = await pageQuery
    .upsert(pageRow as Database['public']['Tables'][typeof pageTable]['Insert'], {
      onConflict: 'path',
    })
    .select('id')
    .single()

  if (upserted.error) {
    throw new Error(`upsert ${pageTable} ${path}: ${upserted.error.message}`)
  }

  const pageId = upserted.data?.id
  if (pageId == null) {
    throw new Error(`missing id after upsert for ${path}`)
  }

  const del = await client.from(pageSectionTable).delete().eq('page_id', pageId)
  if (del.error) {
    throw new Error(`delete ${pageSectionTable} for page_id=${pageId}: ${del.error.message}`)
  }

  const sections = processed.sections ?? []
  if (sections.length === 0) {
    return
  }

  const rows: Database['public']['Tables']['page_section']['Insert'][] = sections.map((s) => ({
    page_id: pageId,
    content: s.content ?? '',
    heading: s.heading ?? null,
    slug: s.slug ?? null,
    rag_ignore: false,
    token_count: null,
    embedding: null,
  }))

  const ins = await client.from(pageSectionTable).insert(rows as never)
  if (ins.error) {
    throw new Error(`insert ${pageSectionTable} ${path}: ${ins.error.message}`)
  }
}

async function main() {
  const dryRun = process.argv.includes('--dry-run')
  const sources = await fetchAllSources(true)

  if (dryRun) {
    console.log(`[index:docs] dry run: ${sources.length} page(s)`)
    for (const s of sources) {
      console.log(`  - ${normalizePath(s.path)} (${s.type})`)
    }
    return
  }

  const { pageTable, pageSectionTable } = getPageTables()
  const client = createSupabaseClient()

  console.log(`[index:docs] indexing ${sources.length} page(s) → ${pageTable} / ${pageSectionTable}`)

  let ok = 0
  for (const source of sources) {
    const p = normalizePath(source.path)
    try {
      await upsertPageAndSections(client, source, pageTable, pageSectionTable)
      ok += 1
      console.log(`  ok ${p}`)
    } catch (e) {
      console.error(`  FAIL ${p}:`, e)
      process.exitCode = 1
    }
  }

  console.log(`[index:docs] done: ${ok}/${sources.length} succeeded`)
}

main().catch((e) => {
  console.error('[index:docs] fatal:', e)
  process.exit(1)
})

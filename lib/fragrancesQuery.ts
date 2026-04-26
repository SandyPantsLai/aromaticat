/**
 * Notion `fragrances` catalog queries — no `server-only` so Node CLIs (e.g. `pnpm index:docs`) can import safely.
 * Server routes should use `~/lib/fragrances` which adds the app Supabase client.
 */

import type { SupabaseClient } from '@supabase/supabase-js'

import type { Json } from 'common'

import type { Database } from '~/lib/supabase'

type NotionFragrancesRow = Database['notion']['Tables']['fragrances']['Row']

/**
 * Catalog fields extracted from `notion.fragrances.attrs.properties`.
 * The FDW stores the full Notion page object in `attrs`; all user data is
 * under `attrs.properties.*` as typed Notion property objects.
 */
export type FragranceRow = {
  id: string
  slug: string
  brand: string | null
  name: string
  line: string | null
  description: string | null
  rating: number | null
  perfumer: string | null
  bottle_type: string | null
  cost_per_ml: number | null
  paid_per_ml: number | null
  remaining_ml: number | null
  size_ml: number | null
  received_ml: number | null
  bottle_qty: number | null
  paid: number | null
  family: string | null
  top: string | null
  mid: string | null
  base: string | null
  presentation: string | null
  source: string | null
  season: string | null
  setting: string | null
  gender: string | null
  age: string | null
  projection: number | null
  sillage_min: number | null
  longevity_hr: number | null
  review: string | null
  comments: string | null
  parfumo: string | null
  fragrantica: string | null
  image: string | null
  fragram: string | null
  created_at: string
  updated_at: string
  notion_url: string | null
}

function getProps(attrs: Json | null): Record<string, unknown> {
  if (attrs == null || typeof attrs !== 'object' || Array.isArray(attrs)) return {}
  const props = (attrs as Record<string, unknown>)['properties']
  if (props == null || typeof props !== 'object' || Array.isArray(props)) return {}
  return props as Record<string, unknown>
}

function getProp(props: Record<string, unknown>, key: string): Record<string, unknown> | null {
  const v = props[key]
  if (v == null || typeof v !== 'object' || Array.isArray(v)) return null
  return v as Record<string, unknown>
}

function titleProp(props: Record<string, unknown>, key: string): string | null {
  const prop = getProp(props, key)
  if (!prop) return null
  const arr = prop['title']
  if (!Array.isArray(arr)) return null
  return arr
    .map((b) => (typeof b === 'object' && b ? ((b as Record<string, unknown>)['plain_text'] as string) ?? '' : ''))
    .join('')
    .trim() || null
}

function richTextProp(props: Record<string, unknown>, key: string): string | null {
  const prop = getProp(props, key)
  if (!prop) return null
  const arr = prop['rich_text']
  if (!Array.isArray(arr)) return null
  return arr
    .map((b) => (typeof b === 'object' && b ? ((b as Record<string, unknown>)['plain_text'] as string) ?? '' : ''))
    .join('')
    .trim() || null
}

function numberProp(props: Record<string, unknown>, key: string): number | null {
  const prop = getProp(props, key)
  if (!prop) return null
  const v = prop['number']
  if (v == null) return null
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? n : null
}

function formulaNumProp(props: Record<string, unknown>, key: string): number | null {
  const prop = getProp(props, key)
  if (!prop) return null
  const f = prop['formula']
  if (typeof f !== 'object' || f == null) return null
  const v = (f as Record<string, unknown>)['number']
  if (v == null) return null
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? n : null
}

function selectProp(props: Record<string, unknown>, key: string): string | null {
  const prop = getProp(props, key)
  if (!prop) return null
  const sel = prop['select']
  if (typeof sel !== 'object' || sel == null) return null
  const name = (sel as Record<string, unknown>)['name']
  return typeof name === 'string' ? name.trim() || null : null
}

function multiSelectProp(props: Record<string, unknown>, key: string): string | null {
  const prop = getProp(props, key)
  if (!prop) return null
  const arr = prop['multi_select']
  if (!Array.isArray(arr) || arr.length === 0) return null
  const names = arr
    .map((item) =>
      typeof item === 'object' && item ? ((item as Record<string, unknown>)['name'] as string) ?? '' : ''
    )
    .filter(Boolean)
  return names.length ? names.join(', ') : null
}

function urlProp(props: Record<string, unknown>, key: string): string | null {
  const prop = getProp(props, key)
  if (!prop) return null
  const v = prop['url']
  return typeof v === 'string' ? v.trim() || null : null
}

function fileUrlProp(props: Record<string, unknown>, key: string): string | null {
  const prop = getProp(props, key)
  if (!prop) return null
  const arr = prop['files']
  if (!Array.isArray(arr)) return null
  for (const item of arr) {
    if (typeof item !== 'object' || item == null) continue
    const o = item as Record<string, unknown>
    const file = o['file']
    if (typeof file === 'object' && file != null) {
      const url = (file as Record<string, unknown>)['url']
      if (typeof url === 'string' && url) return url
    }
    const external = o['external']
    if (typeof external === 'object' && external != null) {
      const url = (external as Record<string, unknown>)['url']
      if (typeof url === 'string' && url) return url
    }
  }
  return null
}

export function notionFragranceRowToCatalog(row: NotionFragrancesRow): FragranceRow {
  const props = getProps(row.attrs)

  return {
    id: row.id,
    slug: '',
    brand: richTextProp(props, 'brand'),
    name: titleProp(props, 'name') ?? '',
    line: richTextProp(props, 'line'),
    description: richTextProp(props, 'description'),
    rating: numberProp(props, 'rating'),
    perfumer: multiSelectProp(props, 'perfumer'),
    bottle_type: selectProp(props, 'bottle_type'),
    cost_per_ml: numberProp(props, 'cost_per_ml'),
    paid_per_ml: formulaNumProp(props, 'paid_per_ml'),
    remaining_ml: numberProp(props, 'remaining_ml'),
    size_ml: numberProp(props, 'size_ml'),
    received_ml: numberProp(props, 'received_ml'),
    bottle_qty: numberProp(props, 'bottle_qty'),
    paid: numberProp(props, 'paid'),
    family: multiSelectProp(props, 'family'),
    top: multiSelectProp(props, 'top'),
    mid: multiSelectProp(props, 'mid'),
    base: multiSelectProp(props, 'base'),
    presentation: selectProp(props, 'presentation'),
    source: null,
    season: multiSelectProp(props, 'season'),
    setting: multiSelectProp(props, 'setting'),
    gender: multiSelectProp(props, 'gender'),
    age: multiSelectProp(props, 'age'),
    projection: numberProp(props, 'projection'),
    sillage_min: numberProp(props, 'sillage_min'),
    longevity_hr: numberProp(props, 'longevity_hr'),
    review: richTextProp(props, 'review'),
    comments: richTextProp(props, 'comments'),
    parfumo: urlProp(props, 'parfumo'),
    fragrantica: urlProp(props, 'fragantica'),
    image: fileUrlProp(props, 'image'),
    fragram: fileUrlProp(props, 'fragram'),
    created_at: row.created_time?.trim() || '',
    updated_at: row.last_edited_time?.trim() || '',
    notion_url: row.url?.trim() || null,
  }
}

/**
 * Loads a row where the Notion `name` title matches case-insensitively,
 * using a server-side JSON path filter on `notion.fragrances.attrs`.
 */
export async function fetchFragranceByNameWithClient(
  client: SupabaseClient<Database>,
  name: string
): Promise<FragranceRow | null> {
  const q = name.trim()
  if (!q) return null

  const { data, error } = await client
    .schema('notion')
    .from('fragrances')
    .select('id,url,created_time,last_edited_time,archived,attrs')
    .ilike('attrs->properties->name->title->0->>plain_text', q)
    .maybeSingle()

  if (error) {
    console.error('[fragrances] fetchFragranceByNameWithClient', q, error.message)
    return null
  }

  return data ? notionFragranceRowToCatalog(data) : null
}

/** JSON path on `notion.fragrances` used for title lookup (same as `fetchFragranceByNameWithClient`). */
export const FRAGRANCE_NAME_JSON_PATH = 'attrs->properties->name->title->0->>plain_text'

/**
 * Max names per batched OR filter. PostgREST builds a long query string; keep lists small (hub grids).
 * @see fetchFragrancesByNamesWithClient
 */
export const FRAGRANCE_BATCH_NAME_LIMIT = 30

/**
 * Trim, drop empties, dedupe case-insensitively (keep first spelling).
 * Caps length at {@link FRAGRANCE_BATCH_NAME_LIMIT}.
 */
export function normalizeFragranceNamesForBatch(names: readonly string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const raw of names) {
    const t = raw.trim()
    if (!t) continue
    const k = t.toLowerCase()
    if (seen.has(k)) continue
    seen.add(k)
    out.push(t)
    if (out.length >= FRAGRANCE_BATCH_NAME_LIMIT) break
  }
  return out
}

/**
 * Double-quote a value for PostgREST filter syntax (`"` → `""`).
 */
export function quotePostgrestFilterString(value: string): string {
  return `"${value.replace(/"/g, '""')}"`
}

/**
 * Builds the `.or(...)` filter string for multiple `ilike` clauses on the name JSON path.
 * Returns `null` when there is nothing to query.
 */
export function buildFragranceNamesOrFilter(names: readonly string[]): string | null {
  const normalized = normalizeFragranceNamesForBatch(names)
  if (normalized.length === 0) return null

  const col = FRAGRANCE_NAME_JSON_PATH
  const parts = normalized.map((n) => `${col}.ilike.${quotePostgrestFilterString(n)}`)
  return parts.join(',')
}

/**
 * Loads all rows whose Notion `name` title matches any of the given names (case-insensitive),
 * in one round trip via PostgREST `or`.
 */
export async function fetchFragrancesByNamesWithClient(
  client: SupabaseClient<Database>,
  names: readonly string[]
): Promise<FragranceRow[]> {
  const orFilter = buildFragranceNamesOrFilter(names)
  if (!orFilter) return []

  const { data, error } = await client
    .schema('notion')
    .from('fragrances')
    .select('id,url,created_time,last_edited_time,archived,attrs')
    .or(orFilter)

  if (error) {
    console.error('[fragrances] fetchFragrancesByNamesWithClient', error.message)
    return []
  }

  if (!data?.length) return []
  return data.map((row) => notionFragranceRowToCatalog(row))
}

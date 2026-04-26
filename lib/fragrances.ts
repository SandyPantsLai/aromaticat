import 'server-only'

import { unstable_cache } from 'next/cache'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { cache } from 'react'

import { REVALIDATION_TAGS } from '~/features/helpers.fetch'
import { TIME_TO_CACHE } from '~/features/helpers.time'
import { supabase } from '~/lib/supabase'

import type { Database } from '~/lib/supabase'

import {
  fetchFragranceByNameWithClient,
  fetchFragrancesByNamesWithClient,
  normalizeFragranceNamesForBatch,
  notionFragranceRowToCatalog,
  type FragranceRow,
} from '~/lib/fragrancesQuery'

export type { FragranceRow }
export {
  fetchFragranceByNameWithClient,
  fetchFragrancesByNamesWithClient,
  notionFragranceRowToCatalog,
}

let _fragrancesReadClient: SupabaseClient<Database> | null = null

/**
 * Notion wrapper FDW reads credentials from `vault`; queries as `anon` hit
 * "permission denied for schema vault". Use the service role on the server only
 * when `SUPABASE_SECRET_KEY` is set; otherwise fall back to the public client.
 */
function supabaseForFragrancesRead(): SupabaseClient<Database> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SECRET_KEY?.trim()
  if (url && serviceKey) {
    if (!_fragrancesReadClient) {
      _fragrancesReadClient = createClient<Database>(url, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    }
    return _fragrancesReadClient
  }
  return supabase()
}

const getFragranceByNameDataCached = unstable_cache(
  async (normalizedName: string) =>
    fetchFragranceByNameWithClient(supabaseForFragrancesRead(), normalizedName),
  ['fragrance-by-name'],
  {
    tags: [REVALIDATION_TAGS.NOTION_FRAGRANCES],
    revalidate: TIME_TO_CACHE,
  }
)

const getFragrancesByNamesDataCached = unstable_cache(
  async (namesSerialized: string) => {
    const names = JSON.parse(namesSerialized) as string[]
    return fetchFragrancesByNamesWithClient(supabaseForFragrancesRead(), names)
  },
  ['fragrances-by-names'],
  {
    tags: [REVALIDATION_TAGS.NOTION_FRAGRANCES],
    revalidate: TIME_TO_CACHE,
  }
)

/**
 * Loads a row where the Notion `name` title matches case-insensitively,
 * using a server-side JSON path filter on `notion.fragrances.attrs`.
 *
 * Deduplicated per request via React `cache()`, and shared across users via Next
 * `unstable_cache()` until `revalidate` TTL or `revalidateTag(REVALIDATION_TAGS.NOTION_FRAGRANCES)`.
 *
 * Prefer `fetchFragranceByNameWithClient` from `~/lib/fragrancesQuery` in Node CLIs (e.g. `pnpm index:docs`)
 * to avoid importing this `server-only` module.
 */
export const getFragranceByName = cache(async (name: string): Promise<FragranceRow | null> => {
  const q = name.trim()
  if (!q) return null
  return getFragranceByNameDataCached(q)
})

/**
 * Loads multiple catalog rows in one query (case-insensitive name match per row).
 * Cache key is stable for a given set of names (sorted, deduped).
 */
export const getFragrancesByNames = cache(async (names: readonly string[]): Promise<FragranceRow[]> => {
  const normalized = normalizeFragranceNamesForBatch(names)
  if (normalized.length === 0) return []
  const sorted = [...normalized].sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase(), undefined, { sensitivity: 'base' })
  )
  return getFragrancesByNamesDataCached(JSON.stringify(sorted))
})

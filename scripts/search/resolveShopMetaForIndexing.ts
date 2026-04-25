/**
 * Merges `notion.fragrances` fields into page meta during FTS indexing (same rules as
 * `resolveShopFragranceMeta` at runtime). Uses the indexer Supabase client (service role).
 */

import type { SupabaseClient } from '@supabase/supabase-js'

import type { Database } from '../../lib/supabase'
import type { GuideFrontmatter } from '../../lib/docs'
import { fetchFragranceByNameWithClient } from '../../lib/fragrancesQuery'
import { mergeCatalogIntoGuideMeta } from '../../lib/mergeCatalogIntoMeta'

export async function resolveShopMetaForIndexing(
  client: SupabaseClient<Database>,
  meta: Record<string, unknown>,
  pathname: string
): Promise<Record<string, unknown>> {
  if (!pathname.startsWith('/shop/') || pathname.endsWith('/overview')) {
    return meta
  }

  const lookupName = typeof meta.title === 'string' ? meta.title.trim() : ''
  if (!lookupName) return meta

  const row = await fetchFragranceByNameWithClient(client, lookupName)
  return mergeCatalogIntoGuideMeta(meta as GuideFrontmatter, row) as Record<string, unknown>
}

import 'server-only'

import type { GuideFrontmatter } from '~/lib/docs'
import { getFragranceByName } from '~/lib/fragrances'
import { mergeCatalogIntoGuideMeta } from '~/lib/mergeCatalogIntoMeta'

/** Section index pages (e.g. `/shop/decants/overview`) are not single products — skip DB lookup. */
export function shopPathSkipsFragranceCatalogLookup(pathname: string): boolean {
  return pathname.endsWith('/overview')
}

/**
 * When `title` matches a row, merge non-empty catalog fields from Supabase into frontmatter
 * (`notion.fragrances` via `attrs.properties`: name match is case-insensitive; maps to
 * `family`, `brand`, `line`, `description` when present).
 * Pass `pathname` from the shop loader so overview pages do not query `fragrances`.
 */
export async function resolveShopFragranceMeta(
  meta: GuideFrontmatter,
  pathname?: string
): Promise<GuideFrontmatter> {
  if (pathname && shopPathSkipsFragranceCatalogLookup(pathname)) {
    return meta
  }

  const lookupName = meta.title?.trim()
  if (!lookupName) return meta

  const row = await getFragranceByName(lookupName)
  return mergeCatalogIntoGuideMeta(meta, row)
}

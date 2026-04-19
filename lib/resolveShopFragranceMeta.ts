import 'server-only'

import type { GuideFrontmatter } from '~/lib/docs'
import { getFragranceByName } from '~/lib/fragrances'

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
  if (!row) return meta

  const dbFamily = row.family?.trim()
  const dbBrand = row.brand?.trim()
  const dbLine = row.line?.trim()
  const dbDescription = row.description?.trim()

  if (!dbFamily && !dbBrand && !dbLine && !dbDescription) return meta

  return {
    ...meta,
    ...(dbFamily ? { family: dbFamily } : {}),
    ...(dbBrand ? { brand: dbBrand } : {}),
    ...(dbLine ? { line: dbLine } : {}),
    ...(dbDescription ? { description: dbDescription } : {}),
  }
}

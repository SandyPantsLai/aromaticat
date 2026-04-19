import 'server-only'

import type { GuideFrontmatter } from '~/lib/docs'
import { getFragranceByName } from '~/lib/fragrances'

/** Section index pages (e.g. `/shop/decants/overview`) are not single products — skip DB lookup. */
export function shopPathSkipsFragranceCatalogLookup(pathname: string): boolean {
  return pathname.endsWith('/overview')
}

/**
 * When `title` matches a row, merge non-empty `family` and `brand` from Supabase
 * (`notion.fragrances.attrs.name`, case-insensitive; `attrs.brand` maps to frontmatter `brand`).
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

  if (!dbFamily && !dbBrand) return meta

  return {
    ...meta,
    ...(dbFamily ? { family: dbFamily } : {}),
    ...(dbBrand ? { brand: dbBrand } : {}),
  }
}

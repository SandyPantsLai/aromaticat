import type { GuideFrontmatter } from '~/lib/docs'
import type { FragranceRow } from '~/lib/fragrancesQuery'

/**
 * Merges catalog fields from a `fragrances` row into guide/MDX meta when non-empty.
 * Shared by runtime shop resolution and FTS indexing so behavior stays aligned.
 */
export function mergeCatalogIntoGuideMeta(
  meta: GuideFrontmatter,
  row: FragranceRow | null
): GuideFrontmatter {
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

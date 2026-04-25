import { FragranceCatalogImage } from '~/components/fragrance/FragranceCatalogImage'
import { loadFragranceByName } from '~/components/fragrance/loadFragrance'

/**
 * Loads the fragram image URL from `notion.fragrances.attrs` (plain strings or Notion-style
 * `file` / `external` objects) by `attrs.name` (case-insensitive).
 * Uses a plain `<img>` so catalog hosts (Notion S3, retailers, etc.) are not blocked by Next image `remotePatterns`.
 */
export async function Fragram({
  name,
  alt,
  className,
}: {
  name: string
  alt?: string
  className?: string
}) {
  const row = await loadFragranceByName(name)
  if (!row) return null

  const url = row.fragram?.trim() ?? ''
  const altText =
    (alt ?? [row.brand, row.name].filter(Boolean).join(' ')).trim() || 'Fragram'

  return <FragranceCatalogImage url={url} alt={altText} aspect="1/1" className={className} />
}

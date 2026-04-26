import { cn } from 'ui'

import { loadFragranceByName } from '~/components/fragrance/loadFragrance'
import type { FragranceRow } from '~/lib/fragrancesQuery'

const linkClass =
  'text-brand-link hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm'

/** Renders external review links from `row.parfumo` / `row.fragrantica` when set. */
export function FragranceLinksView({
  row,
  className,
}: {
  row: FragranceRow
  className?: string
}) {
  const parfumo = row.parfumo?.trim() ?? ''
  const fragrantica = row.fragrantica?.trim() ?? ''
  if (!parfumo && !fragrantica) return null

  return (
    <p className={cn('not-prose flex flex-wrap items-center gap-x-3 gap-y-1 text-sm', className)}>
      {parfumo ? (
        <a href={parfumo} className={linkClass} target="_blank" rel="noreferrer noopener">
          See Parfumo
        </a>
      ) : null}
      {fragrantica ? (
        <a href={fragrantica} className={linkClass} target="_blank" rel="noreferrer noopener">
          See Fragrantica
        </a>
      ) : null}
    </p>
  )
}

/**
 * Loads a row by `notion.fragrances` name and renders Parfumo / Fragrantica links when URLs exist.
 */
export async function FragranceLinks({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  const row = await loadFragranceByName(name.trim())
  if (!row) return null
  return <FragranceLinksView row={row} className={className} />
}

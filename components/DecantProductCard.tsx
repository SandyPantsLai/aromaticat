import Link from 'next/link'
import { Badge, Card, CardContent, cn } from 'ui'

import { displayInfo, describeCostPerMl } from '~/components/fragrance/format'
import { FragranceCatalogImage } from '~/components/fragrance/FragranceCatalogImage'
import { loadFragranceByName } from '~/components/fragrance/loadFragrance'
import type { FragranceRow } from '~/lib/fragrancesQuery'

/** When to show a **Sold out** badge (uses `remaining_ml === 0` only; `null` is treated as unknown). */
export type DecantProductCardSoldOutRule = 'when_remaining_zero' | 'never'

export function DecantProductCardNotFound({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'not-prose h-full min-h-0 rounded-lg border border-dashed border-default bg-surface-100 p-4 text-sm text-foreground-lighter',
        className
      )}
      data-decant-name={name}
    >
      No fragrance found for <code className="text-xs">{name}</code>.
    </div>
  )
}

export function DecantProductCardView({
  row,
  href,
  showFamily = false,
  soldOutRule = 'when_remaining_zero',
  className,
}: {
  row: FragranceRow
  href: string
  showFamily?: boolean
  soldOutRule?: DecantProductCardSoldOutRule
  className?: string
}) {
  const altText = [row.brand, row.name].filter(Boolean).join(' ').trim() || 'Fragrance'
  const url = row.image?.trim() ?? ''
  const isSoldOut =
    soldOutRule === 'when_remaining_zero' && row.remaining_ml != null && row.remaining_ml === 0
  const priceText = describeCostPerMl(row.cost_per_ml ?? null)

  const media = url ? (
    <FragranceCatalogImage url={url} alt={altText} aspect="3/4" variant="grid" />
  ) : (
    <div
      className="relative w-full overflow-hidden bg-surface-200"
      style={{ aspectRatio: '3 / 4' }}
      aria-hidden
    />
  )

  const cardInner = (
    <Card
      className={cn(
        'flex h-full min-h-0 flex-col overflow-hidden border border-default bg-surface-100 p-0 shadow-sm transition-colors',
        'group-hover:border-overlay'
      )}
    >
      <div className="relative shrink-0">
        {isSoldOut ? (
          <Badge variant="destructive" className="absolute left-2 top-2 z-10 text-[10px] uppercase">
            Sold out
          </Badge>
        ) : null}
        {media}
      </div>
      <CardContent className="flex flex-1 flex-col border-b-0 px-4 pb-2 pt-4 text-center">
        {showFamily && row.family?.trim() ? (
          <Badge variant="default" className="w-fit font-normal normal-case tracking-normal">
            {row.family.trim()}
          </Badge>
        ) : null}
        <p className="m-0 text-xs text-foreground-lighter line-clamp-1">{displayInfo(row.brand)}</p>
        <p className="m-0 text-sm font-semibold leading-snug text-foreground line-clamp-2">
          {displayInfo(row.name)}
        </p>
        <p className="m-0 mt-auto font-normal text-sm text-foreground" translate="no">
          {priceText}
        </p>
      </CardContent>
    </Card>
  )

  return (
    <Link
      href={href}
      className={cn(
        'group block h-full min-h-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className
      )}
    >
      {cardInner}
    </Link>
  )
}

export async function DecantProductCard({
  name,
  href,
  showFamily = false,
  soldOutRule = 'when_remaining_zero',
  className,
}: {
  /** `notion.fragrances.attrs.name` (case-insensitive). */
  name: string
  /** Shop MDX route, e.g. `/shop/decants/northern`. */
  href: string
  showFamily?: boolean
  soldOutRule?: DecantProductCardSoldOutRule
  className?: string
}) {
  const row = await loadFragranceByName(name)

  if (!row) {
    return <DecantProductCardNotFound name={name} className={className} />
  }

  return (
    <DecantProductCardView
      row={row}
      href={href}
      showFamily={showFamily}
      soldOutRule={soldOutRule}
      className={className}
    />
  )
}

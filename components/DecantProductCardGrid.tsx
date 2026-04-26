import { cn } from 'ui'

import {
  DecantProductCardNotFound,
  DecantProductCardView,
  type DecantProductCardSoldOutRule,
} from '~/components/DecantProductCard'
import { getFragrancesByNames } from '~/lib/fragrances'
import type { FragranceRow } from '~/lib/fragrancesQuery'

export type DecantProductCardGridItem = { name: string; href: string }

export function mapFragranceRowsByNameLower(rows: FragranceRow[]): Map<string, FragranceRow> {
  const m = new Map<string, FragranceRow>()
  for (const r of rows) {
    const k = r.name.trim().toLowerCase()
    if (k) m.set(k, r)
  }
  return m
}

/** Sync tile cells for reuse inside a CSS grid or carousel wrapper (caller supplies `byLower` from one batch fetch). */
export function DecantProductCardGridCells({
  items,
  byLower,
  showFamily = false,
  soldOutRule = 'when_remaining_zero',
}: {
  items: readonly DecantProductCardGridItem[]
  byLower: Map<string, FragranceRow>
  showFamily?: boolean
  soldOutRule?: DecantProductCardSoldOutRule
}) {
  return items.map((item) => {
    const key = item.name.trim().toLowerCase()
    const row = key ? byLower.get(key) ?? null : null
    return (
      <div key={item.href} className="h-full min-h-0 min-w-0">
        {row ? (
          <DecantProductCardView
            row={row}
            href={item.href}
            showFamily={showFamily}
            soldOutRule={soldOutRule}
          />
        ) : (
          <DecantProductCardNotFound name={item.name} />
        )}
      </div>
    )
  })
}

/**
 * Responsive CSS grid of decant tiles (one batched `getFragrancesByNames` query).
 * For horizontal arrows when there are many cards, use {@link DecantsOverviewCarousel} with the same `items` + {@link DecantProductCardGridCells}, or {@link DecantsOverviewSection} with `layout="carousel"`.
 */
export async function DecantProductCardGrid({
  items,
  showFamily = false,
  soldOutRule = 'when_remaining_zero',
  className,
}: {
  items: readonly DecantProductCardGridItem[]
  showFamily?: boolean
  soldOutRule?: DecantProductCardSoldOutRule
  className?: string
}) {
  if (items.length === 0) return null

  const names = items.map((i) => i.name)
  const rows = await getFragrancesByNames(names)
  const byLower = mapFragranceRowsByNameLower(rows)

  return (
    <div
      className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-3 not-prose', className)}
    >
      <DecantProductCardGridCells
        items={items}
        byLower={byLower}
        showFamily={showFamily}
        soldOutRule={soldOutRule}
      />
    </div>
  )
}

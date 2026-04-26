import { cn } from 'ui'

import type { DecantProductCardSoldOutRule } from '~/components/DecantProductCard'
import {
  DecantProductCardGridCells,
  mapFragranceRowsByNameLower,
} from '~/components/DecantProductCardGrid'
import { DecantsOverviewCarousel } from '~/components/DecantsOverviewCarousel'
import {
  DECANTS_OVERVIEW_SECTIONS,
  type DecantsOverviewCategory,
} from '~/config/shop/decantsOverviewSections'
import { getFragrancesByNames } from '~/lib/fragrances'

type DecantTileItem = { name: string; href: string }

function entriesToItems(
  entries: readonly { readonly slug: string; readonly name: string }[]
): DecantTileItem[] {
  return entries.map(({ slug, name }) => ({
    name,
    href: `/shop/decants/${slug}`,
  }))
}

export async function DecantsOverviewSection({
  category,
  className,
  layout = 'grid',
  showFamily = false,
  soldOutRule = 'when_remaining_zero',
}: {
  category: DecantsOverviewCategory
  className?: string
  /** `grid`: responsive CSS columns. `carousel`: horizontal row with chevrons when items overflow. */
  layout?: 'grid' | 'carousel'
  showFamily?: boolean
  soldOutRule?: DecantProductCardSoldOutRule
}) {
  const { title, entries } = DECANTS_OVERVIEW_SECTIONS[category]
  const items = entriesToItems(entries)
  const names = items.map((i) => i.name)
  const rows = await getFragrancesByNames(names)
  const byLower = mapFragranceRowsByNameLower(rows)
  const headingId = `decants-overview-${String(category)}`

  const cells = (
    <DecantProductCardGridCells
      items={items}
      byLower={byLower}
      showFamily={showFamily}
      soldOutRule={soldOutRule}
    />
  )

  return (
    <section className={cn('not-prose my-8', className)} aria-labelledby={headingId}>
      <h2
        id={headingId}
        className="mb-4 scroll-mt-[calc(var(--header-height)+0.5rem)] text-2xl font-semibold tracking-tight text-foreground"
      >
        {title}
      </h2>
      {items.length > 0 ? (
        layout === 'carousel' ? (
          <DecantsOverviewCarousel>{cells}</DecantsOverviewCarousel>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{cells}</div>
        )
      ) : null}
    </section>
  )
}

import { Fragment } from 'react'
import { cn } from 'ui'

import {
  DecantProductCardNotFound,
  DecantProductCardView,
  type DecantProductCardSoldOutRule,
} from '~/components/DecantProductCard'
import {
  DECANTS_OVERVIEW_SECTIONS,
  type DecantsOverviewCategory,
} from '~/config/shop/decantsOverviewSections'
import { getFragrancesByNames } from '~/lib/fragrances'
import type { FragranceRow } from '~/lib/fragrancesQuery'

type DecantTileItem = { name: string; href: string }

function rowMapByNameLower(rows: FragranceRow[]): Map<string, FragranceRow> {
  const m = new Map<string, FragranceRow>()
  for (const r of rows) {
    const k = r.name.trim().toLowerCase()
    if (k) m.set(k, r)
  }
  return m
}

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
  showFamily = false,
  soldOutRule = 'when_remaining_zero',
}: {
  category: DecantsOverviewCategory
  className?: string
  showFamily?: boolean
  soldOutRule?: DecantProductCardSoldOutRule
}) {
  const { title, entries } = DECANTS_OVERVIEW_SECTIONS[category]
  const items = entriesToItems(entries)
  const names = items.map((i) => i.name)
  const rows = await getFragrancesByNames(names)
  const byLower = rowMapByNameLower(rows)
  const headingId = `decants-overview-${String(category)}`

  return (
    <section className={cn('not-prose my-8', className)} aria-labelledby={headingId}>
      <h2
        id={headingId}
        className="mb-4 scroll-mt-[calc(var(--header-height)+0.5rem)] text-2xl font-semibold tracking-tight text-foreground"
      >
        {title}
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="contents">
          {items.map((item) => {
            const key = item.name.trim().toLowerCase()
            const row = key ? byLower.get(key) ?? null : null
            return (
              <Fragment key={item.href}>
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
              </Fragment>
            )
          })}
        </div>
      </div>
    </section>
  )
}

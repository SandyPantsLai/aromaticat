import Link from 'next/link'
import { Card, CardContent, cn } from 'ui'

import { FragranceCatalogImage } from '~/components/fragrance/FragranceCatalogImage'
import { isSafeHttpUrl } from '~/components/fragrance/format'
import { BOTTLES_OVERVIEW_INVENTORY } from '~/config/shop/bottlesOverviewInventory'
import { BASE_PATH } from '~/lib/constants'

function resolvePublicImageSrc(src: string): string {
  const t = src.trim()
  if (t.startsWith('/')) return `${BASE_PATH}${t}`
  return `${BASE_PATH}/${t}`
}

function BottleTileImage({ src, alt }: { src: string; alt: string }) {
  const u = src.trim()
  if (isSafeHttpUrl(u)) {
    return <FragranceCatalogImage url={u} alt={alt} aspect="3/4" variant="grid" />
  }
  const path = resolvePublicImageSrc(u)
  return (
    <div className="not-prose w-full">
      <div
        className="relative w-full overflow-hidden rounded-none bg-surface-200"
        style={{ aspectRatio: '3 / 4' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- local public paths + arbitrary URLs */}
        <img
          src={path}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  )
}

function BottleInventoryCard({
  entry,
  className,
}: {
  entry: (typeof BOTTLES_OVERVIEW_INVENTORY)[number]
  className?: string
}) {
  const alt = [entry.brand, entry.name].filter(Boolean).join(' ').trim() || 'Bottle'
  const media = <BottleTileImage src={entry.image} alt={alt} />

  const cardInner = (
    <Card
      className={cn(
        'flex h-full min-h-0 flex-col overflow-hidden border border-default bg-surface-100 p-0 shadow-sm transition-colors',
        entry.href ? 'group-hover:border-overlay' : ''
      )}
    >
      <div className="relative shrink-0">{media}</div>
      <CardContent className="flex flex-1 flex-col border-b-0 px-4 pb-2 pt-4 text-center">
        <p className="m-0 text-xs text-foreground-lighter line-clamp-1">{entry.brand}</p>
        <p className="m-0 text-sm font-semibold leading-snug text-foreground line-clamp-2">{entry.name}</p>
        <p className="m-0 pt-1 text-xs text-foreground-muted">
          <span translate="no">{entry.condition}</span>
        </p>
        <div className="mt-auto flex flex-col gap-1 pt-2 text-sm text-foreground">
          <p className="m-0 text-xs text-foreground-muted">
            Remaining (ml): <span translate="no">{entry.remainingMl}</span>
          </p>
          <p className="m-0 text-xs text-foreground-muted">
            Bottle size (ml): <span translate="no">{entry.bottleSizeMl}</span>
          </p>
          <p className="m-0 font-medium" translate="no">
            {entry.cost}
          </p>
        </div>
      </CardContent>
    </Card>
  )

  if (entry.href?.trim()) {
    const href = entry.href.trim()
    const isExternal = /^https?:\/\//i.test(href)
    return (
      <Link
        href={href}
        className={cn(
          'group block h-full min-h-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          className
        )}
        {...(isExternal ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      >
        {cardInner}
      </Link>
    )
  }

  return <div className={cn('h-full min-h-0 min-w-0', className)}>{cardInner}</div>
}

/**
 * Responsive grid of manual bottle tiles (same column layout as decant overview grids).
 */
export function BottlesOverviewGrid({ className }: { className?: string }) {
  if (BOTTLES_OVERVIEW_INVENTORY.length === 0) return null

  return (
    <div className={cn('not-prose grid gap-6 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {BOTTLES_OVERVIEW_INVENTORY.map((entry, i) => (
        <BottleInventoryCard key={`${entry.brand}-${entry.name}-${i}`} entry={entry} />
      ))}
    </div>
  )
}

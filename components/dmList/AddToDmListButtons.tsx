'use client'

import { useMemo, useState } from 'react'
import {
  decantLineTotalCents,
  formatCadFromCents,
  parseLumpPriceToCents,
} from '~/components/fragrance/format'
import { useDmList } from '~/features/shop/dmList/dmListContext'
import { makeBottleId, makeCatchReleaseId, makeDecantId } from '~/features/shop/dmList/storage'
import { DECANT_SIZE_ML, type DmListBottleItem, type DmListCatchAndReleaseItem, type DmListDecantItem, type DecantSizeMl } from '~/features/shop/dmList/types'
import { Button, cn } from 'ui'

type AddDecantProps = {
  slug: string
  brand: string
  name: string
  /** e.g. Notion / catalog row `id` — used when `slug` is empty so list ids stay unique. */
  catalogId?: string
  /** e.g. `$3.25/ml` for display, must match the tile. */
  rateLabel: string
  href: string
  costPerMl: number | null
  disabled?: boolean
  className?: string
}

/**
 * Chose 3, 5, or 10 ml, shows est. line total = rate × ml, then add to the list.
 */
export function AddDecantToDmListButton({
  slug,
  brand,
  name,
  catalogId,
  rateLabel,
  href,
  costPerMl,
  disabled = false,
  className,
}: AddDecantProps) {
  const { add } = useDmList()
  const [sizeMl, setSizeMl] = useState<DecantSizeMl>(3)

  const { lineTotalCents, lineTotalLabel } = useMemo(() => {
    if (disabled || costPerMl == null || costPerMl < 0) {
      return { lineTotalCents: null as number | null, lineTotalLabel: '—' as string }
    }
    const c = decantLineTotalCents(costPerMl, sizeMl)
    return { lineTotalCents: c, lineTotalLabel: formatCadFromCents(c) }
  }, [costPerMl, sizeMl, disabled])

  /** `gap-1` (0.25rem) ×2 + 3 equal chips — total bar width; add button matches this width. */
  return (
    <div
      className={cn(
        'flex w-[7.7rem] max-w-full shrink-0 flex-col gap-1.5 min-w-0',
        className
      )}
    >
      <div
        className="flex w-full min-w-0 items-stretch gap-1"
        role="group"
        aria-label="Decant size in milliliters"
      >
        {DECANT_SIZE_ML.map((s) => (
          <Button
            key={s}
            type={sizeMl === s ? 'primary' : 'outline'}
            className="h-8 min-h-0 min-w-0 flex-1 basis-0 px-1.5 text-xs"
            onClick={() => setSizeMl(s)}
            htmlType="button"
            disabled={disabled}
            aria-pressed={sizeMl === s}
            aria-label={`${s} ml`}
          >
            {s}ml
          </Button>
        ))}
      </div>
      <p
        className="m-0 w-full min-w-0 break-words text-center text-xs leading-snug text-foreground-muted [overflow-wrap:anywhere]"
        translate="no"
        aria-live="polite"
      >
        {costPerMl != null && costPerMl >= 0
          ? `${lineTotalLabel} for ${sizeMl} ml`
          : `${rateLabel} (total TBD) · ${sizeMl} ml`}
      </p>
      <Button
        type="outline"
        className="h-9 w-full min-w-0 text-xs"
        disabled={disabled}
        onClick={() => {
          const item: DmListDecantItem = {
            type: 'decant',
            id: makeDecantId(slug, sizeMl, { name, catalogId }),
            brand: brand || '—',
            name: name || '—',
            href,
            sizeMl,
            rateLabel,
            costPerMl,
            lineTotalLabel,
            lineTotalCents,
          }
          add(item)
        }}
      >
        Add to List
      </Button>
    </div>
  )
}

type BottleConfig = {
  brand: string
  name: string
  condition: string
  remainingMl: string
  bottleSizeMl: string
  cost: string
  href?: string
}

export function AddBottleToDmListButton({ entry, className }: { entry: BottleConfig; className?: string }) {
  const { add } = useDmList()
  const item: DmListBottleItem = {
    type: 'bottle',
    id: makeBottleId(entry.brand, entry.name),
    ...entry,
    lineTotalCents: parseLumpPriceToCents(entry.cost),
  }
  return (
    <Button
      type="outline"
      className={cn('w-full gap-1.5 text-xs', className)}
      onClick={() => add(item)}
    >
      Add to List
    </Button>
  )
}

type CatchConfig = {
  brand: string
  name: string
  remainingMl: string
  bottleSizeMl: string
  cost: string
  comments: string
}

export function AddCatchReleaseToDmListButton({ row, className }: { row: CatchConfig; className?: string }) {
  const { add } = useDmList()
  const item: DmListCatchAndReleaseItem = {
    type: 'catchAndRelease',
    id: makeCatchReleaseId(row.brand, row.name),
    ...row,
    lineTotalCents: parseLumpPriceToCents(row.cost),
  }
  return (
    <Button
      type="outline"
      size="tiny"
      className={cn('shrink-0 gap-1', className)}
      onClick={() => add(item)}
    >
      Add
    </Button>
  )
}

import { parseLumpPriceToCents } from '~/components/fragrance/format'

import type { DmListItem } from './types'

/** Cents for one list line, or `null` when the price is unknown / not parseable. */
export function getListLineCents(item: DmListItem): number | null {
  if (item.type === 'decant') {
    return item.lineTotalCents ?? null
  }
  if (item.type === 'bottle' || item.type === 'catchAndRelease') {
    if (item.lineTotalCents != null) return item.lineTotalCents
    return parseLumpPriceToCents(item.cost)
  }
  return null
}

export type DmListMoneyBreakdown = {
  decantCents: number
  bottleCents: number
  cnrCents: number
  subtotalCents: number
  knownLineCount: number
  unknownLineCount: number
}

/**
 * Sums all lines with a number price. Decants use `lineTotalCents`; bottle/C&R use stored or parsed
 * `cost` text. Legacy rows without `lineTotalCents` for bottles are still included when `cost` parses.
 */
export function breakdownListMoney(items: readonly DmListItem[]): DmListMoneyBreakdown {
  let decantCents = 0
  let bottleCents = 0
  let cnrCents = 0
  let knownLineCount = 0
  let unknownLineCount = 0

  for (const it of items) {
    const c = getListLineCents(it)
    if (c == null) {
      unknownLineCount += 1
      continue
    }
    knownLineCount += 1
    if (it.type === 'decant') decantCents += c
    else if (it.type === 'bottle') bottleCents += c
    else cnrCents += c
  }

  return {
    decantCents,
    bottleCents,
    cnrCents,
    subtotalCents: decantCents + bottleCents + cnrCents,
    knownLineCount,
    unknownLineCount,
  }
}

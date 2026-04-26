export const DECANT_SIZE_ML = [3, 5, 10] as const
export type DecantSizeMl = (typeof DECANT_SIZE_ML)[number]

export type DmListDecantItem = {
  type: 'decant'
  id: string
  brand: string
  name: string
  href: string
  /** Chosen decant size (ml). */
  sizeMl: DecantSizeMl
  /** Display of $/ml (e.g. from `describeCostPerMl`). */
  rateLabel: string
  /** `cost_per_ml` when known, for totals and re-display. */
  costPerMl: number | null
  /** e.g. `$9.75` = rate × `sizeMl`, or `—` if rate unknown. */
  lineTotalLabel: string
  /** Integer cents for summing; null when rate unknown. */
  lineTotalCents: number | null
  /** v1 only (before size + line total) */
  priceLabel?: string
}

export type DmListBottleItem = {
  type: 'bottle'
  id: string
  brand: string
  name: string
  condition: string
  remainingMl: string
  bottleSizeMl: string
  cost: string
  /** Set from `cost` on add; used for list totals. */
  lineTotalCents?: number | null
  href?: string
}

export type DmListCatchAndReleaseItem = {
  type: 'catchAndRelease'
  id: string
  brand: string
  name: string
  remainingMl: string
  bottleSizeMl: string
  cost: string
  /** Set from `cost` on add; used for list totals. */
  lineTotalCents?: number | null
  comments: string
}

export type DmListItem = DmListDecantItem | DmListBottleItem | DmListCatchAndReleaseItem

export const DM_LIST_STORAGE_KEY = 'aromaticat:dm-list:v1'

function isSizeMl(n: unknown): n is DecantSizeMl {
  return n === 3 || n === 5 || n === 10
}

export function isDmListItem(v: unknown): v is DmListItem {
  if (v == null || typeof v !== 'object') return false
  const t = (v as { type?: string }).type
  if (t === 'bottle' || t === 'catchAndRelease') {
    return typeof (v as { id?: string }).id === 'string' && (v as { id: string }).id.length > 0
  }
  if (t === 'decant') {
    const d = v as { id?: unknown; sizeMl?: unknown; priceLabel?: unknown }
    if (typeof d.id !== 'string' || d.id.length === 0) return false
    if (d.sizeMl != null) return isSizeMl(d.sizeMl)
    // v1: `priceLabel` only
    return typeof d.priceLabel === 'string'
  }
  return false
}

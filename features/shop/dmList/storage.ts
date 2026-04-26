import { DM_LIST_STORAGE_KEY, type DmListDecantItem, type DmListItem, isDmListItem, type DecantSizeMl } from './types'

export { DM_LIST_STORAGE_KEY }

const EMPTY: readonly DmListItem[] = []

function isSizeMl(n: unknown): n is DecantSizeMl {
  return n === 3 || n === 5 || n === 10
}

/**
 * v1 decants: `id` = `decant:slug`, `priceLabel` only, no `sizeMl`.
 * Upgrades to v2 (default 3 ml, unknown line total) so new adds use the same `id` shape.
 */
function migrateLegacyDecant(raw: DmListItem & { priceLabel?: string }): DmListDecantItem {
  const d = raw as DmListDecantItem
  const slug = d.id.replace(/^decant:/, '').replace(/--(3|5|10)ml$/i, '') || 'item'
  return {
    type: 'decant',
    id: makeDecantId(slug, 3),
    brand: d.brand,
    name: d.name,
    href: d.href,
    sizeMl: 3,
    rateLabel: d.rateLabel ?? d.priceLabel ?? '—',
    costPerMl: d.costPerMl ?? null,
    lineTotalLabel: d.lineTotalLabel ?? '—',
    lineTotalCents: d.lineTotalCents ?? null,
  }
}

function mapItem(v: DmListItem): DmListItem {
  if (v.type !== 'decant') return v
  if (isSizeMl((v as DmListDecantItem).sizeMl)) {
    const d = v as DmListDecantItem
    return {
      ...d,
      lineTotalLabel: d.lineTotalLabel ?? '—',
      lineTotalCents: d.lineTotalCents ?? null,
      rateLabel: d.rateLabel ?? d.priceLabel ?? '—',
    }
  }
  return migrateLegacyDecant(v)
}

/**
 * Read and parse stored list, or an empty list if missing or invalid.
 */
export function readDmList(): DmListItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(DM_LIST_STORAGE_KEY)
    if (raw == null) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(isDmListItem)
      .map((it) => mapItem(it as DmListItem))
  } catch {
    return []
  }
}

export function writeDmList(items: readonly DmListItem[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(DM_LIST_STORAGE_KEY, JSON.stringify(items))
  } catch {
    // ignore quota / private mode
  }
}

/**
 * Add or update by `item.id` (keeps a single line per id for easy screenshots).
 */
export function upsertItem(items: readonly DmListItem[], item: DmListItem): DmListItem[] {
  const next = [...items]
  const i = next.findIndex((e) => e.id === item.id)
  if (i >= 0) next[i] = item
  else next.push(item)
  return next
}

export function removeById(items: readonly DmListItem[], id: string): DmListItem[] {
  return items.filter((e) => e.id !== id)
}

export function makeDecantId(slug: string, sizeMl: DecantSizeMl) {
  return `decant:${slug.trim().toLowerCase()}--${sizeMl}ml`
}

export function makeBottleId(brand: string, name: string) {
  return `bottle:${slugPart(brand)}--${slugPart(name)}`
}

export function makeCatchReleaseId(brand: string, name: string) {
  return `cnr:${slugPart(brand)}--${slugPart(name)}`
}

function slugPart(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80) || 'item'
}

export const emptyDmList = EMPTY

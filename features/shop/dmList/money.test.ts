import { parseLumpPriceToCents } from '~/components/fragrance/format'

import { breakdownListMoney, getListLineCents } from './money'
import { makeBottleId, makeCatchReleaseId, makeDecantId } from './storage'
import type { DmListBottleItem, DmListCatchAndReleaseItem, DmListDecantItem, DmListItem } from './types'
import { describe, expect, it } from 'vitest'

const decant = (cents: number | null, slug = 'x', size = 3 as 3 | 5 | 10): DmListDecantItem => ({
  type: 'decant',
  id: makeDecantId(slug, size),
  brand: 'B',
  name: 'N',
  href: '/a',
  sizeMl: size,
  rateLabel: '$1/ml',
  costPerMl: 1,
  lineTotalLabel: '—',
  lineTotalCents: cents,
})

const bottle = (cost: string, c?: number | null): DmListBottleItem => ({
  type: 'bottle',
  id: makeBottleId('A', 'B'),
  brand: 'A',
  name: 'B',
  condition: 'new',
  remainingMl: '1',
  bottleSizeMl: '1',
  cost,
  lineTotalCents: c,
})

const cnr = (cost: string, c?: number | null): DmListCatchAndReleaseItem => ({
  type: 'catchAndRelease',
  id: makeCatchReleaseId('A', 'B'),
  brand: 'A',
  name: 'B',
  remainingMl: '1',
  bottleSizeMl: '1',
  cost,
  lineTotalCents: c,
  comments: '—',
})

describe('parseLumpPriceToCents', () => {
  it('parses common cost strings', () => {
    expect(parseLumpPriceToCents('$8')).toBe(800)
    expect(parseLumpPriceToCents(' $100.00 ')).toBe(10_000)
    expect(parseLumpPriceToCents('$1,200.50')).toBe(120_050)
  })

  it('rejects TBD and empty', () => {
    expect(parseLumpPriceToCents('TBD')).toBeNull()
    expect(parseLumpPriceToCents(' trade ')).toBeNull()
  })
})

describe('breakdownListMoney', () => {
  it('sums all types', () => {
    const items: DmListItem[] = [decant(300), bottle('$100', 10_000), cnr('$8.50', 850), decant(500, 'y', 5)]
    const b = breakdownListMoney(items)
    expect(b.decantCents).toBe(800) // 300+500
    expect(b.bottleCents).toBe(10_000)
    expect(b.cnrCents).toBe(850)
    expect(b.subtotalCents).toBe(11_650)
    expect(b.knownLineCount).toBe(4)
    expect(b.unknownLineCount).toBe(0)
  })

  it('parses bottle cost from text when lineTotalCents missing', () => {
    const b = bottle('$9', null)
    const x = getListLineCents(b)
    expect(x).toBe(900)
  })

  it('counts unpriced decant', () => {
    const s = breakdownListMoney([decant(null)])
    expect(s.knownLineCount).toBe(0)
    expect(s.unknownLineCount).toBe(1)
    expect(s.subtotalCents).toBe(0)
  })
})

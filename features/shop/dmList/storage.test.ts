import { describe, expect, it } from 'vitest'

import {
  makeBottleId,
  makeCatchReleaseId,
  makeDecantId,
  removeById,
  upsertItem,
} from './storage'
import type { DmListBottleItem, DmListDecantItem } from './types'
import { isDmListItem } from './types'

const sampleDecantV2 = (): DmListDecantItem => ({
  type: 'decant',
  id: makeDecantId('lotus-flower', 3),
  brand: 'B',
  name: 'N',
  href: '/shop/decants/lotus-flower',
  sizeMl: 3,
  rateLabel: '$1.00/ml',
  costPerMl: 1,
  lineTotalLabel: '$3.00',
  lineTotalCents: 300,
})

const sampleBottle = (): DmListBottleItem => ({
  type: 'bottle',
  id: makeBottleId('X', 'Y'),
  brand: 'X',
  name: 'Y',
  condition: 'new',
  remainingMl: '30',
  bottleSizeMl: '30',
  cost: '$10',
})

describe('upsertItem', () => {
  it('appends new id', () => {
    const a = sampleDecantV2()
    const b = sampleBottle()
    expect(upsertItem([a], b)).toEqual([a, b])
  })

  it('replaces same id', () => {
    const a = sampleDecantV2()
    const a2: DmListDecantItem = { ...a, lineTotalLabel: '$2.00' }
    expect(upsertItem([a], a2)).toEqual([a2])
  })
})

describe('removeById', () => {
  it('filters by id', () => {
    const a = sampleDecantV2()
    const b = sampleBottle()
    expect(removeById([a, b], a.id)).toEqual([b])
  })
})

describe('make*Id', () => {
  it('decant id includes size', () => {
    expect(makeDecantId('Foo-BAR', 3)).toBe('decant:foo-bar--3ml')
    expect(makeDecantId('Foo-BAR', 5)).toBe('decant:foo-bar--5ml')
  })

  it('bottle and cnr differ for same brand/name', () => {
    expect(makeBottleId('A', 'B')).toMatch(/^bottle:/)
    expect(makeCatchReleaseId('A', 'B')).toMatch(/^cnr:/)
  })
})

describe('isDmListItem', () => {
  it('accepts v2 decant', () => {
    expect(isDmListItem(sampleDecantV2())).toBe(true)
  })

  it('accepts v1 decant (priceLabel only)', () => {
    expect(
      isDmListItem({
        type: 'decant',
        id: 'decant:legacy',
        brand: 'B',
        name: 'N',
        href: '/h',
        priceLabel: '$1/ml',
      })
    ).toBe(true)
  })

  it('rejects missing type', () => {
    expect(isDmListItem({ id: 'x' })).toBe(false)
  })
})

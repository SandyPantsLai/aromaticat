import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { GuideFrontmatter } from '~/lib/docs'
import type { FragranceRow } from '~/lib/fragrances'

vi.mock('~/lib/fragrances', () => ({
  getFragranceByName: vi.fn(),
}))

import { getFragranceByName } from '~/lib/fragrances'
import {
  resolveShopFragranceMeta,
  shopPathSkipsFragranceCatalogLookup,
} from '~/lib/resolveShopFragranceMeta'

const mockedGetFragranceByName = vi.mocked(getFragranceByName)

/** Minimal row: resolver only reads family, brand, line, description. */
function catalogRow(
  partial: Pick<Partial<FragranceRow>, 'family' | 'brand' | 'line' | 'description'>
): FragranceRow {
  return {
    id: '00000000-0000-4000-8000-000000000001',
    slug: 'test',
    brand: partial.brand ?? null,
    name: 'Test',
    line: partial.line ?? null,
    description: partial.description ?? null,
    rating: null,
    perfumer: null,
    bottle_type: null,
    cost_per_ml: null,
    paid_per_ml: null,
    remaining_ml: null,
    size_ml: null,
    received_ml: null,
    bottle_qty: null,
    paid: null,
    family: partial.family ?? null,
    top: null,
    mid: null,
    base: null,
    presentation: null,
    source: null,
    season: null,
    setting: null,
    gender: null,
    age: null,
    projection: null,
    sillage_min: null,
    longevity_hr: null,
    review: null,
    comments: null,
    parfumo: null,
    fragrantica: null,
    image: null,
    fragram: null,
    created_at: '',
    updated_at: '',
    notion_url: null,
  }
}

describe('shopPathSkipsFragranceCatalogLookup', () => {
  it('returns true for section overview paths', () => {
    expect(shopPathSkipsFragranceCatalogLookup('/shop/decants/overview')).toBe(true)
  })

  it('returns false for product paths', () => {
    expect(shopPathSkipsFragranceCatalogLookup('/shop/decants/northern')).toBe(false)
  })
})

describe('resolveShopFragranceMeta', () => {
  const baseMeta: GuideFrontmatter = {
    title: 'Northern',
    id: 'northern',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns meta unchanged when pathname is an overview page', async () => {
    const meta = { ...baseMeta }
    const out = await resolveShopFragranceMeta(meta, '/shop/decants/overview')
    expect(out).toEqual(meta)
    expect(mockedGetFragranceByName).not.toHaveBeenCalled()
  })

  it('returns meta unchanged when title is missing or blank', async () => {
    await resolveShopFragranceMeta({ title: '' })
    await resolveShopFragranceMeta({ title: '   ' })
    expect(mockedGetFragranceByName).not.toHaveBeenCalled()
  })

  it('returns meta unchanged when no catalog row matches', async () => {
    mockedGetFragranceByName.mockResolvedValue(null)
    const meta = { ...baseMeta }
    const out = await resolveShopFragranceMeta(meta, '/shop/decants/northern')
    expect(out).toEqual(meta)
    expect(mockedGetFragranceByName).toHaveBeenCalledWith('Northern')
  })

  it('returns meta unchanged when row has no family, brand, line, or description', async () => {
    mockedGetFragranceByName.mockResolvedValue(catalogRow({}))
    const meta = { ...baseMeta }
    const out = await resolveShopFragranceMeta(meta, '/shop/decants/northern')
    expect(out).toEqual(meta)
  })

  it('merges description when it is the only populated catalog field', async () => {
    mockedGetFragranceByName.mockResolvedValue(
      catalogRow({ description: '  A short blurb.  ' })
    )
    const out = await resolveShopFragranceMeta({ ...baseMeta }, '/shop/decants/northern')
    expect(out).toEqual({
      ...baseMeta,
      description: 'A short blurb.',
    })
  })

  it('merges family, brand, line, and description and preserves other frontmatter', async () => {
    mockedGetFragranceByName.mockResolvedValue(
      catalogRow({
        family: 'Amber',
        brand: 'Test House',
        line: 'Private Blend',
        description: 'Warm resinous scent.',
      })
    )
    const meta: GuideFrontmatter = {
      ...baseMeta,
      subtitle: 'Keep me',
    }
    const out = await resolveShopFragranceMeta(meta, '/shop/decants/northern')
    expect(out).toEqual({
      title: 'Northern',
      id: 'northern',
      subtitle: 'Keep me',
      family: 'Amber',
      brand: 'Test House',
      line: 'Private Blend',
      description: 'Warm resinous scent.',
    })
  })

  it('does not pass pathname when omitted; still resolves by title', async () => {
    mockedGetFragranceByName.mockResolvedValue(catalogRow({ brand: 'Solo' }))
    const out = await resolveShopFragranceMeta({ title: 'X' })
    expect(out.brand).toBe('Solo')
    expect(mockedGetFragranceByName).toHaveBeenCalledWith('X')
  })
})

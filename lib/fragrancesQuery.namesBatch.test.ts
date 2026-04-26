import { describe, expect, it } from 'vitest'

import {
  buildFragranceNamesOrFilter,
  FRAGRANCE_BATCH_NAME_LIMIT,
  FRAGRANCE_NAME_JSON_PATH,
  normalizeFragranceNamesForBatch,
  quotePostgrestFilterString,
} from '~/lib/fragrancesQuery'

describe('quotePostgrestFilterString', () => {
  it('wraps simple ASCII in double quotes', () => {
    expect(quotePostgrestFilterString('Northern')).toBe('"Northern"')
  })

  it('escapes embedded double quotes', () => {
    expect(quotePostgrestFilterString('say "hi"')).toBe('"say ""hi"""')
  })
})

describe('normalizeFragranceNamesForBatch', () => {
  it('returns empty for all blanks', () => {
    expect(normalizeFragranceNamesForBatch(['', '  ', '\t'])).toEqual([])
  })

  it('dedupes case-insensitively keeping first spelling', () => {
    expect(normalizeFragranceNamesForBatch(['Northern', ' northern ', 'NORTHERN'])).toEqual(['Northern'])
  })

  it('preserves order of first occurrences', () => {
    expect(normalizeFragranceNamesForBatch(['B', 'a', 'b'])).toEqual(['B', 'a'])
  })

  it('caps at FRAGRANCE_BATCH_NAME_LIMIT', () => {
    const many = Array.from({ length: FRAGRANCE_BATCH_NAME_LIMIT + 5 }, (_, i) => `n${i}`)
    expect(normalizeFragranceNamesForBatch(many).length).toBe(FRAGRANCE_BATCH_NAME_LIMIT)
  })
})

describe('buildFragranceNamesOrFilter', () => {
  it('returns null for empty input', () => {
    expect(buildFragranceNamesOrFilter([])).toBeNull()
    expect(buildFragranceNamesOrFilter(['', ' '])).toBeNull()
  })

  it('joins ilike clauses with comma', () => {
    const col = FRAGRANCE_NAME_JSON_PATH
    const out = buildFragranceNamesOrFilter(['Northern', 'Pomelo'])
    expect(out).toBe(
      `${col}.ilike."Northern",${col}.ilike."Pomelo"`
    )
  })

  it('quotes values with commas safely', () => {
    const col = FRAGRANCE_NAME_JSON_PATH
    const out = buildFragranceNamesOrFilter(['a,b'])
    expect(out).toBe(`${col}.ilike."a,b"`)
  })
})

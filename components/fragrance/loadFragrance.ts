import { getFragranceByName } from '~/lib/fragrances'
import type { FragranceRow } from '~/lib/fragrances'

/**
 * Single seam used by all `Fragrance*` MDX components for resolving a row by display name.
 * Trims input so callers can pass the raw MDX prop verbatim.
 *
 * Request- and cross-request caching live in `~/lib/fragrances` (`getFragranceByName`).
 */
export async function loadFragranceByName(name: string): Promise<FragranceRow | null> {
  return getFragranceByName(name.trim())
}

export type { FragranceRow }

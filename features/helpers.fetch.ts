/**
 * Next.js extends native `fetch` with revalidation options.
 *
 * This module provides some reusable utility functions to set revalidation
 * options for `fetch`, for example when it needs to be passed to a
 * third-party API.
 */

import { TIME_TO_CACHE } from './helpers.time'

export const REVALIDATION_TAGS = {
  GRAPHQL: 'graphql',
  PARTNERS: 'partners',
  WRAPPERS: 'wrappers',
  /** Bust `unstable_cache` for `getFragranceByName` / `notion.fragrances` (POST /api/revalidate). */
  NOTION_FRAGRANCES: 'notion-fragrances',
} as const
// Casting to avoid problems with using this as a Zod enum, TypeScript does
// not recognize the casted type as a supertype of the original type
export const VALID_REVALIDATION_TAGS = Object.values(REVALIDATION_TAGS) as unknown as readonly [
  string,
  ...string[],
]

function fetchWithNextOptions({
  next,
  cache,
}: {
  next?: NextFetchRequestConfig
  cache?: RequestInit['cache']
}) {
  return (info: RequestInfo) => fetch(info, { next, cache })
}

const fetchRevalidatePerDay = fetchWithNextOptions({
  next: { revalidate: TIME_TO_CACHE },
})

export { fetchRevalidatePerDay, fetchWithNextOptions }

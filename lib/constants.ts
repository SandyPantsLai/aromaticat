export const API_URL = (
  process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
    : process.env.NEXT_PUBLIC_API_URL!
)?.replace(/\/platform$/, '')
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/**
 * Public origin for canonical links and Next.js `metadataBase` (Open Graph / Twitter URL resolution).
 * Prefer `NEXT_PUBLIC_SITE_URL`; on Vercel use `VERCEL_URL`; local dev defaults to port 3001 (`pnpm dev`).
 */
export function getPublicSiteOrigin(): string {
  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '')
  if (site) return site
  const vercel = process.env.VERCEL_URL?.trim()
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, '')
    return `https://${host}`
  }
  return 'http://localhost:3001'
}

/** Use as `metadataBase` in root `generateMetadata` / static `metadata`. */
export const METADATA_BASE = new URL(`${getPublicSiteOrigin()}/`)
export const IS_CI = process.env.CI === 'true'
export const IS_DEV = process.env.NODE_ENV === 'development'
export const IS_PLATFORM = process.env.NEXT_PUBLIC_IS_PLATFORM === 'true'
export const IS_PRODUCTION = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
export const LOGFLARE_INGESTION_API_KEY = process.env.LOGFLARE_INGESTION_API_KEY
export const LOGFLARE_SOURCE_TOKEN = process.env.LOGFLARE_SOURCE_TOKEN
export const PROD_URL = `https://supabase.com${BASE_PATH}`

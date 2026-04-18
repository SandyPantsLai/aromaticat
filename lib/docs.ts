import { join } from 'node:path'

// MUST be process.cwd() here, not import.meta.url, or files that are added
// with outputFileTracingIncludes (not auto-traced) will not be found at
// runtime.
export const DOCS_DIRECTORY = process.cwd()
export const CONTENT_DIRECTORY = join(DOCS_DIRECTORY, 'content')
/** Fragrance MDX source; public URLs are `/fragrance-notes/...`. */
export const FRAGRANCE_NOTES_DIRECTORY = join(CONTENT_DIRECTORY, 'fragrance-notes')
/** Blog MDX source; public URLs are `/blog/...`. */
export const BLOG_DIRECTORY = join(CONTENT_DIRECTORY, 'blog')
/** Shop MDX source; URLs are `/shop/{bottles|decants|catch-and-release}/...`. */
export const SHOP_DIRECTORY = join(CONTENT_DIRECTORY, 'shop')
export const PARTIALS_DIRECTORY = join(CONTENT_DIRECTORY, '_partials')
export const REF_DOCS_DIRECTORY = join(DOCS_DIRECTORY, 'docs/ref')
export const SPEC_DIRECTORY = join(DOCS_DIRECTORY, 'spec')

export type GuideFrontmatter = {
  title: string
  /** Short tagline; prefer `family` for shop / fragrance-notes when both exist. */
  subtitle?: string
  /** Optional tagline for shop and fragrance-notes (falls back to `subtitle`). */
  family?: string
  /** House or line (e.g. shop product); shown in header and Open Graph when set. */
  brand?: string
  description?: string
  canonical?: string
  hideToc?: boolean
  /** @deprecated */
  hide_table_of_contents?: boolean
  tocVideo?: string
}

const OG_DESCRIPTION_MAX = 280

/**
 * Link-preview / OG image description: brand, then description or family or subtitle.
 */
export function composeOpenGraphDescription(meta: GuideFrontmatter): string | undefined {
  const blurb =
    meta.description?.trim() || meta.family?.trim() || meta.subtitle?.trim() || ''
  const brand = meta.brand?.trim() || ''
  const parts = [brand, blurb].filter(Boolean)
  if (!parts.length) return undefined
  let out = parts.join(' — ')
  if (out.length > OG_DESCRIPTION_MAX) {
    out = `${out.slice(0, OG_DESCRIPTION_MAX - 1)}…`
  }
  return out
}

/**
 * Validate the frontmatter for guide MDX files.
 *
 * @throws Throws if frontmatter is invalid.
 */
export function isValidGuideFrontmatter(obj: object): obj is GuideFrontmatter {
  if (!('title' in obj) || typeof obj.title !== 'string') {
    throw Error(
      // @ts-expect-error - Getting undefined for unknown property is desired here.
      `Invalid guide frontmatter: Title must exist and be a string. Received: ${obj.title}`
    )
  }
  if ('subtitle' in obj && typeof obj.subtitle !== 'string') {
    throw Error(`Invalid guide frontmatter: Subtitle must be a string. Received: ${obj.subtitle}`)
  }
  if ('family' in obj && typeof obj.family !== 'string') {
    throw Error(`Invalid guide frontmatter: family must be a string. Received: ${obj.family}`)
  }
  if ('brand' in obj && typeof obj.brand !== 'string') {
    throw Error(`Invalid guide frontmatter: brand must be a string. Received: ${obj.brand}`)
  }
  if ('description' in obj && typeof obj.description !== 'string') {
    throw Error(
      `Invalid guide frontmatter: Description must be a string. Received: ${obj.description}`
    )
  }
  if ('canonical' in obj && typeof obj.canonical !== 'string') {
    throw Error(`Invalid guide frontmatter: Canonical must be a string. Received: ${obj.canonical}`)
  }
  if ('hideToc' in obj && typeof obj.hideToc !== 'boolean') {
    throw Error(`Invalid guide frontmatter: hideToc must be a boolean. Received: ${obj.hideToc}`)
  }
  if ('hide_table_of_contents' in obj && typeof obj.hide_table_of_contents !== 'boolean') {
    throw Error(
      `Invalid guide frontmatter: hide_table_of_contents must be a boolean. Received ${obj.hide_table_of_contents}`
    )
  }
  if ('tocVideo' in obj && typeof obj.tocVideo !== 'string') {
    throw Error(`Invalid guide frontmatter: tocVideo must be a string. Received ${obj.tocVideo}`)
  }
  return true
}

import { cn } from 'ui'

import { isSafeHttpUrl } from './format'

interface FragranceCatalogImageProps {
  /** Catalog image URL; rejected unless `http(s):`. */
  url: string
  alt: string
  /**
   * Tailwind aspect-ratio class fragment, e.g. `3/4` for portrait bottles or `1/1` for fragrams.
   */
  aspect: string
  /**
   * `default`: doc-style block with vertical margin and max width.
   * `grid`: full width, no outer margin — for product tiles and dense layouts.
   */
  variant?: 'default' | 'grid'
  className?: string
}

/**
 * Plain `<img>` tile for a fragrance catalog asset. Bypasses Next image `remotePatterns`
 * so arbitrary HTTPS hosts (Notion S3, retailers, etc.) work without configuration.
 *
 * Returns `null` when `url` is missing or non-http(s).
 */
export function FragranceCatalogImage({
  url,
  alt,
  aspect,
  variant = 'default',
  className,
}: FragranceCatalogImageProps) {
  if (!url || !isSafeHttpUrl(url)) {
    return null
  }
  const outer =
    variant === 'grid'
      ? 'not-prose w-full'
      : 'not-prose my-6 w-full max-w-sm'
  const frameRadius = variant === 'grid' ? 'rounded-none' : 'rounded-md'
  return (
    <div className={cn(outer, className)}>
      <div
        className={cn('relative w-full overflow-hidden bg-surface-200', frameRadius)}
        style={{ aspectRatio: aspect.replace('/', ' / ') }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary https catalog URLs */}
        <img
          src={url}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  )
}

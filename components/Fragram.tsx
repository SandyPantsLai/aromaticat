import { cn } from 'ui'

import { getFragranceByName } from '~/lib/fragrances'

function isSafeHttpUrl(url: string): boolean {
  try {
    const u = new URL(url)
    return u.protocol === 'https:' || u.protocol === 'http:'
  } catch {
    return false
  }
}

/**
 * Loads the bottle image URL from `notion.fragrances.attrs` (plain strings or Notion-style
 * `file` / `external` objects) by `attrs.name` (case-insensitive).
 * Uses a plain `<img>` so catalog hosts (Notion S3, retailers, etc.) are not blocked by Next image `remotePatterns`.
 */
export async function Fragram({
  name,
  alt,
  className,
}: {
  name: string
  alt?: string
  className?: string
}) {
  const row = await getFragranceByName(name.trim())
  const raw = row?.fragram?.trim() ?? ''
  if (!row || !raw || !isSafeHttpUrl(raw)) {
    return null
  }

  const altText = (alt ?? [row.brand, row.name].filter(Boolean).join(' ')).trim() || 'Fragram'

  return (
    <div className={cn('not-prose my-6 w-full max-w-sm', className)}>
      <div className="relative aspect-[1/1] w-full overflow-hidden rounded-md">
        {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary https catalog URLs */}
        <img
          src={raw}
          alt={altText}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  )
}

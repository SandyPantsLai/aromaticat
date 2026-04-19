import { cn } from 'ui'

import Image from '~/components/Image'
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
 * Loads the bottle image URL from `public.fragrances` (`image`, or legacy `image_url`) by `name` (case-insensitive).
 * Renders nothing if the row or URL is missing or not a safe http(s) URL.
 */
export async function FragranceImage({
  name,
  alt,
  className,
}: {
  name: string
  alt?: string
  className?: string
}) {
  const row = await getFragranceByName(name.trim())
  const raw = (row?.image ?? row?.image_url)?.trim()
  if (!row || !raw || !isSafeHttpUrl(raw)) {
    return null
  }

  const altText = (alt ?? [row.brand, row.name].filter(Boolean).join(' ')).trim() || 'Fragrance'

  return (
    <div className={cn('not-prose my-6 w-full max-w-sm', className)}>
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md">
        <Image
          src={raw}
          alt={altText}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 384px"
          className="object-cover"
          containerClassName="relative m-0 h-full w-full min-h-0 p-0"
        />
      </div>
    </div>
  )
}

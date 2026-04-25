import { cn } from 'ui'

import { loadFragranceByName } from '~/components/fragrance/loadFragrance'

function describe(value: string | null | undefined): string | null {
  return value ?? null
}


/**
 * Renders `gender` for a fragrance looked up by name from `notion.fragrances`.
 * Variants:
 *  - `inline` (default): just the value, no chrome.
 *  - `badge`: value in a small pill.
 */
export async function FragranceAudience({
  name,
  variant = 'inline',
  className,
}: {
  name: string
  variant?: 'inline' | 'badge'
  className?: string
}) {
  const row = await loadFragranceByName(name)
  const text = describe(row?.gender ?? null)

  if (!text) return null

  if (variant === 'badge') {
    return (
      <span
        className={cn(
          'not-prose inline-flex items-center gap-1 rounded-md border border-default bg-surface-100 px-2 py-0.5 text-xl',
          className
        )}
      >
        <span className="font-sans text-foreground" translate="no">
          {text}
        </span>
      </span>
    )
  }

  return (
    <span className={cn('font-mono text-foreground', className)} translate="no">
      {text}
    </span>
  )
}

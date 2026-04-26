import { cn } from 'ui'

import { describeCostPerMl } from '~/components/fragrance/format'
import { loadFragranceByName } from '~/components/fragrance/loadFragrance'

/**
 * Renders `cost_per_ml` for a fragrance looked up by name from `notion.fragrances`.
 * Variants:
 *  - `inline` (default): just the formatted price, no chrome.
 *  - `badge`: small pill with a "Cost / ml" label.
 */
export async function FragranceCost({
  name,
  variant = 'inline',
  className,
}: {
  name: string
  variant?: 'inline' | 'badge'
  className?: string
}) {
  const row = await loadFragranceByName(name)
  const text = describeCostPerMl(row?.cost_per_ml ?? null)

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

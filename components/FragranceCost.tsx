import { cn } from 'ui'

import { getFragranceByName } from '~/lib/fragrances'

function formatCadPerMl(value: number): string {
  const formatted = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(value))
  return `${formatted}/ml`
}

function describe(value: number | null | undefined): string {
  if (value == null) return '—'
  if (value < 0) return 'n/a'
  if (value === 0) return '$0.00/ml (gift or sample)'
  return formatCadPerMl(value)
}

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
  const row = await getFragranceByName(name.trim())
  const text = describe(row?.cost_per_ml ?? null)

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

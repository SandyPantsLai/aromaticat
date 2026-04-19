import { cn } from 'ui'

import { getFragranceByName } from '~/lib/fragrances'

function formatUsdPerMl(value: number): string {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(value))
  return `${formatted}/ml`
}

function describeRetailPricePerMl(value: number | null): string {
  if (value === null) return '—'
  if (value < 0) return 'n/a'
  if (value === 0) return '$0.00/ml (gift or sample)'
  return formatUsdPerMl(value)
}

/**
 * Loads a fragrance row by `name` (must match `notion.fragrances.attrs.name`, case-insensitive).
 */
export async function FragranceFacts({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  const row = await getFragranceByName(name.trim())

  if (!row) {
    return (
      <p
        className={cn('not-prose text-sm text-foreground-lighter', className)}
        data-fragrance-name={name}
      >
        No fragrance found for name <code className="text-xs">{name}</code>. Check{' '}
        <code className="text-xs">notion.fragrances.attrs.name</code>, that the{' '}
        <code className="text-xs">notion</code> schema is exposed to the API, and that this server
        has <code className="text-xs">SUPABASE_SECRET_KEY</code> (service role) set for Notion FDW
        reads.
      </p>
    )
  }

  const title = [row.brand, row.name].filter(Boolean).join(' — ')

  return (
    <aside
      className={cn(
        'not-prose my-6 rounded-md border border-default bg-surface-100 px-4 py-3 text-sm',
        className
      )}
      aria-label={`Facts for ${title}`}
    >
      <p className="font-medium text-foreground">{title}</p>
      <dl className="mt-2 grid gap-1 sm:grid-cols-2">
        <div>
          <dt className="text-foreground-lighter">Cost / ml</dt>
          <dd className="font-mono text-foreground" translate="no">
            {describeRetailPricePerMl(row.cost_per_ml)}
          </dd>
        </div>
        {row.paid_per_ml != null && (
          <div>
            <dt className="text-foreground-lighter">Paid / ml</dt>
            <dd className="font-mono text-foreground" translate="no">
              {formatUsdPerMl(row.paid_per_ml)}
            </dd>
          </div>
        )}
        {row.remaining_ml != null && (
          <div>
            <dt className="text-foreground-lighter">Remaining</dt>
            <dd className="text-foreground">{row.remaining_ml} ml</dd>
          </div>
        )}
        {row.size_ml != null && (
          <div>
            <dt className="text-foreground-lighter">Bottle size</dt>
            <dd className="text-foreground">{row.size_ml} ml</dd>
          </div>
        )}
      </dl>
    </aside>
  )
}

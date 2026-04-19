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

/**
 * Loads a fragrance row by `name` (must match `notion.fragrances.attrs.name`, case-insensitive).
 */
export async function DecantFacts({
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
        data-decant-name={name}
      >
        No fragrance found for name <code className="text-xs">{name}</code>. Check{' '}
        <code className="text-xs">notion.fragrances.attrs.name</code>, that the{' '}
        <code className="text-xs">notion</code> schema is exposed to the API, and that this server
        has <code className="text-xs">SUPABASE_SECRET_KEY</code> (service role) set for Notion FDW
        reads.
      </p>
    )
  }

  const title = 'Decant Facts'

  return (
    <aside
      className={cn(
        'not-prose my-6 rounded-md border border-default bg-surface-100 px-4 py-3 text-sm',
        className
      )}
      aria-label={`Decant facts for ${title}`}
    >
      <p className="font-medium text-foreground">{title}</p>
      <dl className="mt-2 grid gap-1 sm:grid-cols-3">
        {row.cost_per_ml != null && (
          <div>
            <dt className="text-foreground-lighter">Cost</dt>
            <dd className="text-foreground" translate="no">
              {formatCadPerMl(row.cost_per_ml)}
            </dd>
          </div>
        )}
        <div>
          <dt className="text-foreground-lighter">Available Sizes</dt>
          <dd className="text-foreground">3/5/10ml</dd>
        </div>
        {row.remaining_ml != null && (
          <div>
            <dt className="text-foreground-lighter">Remaining</dt>
            <dd className="text-foreground">{row.remaining_ml} ml</dd>
          </div>
        )}
      </dl>
    </aside>
  )
}

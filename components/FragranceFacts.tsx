import { cn } from 'ui'

import { getFragranceBySlug } from '~/lib/fragrances'

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
 * Loads a fragrance row by `slug` (must match `public.fragrances.slug` in Supabase)
 * and shows retail $/ml and a few other facts for use inside MDX.
 */
export async function FragranceFacts({
  slug,
  className,
}: {
  slug: string
  className?: string
}) {
  const row = await getFragranceBySlug(slug.trim())

  if (!row) {
    return (
      <p
        className={cn('not-prose text-sm text-foreground-lighter', className)}
        data-fragrance-slug={slug}
      >
        No fragrance found for slug <code className="text-xs">{slug}</code>. Check that the slug
        matches a row in Supabase and that <code className="text-xs">NEXT_PUBLIC_SUPABASE_URL</code>{' '}
        and the anon key point at the same project.
      </p>
    )
  }

  const title = [row.brand_line, row.name].filter(Boolean).join(' — ')

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
          <dt className="text-foreground-lighter">Retail (list) $/ml</dt>
          <dd className="font-mono text-foreground" translate="no">
            {describeRetailPricePerMl(row.retail_price_per_ml)}
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

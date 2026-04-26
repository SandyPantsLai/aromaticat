import { cn } from 'ui'

import { AddDecantToDmListButton } from '~/components/dmList/AddToDmListButtons'
import { describeCostPerMl, displayInfo } from '~/components/fragrance/format'
import { loadFragranceByName } from '~/components/fragrance/loadFragrance'

/**
 * Loads a fragrance row by `name` (must match `notion.fragrances.attrs.name`, case-insensitive).
 */
export async function DecantInfo({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  const row = await loadFragranceByName(name)

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

  const title = 'Decant Info'
  const decantPath = `/shop/decants/${row.slug}`
  const rateForList = describeCostPerMl(row.cost_per_ml)

  return (
    <aside
      className={cn(
        'not-prose my-6 rounded-md border border-default bg-surface-100 px-4 py-3 text-sm',
        className
      )}
      aria-label={`Decant facts for ${title}`}
    >
      <p className="font-medium text-foreground">{title}</p>
      <dl className="mt-2 grid grid-cols-1 gap-x-3 gap-y-3 sm:grid-cols-3 sm:items-start">
        <div className="min-w-0 sm:min-h-0">
          <dt className="text-foreground-lighter">Available sizes (ml)</dt>
          <dd className="m-0 mt-1.5 min-w-0 p-0 sm:mt-1">
            <AddDecantToDmListButton
              slug={row.slug}
              brand={displayInfo(row.brand)}
              name={displayInfo(row.name)}
              catalogId={row.id}
              rateLabel={rateForList}
              href={decantPath}
              costPerMl={row.cost_per_ml}
            />
          </dd>
        </div>
        <div className="min-w-0 sm:min-h-0">
          <dt className="text-foreground-lighter">Cost</dt>
          <dd className="m-0 mt-1.5 text-foreground sm:mt-1" translate="no">
            {describeCostPerMl(row.cost_per_ml)}
          </dd>
        </div>
        <div className="min-w-0 sm:min-h-0">
          <dt className="text-foreground-lighter">Bottle type</dt>
          <dd className="m-0 mt-1.5 text-foreground sm:mt-1">Glass, screw-top from Evrair</dd>
        </div>
      </dl>
    </aside>
  )
}

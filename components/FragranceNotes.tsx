import { cn } from 'ui'

import { displayInfo } from '~/components/fragrance/format'
import { loadFragranceByName } from '~/components/fragrance/loadFragrance'

/**
 * Loads Top / Middle / Base notes by fragrance `name` (`notion.fragrances.attrs.name`, case-insensitive).
 */
export async function FragranceNotes({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  const row = await loadFragranceByName(name)
  if (!row) return null

  return (
    <aside
      className={cn(
        'not-prose my-6 rounded-md border border-default bg-surface-100 px-4 py-3 text-sm',
        className
      )}
      aria-label="Fragrance Notes"
    >
      <p className="font-medium text-foreground">Fragrance Notes</p>
      <dl className={cn('grid gap-2 mt-2 sm:grid-cols-3')}>
        <div>
          <dt className="text-foreground-lighter">Top</dt>
          <dd className="text-foreground">{displayInfo(row.top)}</dd>
        </div>
        <div>
          <dt className="text-foreground-lighter">Middle</dt>
          <dd className="text-foreground">{displayInfo(row.mid)}</dd>
        </div>
        <div>
          <dt className="text-foreground-lighter">Base</dt>
          <dd className="text-foreground">{displayInfo(row.base)}</dd>
        </div>
      </dl>
    </aside>
  )
}

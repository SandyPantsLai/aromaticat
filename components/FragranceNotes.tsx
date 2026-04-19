import { cn } from 'ui'

import { getFragranceByName } from '~/lib/fragrances'

function displayNote(value: string | null): string {
  const t = value?.trim() ?? ''
  return t || '—'
}

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
  const row = await getFragranceByName(name.trim())
  if (!row) return null

  const ariaLabel = 'Fragrance Notes'

  return (
    <aside
      className={cn(
        'not-prose my-6 rounded-md border border-default bg-surface-100 px-4 py-3 text-sm',
        className
      )}
      aria-label={ariaLabel}
    >
      <p className="font-medium text-foreground">Fragrance Notes</p>
      <dl className={cn('grid gap-2 mt-2 sm:grid-cols-3')}>
        <div>
          <dt className="text-foreground-lighter">Top</dt>
          <dd className="text-foreground">{displayNote(row.top)}</dd>
        </div>
        <div>
          <dt className="text-foreground-lighter">Middle</dt>
          <dd className="text-foreground">{displayNote(row.mid)}</dd>
        </div>
        <div>
          <dt className="text-foreground-lighter">Base</dt>
          <dd className="text-foreground">{displayNote(row.base)}</dd>
        </div>
      </dl>
    </aside>
  )
}

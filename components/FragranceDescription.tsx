import { cn } from 'ui'

import { getFragranceByName } from '~/lib/fragrances'

function displayInfo(value: string | null): string {
  const t = value?.trim() ?? ''
  return t || '—'
}

function shouldShowPerfumerByline(perfumer: string | null): boolean {
  const t = perfumer?.trim() ?? ''
  if (!t) return false
  if (t.toLowerCase() === 'unknown') return false
  return true
}

/**
 * Loads description by fragrance `name` (`notion.fragrances.attrs.name`, case-insensitive).
 */
export async function FragranceDescription({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  const row = await getFragranceByName(name.trim())
  if (!row) return null

  return (
    <p className={cn('my-4 font-normal leading-7 text-foreground', className)}>
      {displayInfo(row.description)}
      {shouldShowPerfumerByline(row.perfumer) ? (
        <> A perfume by {displayInfo(row.perfumer)}.</>
      ) : null}
    </p>
  )
}

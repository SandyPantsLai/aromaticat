import { cn } from 'ui'

import { getFragranceByName } from '~/lib/fragrances'

function displayDescription(value: string | null): string {
  const t = value?.trim() ?? ''
  return t || '—'
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
      {displayDescription(row.description)}
    </p>
  )
}

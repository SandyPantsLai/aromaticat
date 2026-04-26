/** Trims `value`, falling back to an em-dash when blank/null. */
export function displayInfo(value: string | null | undefined): string {
  const t = value?.trim() ?? ''
  return t || '—'
}

/** Formats a CAD-per-ml price as e.g. `$3.25/ml`. */
export function formatCadPerMl(value: number): string {
  const formatted = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Math.abs(value))
  return `${formatted}/ml`
}

/** Human-readable `cost_per_ml` for inline UI (matches `FragranceCost`). */
export function describeCostPerMl(value: number | null | undefined): string {
  if (value == null) return '—'
  if (value < 0) return 'n/a'
  if (value === 0) return '$0.00/ml (gift or sample)'
  return formatCadPerMl(value)
}

/** Allows only `http(s):` URLs; everything else (data:, javascript:, etc.) is rejected. */
export function isSafeHttpUrl(url: string): boolean {
  try {
    const u = new URL(url)
    return u.protocol === 'https:' || u.protocol === 'http:'
  } catch {
    return false
  }
}

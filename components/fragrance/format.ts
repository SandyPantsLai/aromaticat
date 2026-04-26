/** Trims `value`, falling back to an em-dash when blank/null. */
export function displayInfo(value: string | null | undefined): string {
  const t = value?.trim() ?? ''
  return t || '—'
}

/** Formats a CAD money amount (whole dollars) as e.g. `$16.25`. */
export function formatCadDollars(value: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/** Rounded cents (integer) for a decant line: (cost CAD/ml) × (ml), avoids float drift. */
export function decantLineTotalCents(costPerMl: number, sizeMl: number): number {
  if (!Number.isFinite(costPerMl) || !Number.isFinite(sizeMl) || sizeMl <= 0) return 0
  return Math.round(costPerMl * sizeMl * 100)
}

/** `formatCadDollars` from integer cents. */
export function formatCadFromCents(cents: number): string {
  return formatCadDollars(cents / 100)
}

/**
 * Best-effort parse of a one-line display price (bottles, C&R) to **CAD cents** for totals.
 * Returns `null` when the text is not a clear dollar amount.
 */
export function parseLumpPriceToCents(s: string | null | undefined): number | null {
  if (s == null) return null
  const t = String(s).trim()
  if (t.length === 0) return null
  if (
    /^(n\/a|n\.?a\.?|tbd|p\.?o\.?r\.?|trade|free|—|–|unknown)$/i.test(t) ||
    /on\s*request|price\s*on\s*request|make\s*offer|contact/i.test(t)
  ) {
    return null
  }
  // Prefer `$12.50` / `12.50` (optional thousands commas)
  const m =
    t.match(/\$?\s*([0-9][0-9,]*)(?:\.([0-9]{1,2}))?(?!\d)/) ??
    t.match(/([0-9][0-9,]*)(?:\.([0-9]{1,2}))\b/)
  if (!m) return null
  const intPart = m[1].replace(/,/g, '')
  const n = m[2] != null ? parseFloat(`${intPart}.${m[2]}`) : parseFloat(intPart)
  if (!Number.isFinite(n) || n < 0) return null
  if (n > 1_000_000) return null
  return Math.round(n * 100)
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

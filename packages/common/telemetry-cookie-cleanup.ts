import { LOCAL_STORAGE_KEYS } from './constants'
import { isBrowser } from './helpers'

/**
 * Clears legacy client-side telemetry storage when the user opts out of analytics.
 */
export function clearTelemetryDataCookie() {
  if (!isBrowser) return

  try {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.TELEMETRY_DATA)
  } catch {
    /* ignore */
  }

  const expire = 'expires=Thu, 01 Jan 1970 00:00:00 GMT'
  try {
    document.cookie = `${LOCAL_STORAGE_KEYS.TELEMETRY_DATA}=; ${expire}; path=/`
  } catch {
    /* ignore */
  }
}

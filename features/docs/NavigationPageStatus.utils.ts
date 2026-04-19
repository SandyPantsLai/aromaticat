import { type NavMenuConstant } from '~/components/Navigation/Navigation.types'
import {
  GLOBAL_MENU_ITEMS,
  blog,
  fragrance,
} from '~/components/Navigation/NavigationMenu/NavigationMenu.constants'

const SECTION_NAV_MAPS: Record<string, NavMenuConstant> = {
  fragrance,
  blog,
}

interface ConditionalNavItem {
  url?: string
  href?: string
  enabled?: boolean
  items?: Readonly<ConditionalNavItem[]>
  /** Matches `DropdownMenuItem.menuItems`: one group (`[]`) or nested groups (`[][]`). */
  menuItems?: Readonly<ConditionalNavItem[] | ConditionalNavItem[][]>
}

function collectDisabledPaths(
  items: Readonly<ConditionalNavItem[] | ConditionalNavItem[][]>,
  disabledPaths: Set<string>,
  parentDisabled: boolean = false
): void {
  for (const item of items) {
    if (Array.isArray(item)) {
      collectDisabledPaths(item, disabledPaths, parentDisabled)
    } else {
      const isCurrentDisabled = parentDisabled || item.enabled === false
      const itemUrl = item.url || item.href

      if (
        itemUrl &&
        (itemUrl.startsWith('/fragrance-notes') || itemUrl.startsWith('/blog'))
      ) {
        const normalizedUrl = normalizeUrl(itemUrl)
        if (isCurrentDisabled) {
          disabledPaths.add(normalizedUrl)
        }
      }

      // Recursively check children, passing down the disabled status
      // Recursively check children, passing down the disabled status
      // Recursively check children, passing down the disabled status
      if (item.items) {
        collectDisabledPaths(item.items, disabledPaths, isCurrentDisabled)
      }
      if (item.menuItems) {
        collectDisabledPaths(item.menuItems, disabledPaths, isCurrentDisabled)
      }
    }
  }
}

/**
 * Normalizes URLs for comparison by removing leading/trailing slashes and ensuring consistent format
 */
/**
 * Normalizes URLs for comparison by removing leading/trailing slashes and ensuring consistent format
 */
/**
 * Normalizes URLs for comparison by removing leading/trailing slashes and ensuring consistent format
 */
function normalizeUrl(url: string): string {
  return url.replace(/^\/+|\/+$/g, '').toLowerCase()
}

/**
 * Creates and caches the set of all disabled doc paths.
 * This is computed once and reused across all checks.
 */
/**
 * Creates and caches the set of all disabled doc paths.
 * This is computed once and reused across all checks.
 */
/**
 * Creates and caches the set of all disabled doc paths.
 * This is computed once and reused across all checks.
 */
let cachedDisabledPaths: Set<string> | null = null

function getDisabledGuidePaths(): Set<string> {
  if (cachedDisabledPaths === null) {
    cachedDisabledPaths = new Set<string>()

    // Collect disabled paths from global menu items
    // Collect disabled paths from global menu items
    collectDisabledPaths(GLOBAL_MENU_ITEMS, cachedDisabledPaths)

    // Collect disabled paths from section-specific navigation
    Object.values(SECTION_NAV_MAPS).forEach((sectionNav) => {
      if (sectionNav.items) {
        collectDisabledPaths([sectionNav], cachedDisabledPaths!)
      }
    })
  }

  return cachedDisabledPaths
}

/**
 * Checks if a doc page is enabled based on the navigation menu configuration.
 *
 * @param pathname - App pathname (e.g. `/fragrance-notes/overview`)
 */
export function checkGuidePageEnabled(pathname: string): boolean {
  const disabledPaths = getDisabledGuidePaths()
  const normalizedPath = normalizeUrl(pathname)
  return !disabledPaths.has(normalizedPath)
}

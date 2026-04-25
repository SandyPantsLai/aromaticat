/**
 * Guide-only sidebar (supabase apps/docs also branches to `NavigationMenuRefList` for /reference).
 * Ref + CLI sidebars and `Navigation.commands` are intentionally out of scope for this fork
 * until reference routes and spec assets exist again.
 */
import { memo } from 'react'

import type { NavMenuSection } from '../Navigation.types'
import { useCloseMenuOnRouteChange } from './NavigationMenu.utils'
import { NavigationMenuGuideList } from './NavigationMenuGuideList'

enum MenuId {
  Shop = 'shop',
  Fragrance = 'fragrance',
  Blog = 'blog',
}

const KNOWN_MENU_IDS = new Set<string>(Object.values(MenuId))

const NavigationMenu = ({
  menuId,
  additionalNavItems,
}: {
  menuId: MenuId
  additionalNavItems?: Record<string, Partial<NavMenuSection>[]>
}) => {
  useCloseMenuOnRouteChange()

  if (!KNOWN_MENU_IDS.has(menuId)) return null

  return <NavigationMenuGuideList id={menuId} additionalNavItems={additionalNavItems} />
}

export { MenuId }
export default memo(NavigationMenu)

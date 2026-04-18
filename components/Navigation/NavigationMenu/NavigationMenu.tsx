import { memo } from 'react'

import type { NavMenuSection } from '../Navigation.types'
import { useCloseMenuOnRouteChange } from './NavigationMenu.utils'
import NavigationMenuGuideList from './NavigationMenuGuideList'

enum MenuId {
  Fragrance = 'fragrance',
  Shop = 'shop',
  Blog = 'blog',
}

const menus: { id: MenuId }[] = [
  { id: MenuId.Fragrance },
  { id: MenuId.Shop },
  { id: MenuId.Blog },
]

function getMenuById(id: MenuId) {
  return menus.find((menu) => menu.id === id)
}

const NavigationMenu = ({
  menuId,
  additionalNavItems,
}: {
  menuId: MenuId
  additionalNavItems?: Record<string, Partial<NavMenuSection>[]>
}) => {
  const level = menuId
  const menu = getMenuById(level)

  useCloseMenuOnRouteChange()

  if (!menu) return null

  return <NavigationMenuGuideList id={menu.id} additionalNavItems={additionalNavItems} />
}

export { getMenuById, MenuId }
export default memo(NavigationMenu)

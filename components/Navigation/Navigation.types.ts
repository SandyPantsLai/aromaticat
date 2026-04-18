export interface NavMenu {
  [key: string]: NavMenuGroup[]
}

export interface NavMenuGroup {
  label: string
  items: NavMenuSection[]
}

export const MENU_ICON_KEYS = [
  'home',
  'fragrance',
  'shop',
  'blog',
  'decants',
  'catchAndRelease',
  'bottles',
] as const
export type MenuIconKey = (typeof MENU_ICON_KEYS)[number]

export interface NavMenuSection {
  name: string
  url?: `/${string}` | `https://${string}`
  items: Partial<NavMenuSection>[]
  icon?: string
  hasLightIcon?: boolean
  isDarkMode?: boolean
  enabled?: boolean
}

export type MenuItem = {
  label: string
  icon?: MenuIconKey
  href?: `/${string}` | `https://${string}`
  level?: string
  hasLightIcon?: boolean
  community?: boolean
  enabled?: boolean
}

export type DropdownMenuItem = MenuItem & {
  /** Nested groups (`MenuItem[][]`), or a single flat list (`MenuItem[]`) treated as one group. */
  menuItems?: MenuItem[][] | MenuItem[]
}

/**
 * Ensures `menuItems` is `MenuItem[][]`. A flat `MenuItem[]` is wrapped as one group
 * so `.map` / `.filter` on each group never receives a plain link object.
 */
export function normalizeMenuItemGroups(
  menuItems: MenuItem[][] | MenuItem[] | undefined
): MenuItem[][] {
  if (!menuItems?.length) return []
  const first = menuItems[0]
  if (Array.isArray(first)) {
    return menuItems as MenuItem[][]
  }
  return [menuItems as MenuItem[]]
}

export type GlobalMenuItems = DropdownMenuItem[][]

export type NavMenuConstant = Readonly<{
  title: string
  icon: MenuIconKey
  url?: `/${string}`
  items: ReadonlyArray<Partial<NavMenuSection>>
  enabled?: boolean
}>

export interface NavMenu {
  [key: string]: NavMenuGroup[]
}

export interface NavMenuGroup {
  label: string
  items: NavMenuSection[]
}

export const MENU_ICON_KEYS = ['home', 'fragrance', 'shop', 'blog'] as const
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

type MenuItem = {
  label: string
  icon?: MenuIconKey
  href?: `/${string}` | `https://${string}`
  level?: string
  hasLightIcon?: boolean
  community?: boolean
  enabled?: boolean
}

export type DropdownMenuItem = MenuItem & {
  menuItems?: MenuItem[][]
}

export type GlobalMenuItems = DropdownMenuItem[][]

export type NavMenuConstant = Readonly<{
  title: string
  icon: MenuIconKey
  url?: `/${string}`
  items: ReadonlyArray<Partial<NavMenuSection>>
  enabled?: boolean
}>

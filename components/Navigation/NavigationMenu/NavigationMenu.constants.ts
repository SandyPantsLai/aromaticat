import type { ComponentProps } from 'react'

import type { IconPanel } from 'ui-patterns/IconPanel'

import type { GlobalMenuItems, NavMenuConstant, NavMenuSection } from '../Navigation.types'

import {
  SHOP_CATALOG,
  shopOverviewPath,
  shopProductPath,
  shopSectionEntry,
  type ShopSectionId,
} from './shopCatalog'
import {
  getShopSection,
  getShopSidebarNav,
  shopBreadcrumbNav,
} from './shopSidebarNav'

export { getShopSection, getShopSidebarNav, shopBreadcrumbNav }

/**
 * Top-level navigation for the fragrance-only documentation site.
 */
export const GLOBAL_MENU_ITEMS: GlobalMenuItems = [
  [
    {
      label: 'Home',
      icon: 'home',
      href: '/',
      level: 'home',
    },
  ],
  [
    {
      label: 'Shop',
      menuItems: [
        {
          label: 'Overview',
          href: '/shop/overview',
          level: 'shop',
        },
        ...SHOP_CATALOG.map((section) => ({
          label: section.title,
          href: shopOverviewPath(section.id),
          level: section.id,
        })),
      ],
    },
  ],
  [
    {
      label: 'Fragrance Notes',
      icon: 'fragrance',
      href: '/fragrance-notes/overview',
      level: 'fragrance-notes',
    },
  ],
]

export const fragrance: NavMenuConstant = {
  icon: 'fragrance',
  title: 'Fragrance Notes',
  url: '/fragrance-notes/overview' as `/${string}`,
  items: [
    {
      name: 'Notes',
      items: [
        { name: 'Overview', url: '/fragrance-notes/overview' as `/${string}` },
        { name: 'Vanilla', url: '/fragrance-notes/vanilla' as `/${string}` },
      ],
    },
  ],
}

/** Default shop nav (root); sidebar uses `getShopSidebarNav(pathname)` for contextual sections. */
export const shop: NavMenuConstant = getShopSidebarNav('/shop')

/**
 * Builds a per-section menu (Overview + brand groups) from `SHOP_CATALOG`.
 * Used to derive the `decants` / `catchAndRelease` / `bottles` constants below.
 */
function buildSectionNav(sectionId: ShopSectionId): NavMenuConstant {
  const section = shopSectionEntry(sectionId)
  if (!section) {
    throw new Error(`Unknown shop section: ${sectionId}`)
  }
  return {
    icon: section.icon,
    title: section.title,
    url: shopOverviewPath(section.id),
    items: [
      { name: 'Overview', url: shopOverviewPath(section.id) },
      ...section.brands.map((brand) => ({
        name: brand.name,
        items: brand.products.map((product) => ({
          name: product.name,
          url: shopProductPath(section.id, product.slug),
        })),
      })),
    ],
  }
}

/** Decants section nav, derived from `SHOP_CATALOG`. */
export const decants: NavMenuConstant = buildSectionNav('decants')

/** Catch and Release section nav, derived from `SHOP_CATALOG`. */
export const catchAndRelease: NavMenuConstant = buildSectionNav('catch-and-release')

/** Bottles section nav, derived from `SHOP_CATALOG`. */
export const bottles: NavMenuConstant = buildSectionNav('bottles')

export const MIGRATION_PAGES: Partial<NavMenuSection & ComponentProps<typeof IconPanel>>[] = []

export const PhoneLoginsItems: Array<{
  name: string
  icon: string
  url: `/${string}`
  linkDescription?: string
  isDarkMode?: boolean
  hasLightIcon?: boolean
}> = []

export const NativeMobileLoginItems: typeof PhoneLoginsItems = []

export const SocialLoginItems: Array<Partial<NavMenuSection>> = []

const ormQuickstarts: NavMenuSection = {
  name: 'ORM quickstarts',
  items: [],
}

const guiQuickstarts: NavMenuSection = {
  name: 'GUI quickstarts',
  items: [],
}

export const navDataForMdx = {
  migrationPages: MIGRATION_PAGES,
  nativeMobileLoginItems: NativeMobileLoginItems,
  phoneLoginsItems: PhoneLoginsItems,
  socialLoginItems: SocialLoginItems,
  ormQuickstarts,
  guiQuickstarts,
}

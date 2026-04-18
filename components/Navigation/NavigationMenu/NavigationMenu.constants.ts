import type { ComponentProps } from 'react'

import type { IconPanel } from 'ui-patterns/IconPanel'

import type { GlobalMenuItems, NavMenuConstant, NavMenuSection } from '../Navigation.types'

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
      href: '/' as `/${string}`,
      level: 'home',
    },
  ],
  [
    {
      label: 'Shop',
      menuItems: [
        {
          label: 'Overview',
          href: '/shop' as `/${string}`,
          level: 'shop',
        },
        {
          label: 'Decants',
          href: '/shop/decants' as `/${string}`,
          level: 'decants',
        },
        {
          label: 'Catch and Release',
          href: '/shop/catch-and-release' as `/${string}`,
          level: 'catch-and-release',
        },
        {
          label: 'Bottles',
          href: '/shop/bottles' as `/${string}`,
          level: 'bottles',
        },
      ],
    },
  ],
  [
    {
      label: 'Fragrance Notes',
      icon: 'fragrance',
      href: '/fragrance-notes' as `/${string}`,
      level: 'fragrance-notes',
    },
  ],
  [
    {
      label: 'Blog',
      icon: 'blog',
      href: '/blog' as `/${string}`,
      level: 'blog',
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

/** Kept in sync with the Decants group under `shop` for imports (e.g. breadcrumbs). */
export const decants: NavMenuConstant = {
  icon: 'decants',
  title: 'Decants',
  url: '/shop/decants/overview' as `/${string}`,
  items: [
    { name: 'Overview', url: '/shop/decants/overview' as `/${string}` },
    {
      name: 'Soulvent',
      items: [{ name: 'Northern', url: '/shop/decants/northern' as `/${string}` }],
    },
  ],
}

/** Kept in sync with the Catch and Release group under `shop`. */
export const catchAndRelease: NavMenuConstant = {
  icon: 'catchAndRelease',
  title: 'Catch and Release',
  url: '/shop/catch-and-release/overview' as `/${string}`,
  items: [
    { name: 'Overview', url: '/shop/catch-and-release/overview' as `/${string}` },
    {
      name: 'Chloé',
      items: [
        { name: 'Vanilla Planifolia', url: '/shop/catch-and-release/vanilla-planifolia' as `/${string}` },
      ],
    },
  ],
}

/** Kept in sync with the Bottles group under `shop`. */
export const bottles: NavMenuConstant = {
  icon: 'bottles',
  title: 'Bottles',
  url: '/shop/bottles/overview' as `/${string}`,
  items: [
    { name: 'Overview', url: '/shop/bottles/overview' as `/${string}` },
    {
      name: 'Penhaligon\'s',
      items: [{ name: 'Halfeti', url: '/shop/bottles/halfeti' as `/${string}` }],
    },
  ],
}

export const blog: NavMenuConstant = {
  icon: 'blog',
  title: 'Blog',
  url: '/blog/overview' as `/${string}`,
  items: [
    {
      name: 'Posts',
      items: [
        { name: 'Overview', url: '/blog/overview' as `/${string}` },
        { name: 'Welcome', url: '/blog/welcome' as `/${string}` },
      ],
    },
  ],
}

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

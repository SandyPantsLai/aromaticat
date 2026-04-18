import type { ComponentProps } from 'react'

import type { IconPanel } from 'ui-patterns/IconPanel'

import type { GlobalMenuItems, NavMenuConstant, NavMenuSection } from '../Navigation.types'

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
      icon: 'shop',
      href: '/shop' as `/${string}`,
      level: 'shop',
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
    { name: 'Overview', url: '/fragrance-notes/overview' as `/${string}` },
    { name: 'Vanilla', url: '/fragrance-notes/vanilla' as `/${string}` },
  ],
}

export const shop: NavMenuConstant = {
  icon: 'shop',
  title: 'Shop',
  url: '/shop' as `/${string}`,
  items: [
    { name: 'Overview', url: '/shop' as `/${string}` },
    { name: 'Decants', url: '/shop/decants' as `/${string}` },
    { name: 'Catch and release', url: '/shop/catch-and-release' as `/${string}` },
    { name: 'Bottles', url: '/shop/bottles' as `/${string}` },
  ],
}

export const blog: NavMenuConstant = {
  icon: 'blog',
  title: 'Blog',
  url: '/blog/overview' as `/${string}`,
  items: [
    { name: 'Overview', url: '/blog/overview' as `/${string}` },
    { name: 'Welcome', url: '/blog/welcome' as `/${string}` },
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

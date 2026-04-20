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
          href: '/shop/overview' as `/${string}`,
          level: 'shop',
        },
        {
          label: 'Decants',
          href: '/shop/decants/overview' as `/${string}`,
          level: 'decants',
        },
        {
          label: 'Catch and Release',
          href: '/shop/catch-and-release/overview' as `/${string}`,
          level: 'catch-and-release',
        },
        {
          label: 'Bottles',
          href: '/shop/bottles/overview' as `/${string}`,
          level: 'bottles',
        },
      ],
    },
  ],
  [
    {
      label: 'Fragrance Notes',
      icon: 'fragrance',
      href: '/fragrance-notes/overview' as `/${string}`,
      level: 'fragrance-notes',
    },
  ],
  [
    {
      label: 'Blog',
      icon: 'blog',
      href: '/blog/overview' as `/${string}`,
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
      name: 'Aromag 岩兰',
      items: [
        { name: 'Distant Love', url: '/shop/decants/distant-love' as `/${string}` },
      ],
    },
    {
      name: 'Black Paw 黑爪',
      items: [
        { name: 'Dried Tangerine Peel', url: '/shop/decants/dried-tangerine-peel' as `/${string}` },
        { name: 'Lotus Flower', url: '/shop/decants/lotus-flower' as `/${string}` },
        { name: 'Old Study', url: '/shop/decants/old-study' as `/${string}` },
      ],
    },
    {
      name: 'Byredo',
      items: [
        { name: 'Lil Fleur EDP', url: '/shop/decants/lil-fleur-edp' as `/${string}` },
        { name: 'Mojave Ghost EDP', url: '/shop/decants/mojave-ghost-edp' as `/${string}` },
        { name: 'Rose of No Man\'s Land Absolu', url: '/shop/decants/rose-of-no-mans-land-absolu' as `/${string}` },
      ],
    },
    {
      name: 'Chabaud',
      items: [
        { name: 'Lait de Vanille', url: '/shop/decants/lait-de-vanille' as `/${string}` },
        { name: 'Lait et Chocolat', url: '/shop/decants/lait-et-chocolat' as `/${string}` },
      ],
    },
    {
      name: 'Dedcool',
      items: [
        { name: 'Mochi Milk', url: '/shop/decants/mochi-milk' as `/${string}` },
      ],
    },
    {
      name: 'Escentric Molecules',
      items: [
        { name: 'Molecule 01', url: '/shop/decants/molecule-01' as `/${string}` },
        { name: 'Molecule 03', url: '/shop/decants/molecule-03' as `/${string}` },
        { name: 'Molecule 04', url: '/shop/decants/molecule-04' as `/${string}` },
        { name: 'Molecule 05', url: '/shop/decants/molecule-05' as `/${string}` },
        { name: 'Molecule 01 + Black Tea', url: '/shop/decants/molecule-01-and-black-tea' as `/${string}` },
        { name: 'Molecule 01 + Iris', url: '/shop/decants/molecule-01-and-iris' as `/${string}` },
        { name: 'Molecule 01 + Patchouli', url: '/shop/decants/molecule-01-and-patchouli' as `/${string}` },
        { name: 'Escentric 03', url: '/shop/decants/escentric-03' as `/${string}` },
        { name: 'Escentric 05', url: '/shop/decants/escentric-05' as `/${string}` },
        { name: 'Vol 2: Precision and Grace', url: '/shop/decants/vol-2-precision-and-grace' as `/${string}` },
      ],
    },
    {
      name: 'Essential Parfums',
      items: [
        { name: 'Fig Infusion', url: '/shop/decants/fig-infusion' as `/${string}` },
        { name: 'The Musc', url: '/shop/decants/the-musc' as `/${string}` },
      ],
    },
    {
      name: 'Gabar',
      items: [
        { name: 'No. II Ground', url: '/shop/decants/no-ii-ground' as `/${string}` },
        { name: 'No. III Swim', url: '/shop/decants/no-iii-swim' as `/${string}` },
        { name: 'No. V Lull', url: '/shop/decants/no-v-lull' as `/${string}` },
      ],
    },
    {
      name: 'Goldfield & Banks',
      items: [
        { name: 'Ingenious Ginger', url: '/shop/decants/ingenious-ginger' as `/${string}` },
        { name: 'Pacific Rock Moss', url: '/shop/decants/pacific-rock-moss' as `/${string}` },
        { name: 'Silky Woods', url: '/shop/decants/silky-woods' as `/${string}` },
        { name: 'Southern Bloom', url: '/shop/decants/southern-bloom' as `/${string}` },
      ],
    },
    {
      name: 'Maison Shan 银杉',
      items: [
        { name: 'Intellectual', url: '/shop/decants/intellectual' as `/${string}` },
      ],
    },
    {
      name: 'Mith',
      items: [
        { name: 'Ruddy Sparkle', url: '/shop/decants/ruddy-sparkle' as `/${string}` },
      ],
    },
    {
      name: 'Room 1015',
      items: [
        { name: 'Poppy Riot', url: '/shop/decants/poppy-riot' as `/${string}` },
      ],
    },
    {
      name: 'Soulvent 所闻',
      items: [
        { name: 'Autumn\'s Embrace', url: '/shop/decants/autumns-embrace' as `/${string}` },        
        { name: 'Hugging', url: '/shop/decants/hugging' as `/${string}` },
        { name: 'Northern', url: '/shop/decants/northern' as `/${string}` },
        { name: 'Pomelo', url: '/shop/decants/pomelo' as `/${string}` },
        { name: 'Sherpa Smoke', url: '/shop/decants/sherpa-smoke' as `/${string}` },
      ],
    },
    {
      name: 'Stellar Essence',
      items: [
        { name: 'Wild Pine', url: '/shop/decants/wild-pine' as `/${string}` },
      ],
    },
    {
      name: 'Tamburins',
      items: [
        { name: 'Unknown Oud', url: '/shop/decants/unknown-oud' as `/${string}` },
      ],
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

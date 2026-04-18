import type { NavMenuConstant, NavMenuSection } from '../Navigation.types'

export type ShopSectionId = 'root' | 'decants' | 'catch-and-release' | 'bottles'

/**
 * Which shop subsection the pathname is in. Used to scope the left sidebar.
 */
export function getShopSection(pathname: string | null): ShopSectionId {
  if (!pathname) return 'root'
  if (pathname === '/shop' || pathname === '/shop/') return 'root'
  if (pathname.startsWith('/shop/decants')) return 'decants'
  if (pathname.startsWith('/shop/catch-and-release')) return 'catch-and-release'
  if (pathname.startsWith('/shop/bottles')) return 'bottles'
  return 'root'
}

const SHOP_SHELL: Pick<NavMenuConstant, 'icon' | 'title' | 'url'> = {
  icon: 'shop',
  title: 'Shop',
  url: '/shop' as `/${string}`,
}

/** Browse: shop overview + links to each shop section index. */
function browseGroup(): Partial<NavMenuSection> {
  return {
    name: 'Browse',
    items: [
      { name: 'Overview', url: '/shop' as `/${string}` },
      { name: 'Decants', url: '/shop/decants' as `/${string}` },
      { name: 'Catch and Release', url: '/shop/catch-and-release' as `/${string}` },
      { name: 'Bottles', url: '/shop/bottles' as `/${string}` },
    ],
  }
}

const soulventGroup: Partial<NavMenuSection> = {
  name: 'Soulvent',
  items: [{ name: 'Northern', url: '/shop/decants/northern' as `/${string}` }],
}

const vanillaGroup: Partial<NavMenuSection> = {
  name: 'Chloé',
  items: [
    { name: 'Vanilla Planifolia', url: '/shop/catch-and-release/vanilla-planifolia' as `/${string}` },
  ],
}

const featuredGroup: Partial<NavMenuSection> = {
  name: 'Penhaligon\'s',
  items: [{ name: 'Halfeti', url: '/shop/bottles/halfeti' as `/${string}` }],
}

/**
 * Left sidebar for Shop: only the current section’s browse hubs + that section’s brand/product tree.
 */
export function getShopSidebarNav(pathname: string | null): NavMenuConstant {
  const section = getShopSection(pathname)
  switch (section) {
    case 'decants':
      return { ...SHOP_SHELL, items: [browseGroup(), soulventGroup] }
    case 'catch-and-release':
      return { ...SHOP_SHELL, items: [browseGroup(), vanillaGroup] }
    case 'bottles':
      return { ...SHOP_SHELL, items: [browseGroup(), featuredGroup] }
    case 'root':
    default:
      return { ...SHOP_SHELL, items: [browseGroup()] }
  }
}

/**
 * Full shop tree for breadcrumb URL lookup only (includes every section’s pages).
 */
export const shopBreadcrumbNav: NavMenuConstant = {
  icon: 'shop',
  title: 'Shop',
  url: '/shop' as `/${string}`,
  items: [
    browseGroup(),
    {
      name: 'Decants',
      items: [
        { name: 'Overview', url: '/shop/decants/overview' as `/${string}` },
        {
          name: 'Soulvent',
          items: [{ name: 'Northern', url: '/shop/decants/northern' as `/${string}` }],
        },
      ],
    },
    {
      name: 'Catch and Release',
      items: [
        { name: 'Overview', url: '/shop/catch-and-release/overview' as `/${string}` },
        {
          name: 'Chloé',
          items: [
            { name: 'Vanilla Planifolia', url: '/shop/catch-and-release/vanilla-planifolia' as `/${string}` },
          ],
        },
      ],
    },
    {
      name: 'Bottles',
      items: [
        { name: 'Overview', url: '/shop/bottles/overview' as `/${string}` },
        {
          name: 'Penhaligon\'s',
          items: [{ name: 'Halfeti', url: '/shop/bottles/halfeti' as `/${string}` }],
        },
      ],
    },
  ],
}

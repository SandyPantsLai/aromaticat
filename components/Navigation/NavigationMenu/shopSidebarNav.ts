import type { NavMenuConstant, NavMenuSection } from '../Navigation.types'
import {
  SHOP_CATALOG,
  shopOverviewPath,
  shopProductPath,
  shopSectionEntry,
  shopSectionPath,
  type ShopSectionId,
} from './shopCatalog'

export type { ShopSectionId }
export type ShopSection = ShopSectionId | 'root'

/**
 * Which shop subsection the pathname is in. Used to scope the left sidebar.
 */
export function getShopSection(pathname: string | null): ShopSection {
  if (!pathname) return 'root'
  if (pathname === '/shop' || pathname === '/shop/') return 'root'
  for (const section of SHOP_CATALOG) {
    if (pathname.startsWith(`/shop/${section.id}`)) return section.id
  }
  return 'root'
}

const SHOP_SHELL: Pick<NavMenuConstant, 'icon' | 'title' | 'url'> = {
  icon: 'shop',
  title: 'Shop',
  url: '/shop',
}

/** Browse: shop overview + links to each shop section root. */
function browseGroup(): Partial<NavMenuSection> {
  return {
    name: 'Browse',
    items: [
      { name: 'Overview', url: '/shop' },
      ...SHOP_CATALOG.map((section) => ({
        name: section.title,
        url: shopSectionPath(section.id),
      })),
    ],
  }
}

/** Brand groups for a single shop section, derived from `SHOP_CATALOG`. */
function brandGroups(sectionId: ShopSectionId): Partial<NavMenuSection>[] {
  const section = shopSectionEntry(sectionId)
  if (!section) return []
  return section.brands.map((brand) => ({
    name: brand.name,
    items: brand.products.map((product) => ({
      name: product.name,
      url: shopProductPath(sectionId, product.slug),
    })),
  }))
}

/**
 * Left sidebar for Shop: only the current section's browse hubs + that section's brand/product tree.
 */
export function getShopSidebarNav(pathname: string | null): NavMenuConstant {
  const section = getShopSection(pathname)
  if (section === 'root') {
    return { ...SHOP_SHELL, items: [browseGroup()] }
  }
  return { ...SHOP_SHELL, items: [browseGroup(), ...brandGroups(section)] }
}

/** Full shop tree for breadcrumb URL lookup only (includes every section's pages). */
export const shopBreadcrumbNav: NavMenuConstant = {
  ...SHOP_SHELL,
  items: [
    browseGroup(),
    ...SHOP_CATALOG.map<Partial<NavMenuSection>>((section) => ({
      name: section.title,
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
    })),
  ],
}

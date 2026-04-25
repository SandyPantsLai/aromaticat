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

const aromagGroup: Partial<NavMenuSection> = {
  name: 'Aromag 岩兰',
  items: [
    { name: 'Distant Love', url: '/shop/decants/distant-love' as `/${string}` },
  ],
}

const blackPawGroup: Partial<NavMenuSection> = {
  name: 'Black Paw 黑爪',
  items: [
    { name: 'Dried Tangerine Peel', url: '/shop/decants/dried-tangerine-peel' as `/${string}` },
    { name: 'Lotus Flower', url: '/shop/decants/lotus-flower' as `/${string}` },
    { name: 'Old Study', url: '/shop/decants/old-study' as `/${string}` },
  ],
}

const byredoGroup: Partial<NavMenuSection> = {
  name: 'Byredo',
  items: [
    { name: 'Lil Fleur EDP', url: '/shop/decants/lil-fleur-edp' as `/${string}` },
    { name: 'Mojave Ghost EDP', url: '/shop/decants/mojave-ghost-edp' as `/${string}` },
    {
      name: "Rose of No Man's Land Absolu",
      url: '/shop/decants/rose-of-no-mans-land-absolu' as `/${string}`,
    },
  ],
}

const chabaudGroup: Partial<NavMenuSection> = {
  name: 'Chabaud',
  items: [
    { name: 'Lait de Vanille', url: '/shop/decants/lait-de-vanille' as `/${string}` },
    { name: 'Lait et Chocolat', url: '/shop/decants/lait-et-chocolat' as `/${string}` },
  ],
}

const dedcoolGroup: Partial<NavMenuSection> = {
  name: 'Dedcool',
  items: [
    { name: 'Mochi Milk', url: '/shop/decants/mochi-milk' as `/${string}` },
  ],
}

const escentricMoleculesGroup: Partial<NavMenuSection> = {
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
}
const essentialParfumsGroup: Partial<NavMenuSection> = {
  name: 'Essential Parfums',
  items: [
    { name: 'Fig Infusion', url: '/shop/decants/fig-infusion' as `/${string}` },
    { name: 'The Musc', url: '/shop/decants/the-musc' as `/${string}` },
  ],
}

const gabarGroup: Partial<NavMenuSection> = {
  name: 'Gabar',
  items: [
    { name: 'No. II Ground', url: '/shop/decants/no-ii-ground' as `/${string}` },
    { name: 'No. III Swim', url: '/shop/decants/no-iii-swim' as `/${string}` },
    { name: 'No. V Lull', url: '/shop/decants/no-v-lull' as `/${string}` },
  ],
}

const goldfieldAndBanksGroup: Partial<NavMenuSection> = {
  name: 'Goldfield & Banks',
  items: [
    { name: 'Ingenious Ginger', url: '/shop/decants/ingenious-ginger' as `/${string}` },
    { name: 'Pacific Rock Moss', url: '/shop/decants/pacific-rock-moss' as `/${string}` },
    { name: 'Silky Woods', url: '/shop/decants/silky-woods' as `/${string}` },
    { name: 'Southern Bloom', url: '/shop/decants/southern-bloom' as `/${string}` },
  ],
}

const maisonShanGroup: Partial<NavMenuSection> = {
  name: 'Maison Shan 银杉',
  items: [
    { name: 'Intellectual', url: '/shop/decants/intellectual' as `/${string}` },
  ],
}

const mithGroup: Partial<NavMenuSection> = {
  name: 'Mith',
  items: [
    { name: 'Ruddy Sparkle', url: '/shop/decants/ruddy-sparkle' as `/${string}` },
  ],
}
const room1015Group: Partial<NavMenuSection> = {
  name: 'Room 1015',
  items: [
    { name: 'Poppy Riot', url: '/shop/decants/poppy-riot' as `/${string}` },
  ],
}

const soulventGroup: Partial<NavMenuSection> = {
  name: 'Soulvent 所闻',
  items: [
    { name: 'Autumn\'s Embrace', url: '/shop/decants/autumns-embrace' as `/${string}` },
    { name: 'Hugging', url: '/shop/decants/hugging' as `/${string}` },
    { name: 'Northern', url: '/shop/decants/northern' as `/${string}` },
    { name: 'Pomelo', url: '/shop/decants/pomelo' as `/${string}` },
    { name: 'Sherpa Smoke', url: '/shop/decants/sherpa-smoke' as `/${string}` },
  ],
}

const stellarEssenceGroup: Partial<NavMenuSection> = {
  name: 'Stellar Essence',
  items: [
    { name: 'Wild Pine', url: '/shop/decants/wild-pine' as `/${string}` },
  ],
}

const tamburinsGroup: Partial<NavMenuSection> = {
  name: 'Tamburins',
  items: [
    { name: 'Unknown Oud', url: '/shop/decants/unknown-oud' as `/${string}` },
  ],
}

const zhiwuzhiGroup: Partial<NavMenuSection> = {
  name: 'Zhiwuzhi 挚物志',
  items: [
    { name: 'Green Withering', url: '/shop/decants/green-withering' as `/${string}` },
    { name: 'The Box of Time', url: '/shop/decants/the-box-of-time' as `/${string}` },
  ],
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
      return { ...SHOP_SHELL, items: 
        [browseGroup(), 
          aromagGroup, 
          blackPawGroup, 
          byredoGroup, 
          chabaudGroup, 
          dedcoolGroup,
          escentricMoleculesGroup,
          essentialParfumsGroup, 
          gabarGroup,
          goldfieldAndBanksGroup,
          maisonShanGroup,
          mithGroup,
          room1015Group,
          soulventGroup,
          stellarEssenceGroup,
          tamburinsGroup,
          zhiwuzhiGroup
        ] }
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
            {
              name: "Rose of No Man's Land Absolu",
              url: '/shop/decants/rose-of-no-mans-land-absolu' as `/${string}`,
            },
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
            { name: 'Hugging', url: '/shop/decants/hugging' as `/${string}` },
            { name: 'Northern', url: '/shop/decants/northern' as `/${string}` },
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
        {
          name: 'Zhiwuzhi 挚物志',
          items: [
            { name: 'Green Withering', url: '/shop/decants/green-withering' as `/${string}` },
            { name: 'The Box of Time', url: '/shop/decants/the-box-of-time' as `/${string}` },
          ],
        }
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

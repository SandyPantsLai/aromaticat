import type { MenuIconKey } from '../Navigation.types'

export type ShopSectionId = 'decants' | 'catch-and-release' | 'bottles'

export interface ShopProduct {
  name: string
  slug: string
}

export interface ShopBrand {
  name: string
  products: ShopProduct[]
}

export interface ShopSectionEntry {
  id: ShopSectionId
  title: string
  icon: Extract<MenuIconKey, 'decants' | 'catchAndRelease' | 'bottles'>
  brands: ShopBrand[]
}

export const SHOP_CATALOG: readonly ShopSectionEntry[] = [
  {
    id: 'decants',
    title: 'Decants',
    icon: 'decants',
    brands: [
      {
        name: '19-69',
        products: [{ name: 'Capri', slug: 'capri' }],
      },
      {
        name: 'Aromag 岩兰',
        products: [{ name: 'Distant Love', slug: 'distant-love' }],
      },
      {
        name: 'Black Paw 黑爪',
        products: [
          { name: 'Dried Tangerine Peel', slug: 'dried-tangerine-peel' },
          { name: 'Lotus Flower', slug: 'lotus-flower' },
          { name: 'Old Study', slug: 'old-study' },
        ],
      },
      {
        name: 'Byredo',
        products: [
          { name: 'Lil Fleur EDP', slug: 'lil-fleur-edp' },
          { name: 'Mojave Ghost EDP', slug: 'mojave-ghost-edp' },
          { name: "Rose of No Man's Land Absolu", slug: 'rose-of-no-mans-land-absolu' },
        ],
      },
      {
        name: 'Chabaud',
        products: [
          { name: 'Lait de Vanille', slug: 'lait-de-vanille' },
          { name: 'Lait et Chocolat', slug: 'lait-et-chocolat' },
        ],
      },
      {
        name: 'D\'Annam',
        products: [
          { name: 'Matcha Soft Serve', slug: 'matcha-soft-serve' },
          { name: 'Princess of China', slug: 'princess-of-china' },
        ],

      },
      {
        name: 'Dedcool',
        products: [{ name: 'Mochi Milk', slug: 'mochi-milk' }],
      },
      {
        name: 'Diptyque',
        products: [
          { name: 'Benjoin Bohème EDP Intense', slug: 'benjoin-boheme-edp-intense' },
          { name: 'Do Son EDP', slug: 'do-son-edp' },
          { name: 'Eau Capitale EDP', slug: 'eau-capitale-edp' },
          { name: 'Eau Moheli EDT', slug: 'eau-moheli-edt' },
          { name: 'L\'Ombre Fans L\'Eau EDT', slug: 'lombre-dans-leau-edt' },
          { name: 'Orphéon EDP', slug: 'orpheon-edp' },
        ],
      },
      {
        name: 'Escentric Molecules',
        products: [
          { name: 'Molecule 01', slug: 'molecule-01' },
          { name: 'Molecule 03', slug: 'molecule-03' },
          { name: 'Molecule 04', slug: 'molecule-04' },
          { name: 'Molecule 05', slug: 'molecule-05' },
          { name: 'Molecule 01 + Black Tea', slug: 'molecule-01-and-black-tea' },
          { name: 'Molecule 01 + Iris', slug: 'molecule-01-and-iris' },
          { name: 'Molecule 01 + Patchouli', slug: 'molecule-01-and-patchouli' },
          { name: 'Escentric 03', slug: 'escentric-03' },
          { name: 'Escentric 05', slug: 'escentric-05' },
          { name: 'Vol 2: Precision and Grace', slug: 'vol-2-precision-and-grace' },
        ],
      },
      {
        name: 'Essential Parfums',
        products: [
          { name: 'Fig Infusion', slug: 'fig-infusion' },
          { name: 'The Musc', slug: 'the-musc' },
        ],
      },
      {
        name: 'Gabar',
        products: [
          { name: 'No. II Ground', slug: 'no-ii-ground' },
          { name: 'No. III Swim', slug: 'no-iii-swim' },
          { name: 'No. V Lull', slug: 'no-v-lull' },
        ],
      },
      {
        name: 'Goldfield & Banks',
        products: [
          { name: 'Ingenious Ginger', slug: 'ingenious-ginger' },
          { name: 'Pacific Rock Moss', slug: 'pacific-rock-moss' },
          { name: 'Silky Woods', slug: 'silky-woods' },
          { name: 'Southern Bloom', slug: 'southern-bloom' },
        ],
      },
      {
        name: 'Maison Shan 银杉',
        products: [{ name: 'Intellectual', slug: 'intellectual' }],
      },
      {
        name: 'Mith',
        products: [{ name: 'Ruddy Sparkle', slug: 'ruddy-sparkle' }],
      },
      {
        name: 'Room 1015',
        products: [{ name: 'Poppy Riot', slug: 'poppy-riot' }],
      },
      {
        name: 'Soulvent 所闻',
        products: [
          { name: "Autumn's Embrace", slug: 'autumns-embrace' },
          { name: 'Hugging', slug: 'hugging' },
          { name: 'Northern', slug: 'northern' },
          { name: 'Pomelo', slug: 'pomelo' },
          { name: 'Sherpa Smoke', slug: 'sherpa-smoke' },
        ],
      },
      {
        name: 'Stellar Essence',
        products: [{ name: 'Wild Pine', slug: 'wild-pine' }],
      },
      {
        name: 'Tamburins',
        products: [{ name: 'Unknown Oud', slug: 'unknown-oud' }],
      },
      {
        name: 'Zhiwuzhi 挚物志',
        products: [
          { name: 'Green Withering', slug: 'green-withering' },
          { name: 'The Box of Time', slug: 'the-box-of-time' },
        ],
      },
    ],
  },
  {
    id: 'catch-and-release',
    title: 'Catch and Release',
    icon: 'catchAndRelease',
    brands: [],
  },
  {
    id: 'bottles',
    title: 'Bottles',
    icon: 'bottles',
    brands: [],
  },
]

export function shopSectionEntry(id: ShopSectionId): ShopSectionEntry | undefined {
  return SHOP_CATALOG.find((entry) => entry.id === id)
}

export function shopProductPath(section: ShopSectionId, slug: string): `/${string}` {
  return `/shop/${section}/${slug}`
}

export function shopSectionPath(section: ShopSectionId): `/${string}` {
  return `/shop/${section}`
}

export function shopOverviewPath(section: ShopSectionId): `/${string}` {
  return `/shop/${section}/overview`
}

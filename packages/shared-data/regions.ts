export type Region = Partial<typeof REGIONS>
export type CountryBrand = Partial<typeof COUNTRY_BRANDS>

export const REGIONS = {
  ASIA: {
    countries: ["China", "Indonesia", "Japan", "Korea", "Malaysia", "Philippines", "Singapore", "Taiwan", "Thailand", "Vietnam"],
  },
} as const

export type REGIONS_KEYS = keyof typeof REGIONS

export const COUNTRY_BRANDS = {
  CHINA: {
    brands: [
      "Aromag 岩兰", 
      "Black Paw 黑爪", 
      "Maison Shan 银杉", 
      "One Day", 
      "Soulvent 所闻", 
      "Stellar Essence", 
      "To Summer 观夏",
      "Zhiwuzhi 挚物志"],
  },
  JAPAN: {
    brands: [
      "J-Scent",
    ],
  },
  KOREA: {
    brands: [
      "Born To Stand Out",
      "Tamburins"
    ],
  },
  THAILAND: {
    brands: [
      "Mith",
      "Proad"
    ],
  },
  VIETNAM: {
    brands: [
      "D'Annam",
    ],
  },
} as const

export type COUNTRY_BRANDS_KEYS = keyof typeof COUNTRY_BRANDS

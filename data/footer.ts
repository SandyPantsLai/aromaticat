import type { LucideIcon } from 'lucide-react'
import { AtSign, Mail, Recycle } from 'lucide-react'

export type FooterPrimaryLink = {
  featherIcon?: LucideIcon
  text: string
  ctaLabel?: string
  /** External link for `ctaLabel`; omit when there is no link. */
  url?: string
}

export const primaryLinks: FooterPrimaryLink[] = [
  {
    featherIcon: Recycle,
    text: 'Want to trade?',
    ctaLabel: 'See my wish list!',
    url: 'https://www.parfumo.com/Users/AromatiCat/Collection/Wish_List',
  },
  {
    featherIcon: Mail,
    text: 'Add $4 for untracked lettermail. Parcel shipping starts at $20. Ships in 3 business days.',
  },
  {
    featherIcon: AtSign,
    text: 'Have questions? DM Sandy Pants!',
  },
]
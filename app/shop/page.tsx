import { type Metadata, type ResolvingMetadata } from 'next'
import Link from 'next/link'

import { SHOP_CATALOG, shopOverviewPath } from '~/components/Navigation/NavigationMenu/shopCatalog'
import { cn } from 'ui'

import { BASE_PATH } from '@/lib/constants'

const generateMetadata = async (_, parent: ResolvingMetadata): Promise<Metadata> => {
  const parentAlternates = (await parent).alternates

  return {
    title: 'Shop',
    alternates: {
      canonical: `${BASE_PATH}/shop`,
      ...(parentAlternates && {
        languages: parentAlternates.languages || undefined,
        media: parentAlternates.media || undefined,
        types: parentAlternates.types || undefined,
      }),
    },
  }
}

const ShopPage = () => (
  <article className="prose max-w-none">
    <h1 className="scroll-mt-24">How to Order</h1>
    <p>Explore the decants, catch and releases and bottles I have for sale or trade.</p>
    <p>You can add stuff to your cart/list but there is no checkout. Take a screenshot of the list and message Sandy Pants to order.</p>
    <div className="not-prose mt-3 flex flex-wrap gap-2">
      {SHOP_CATALOG.map((section) => (
        <Link
          key={section.id}
          href={shopOverviewPath(section.id)}
          className={cn(
            'inline-flex items-center justify-center rounded-md bg-brand-link px-3 py-1.5 text-sm font-medium text-white no-underline',
            'transition-[filter] hover:brightness-110',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--brand-link))]'
          )}
        >
          {section.title}
        </Link>
      ))}
    </div>
    <h3 className="scroll-mt-18">Trading Minimums</h3>
    <p>If we're trading decants, the minimum is 3 decants to minimize shipping costs.</p>
    <h3 className="scroll-mt-18">Shipping Info</h3>
    <p>I ship internationally. Shipping costs are calculated based on the weight of the items and the destination country.</p>
    <h3 className="scroll-mt-18">Liability Info</h3>
    <p>Breakage/loss/leakage is on the buyer, but I pack well and send pics of packing before shipping.</p>
    <h3 className="scroll-mt-18">Payment Options</h3>
    <p>I accept PayPal F&F, e-transfer, or cash on pickup.</p>
    <h3 className="scroll-mt-18">Contact</h3>
    <p>If you have any questions, please DM me (Sandy Pants in the CFE group).</p>
  </article>
)

export default ShopPage
export { generateMetadata }

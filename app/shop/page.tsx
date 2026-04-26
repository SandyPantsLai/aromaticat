import { type Metadata, type ResolvingMetadata } from 'next'
import { DecantsOverviewSection } from '~/components/DecantsOverviewSection'

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
    <h1 className="scroll-mt-24">Shop</h1>
    <DecantsOverviewSection category="featured" />
    <DecantsOverviewSection category="new" />
  </article>
)

export default ShopPage
export { generateMetadata }

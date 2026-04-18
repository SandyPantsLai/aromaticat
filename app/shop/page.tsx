import { type Metadata, type ResolvingMetadata } from 'next'

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
    <p className="text-foreground-light max-w-2xl">
      Overview of shop categories: decants, catch and release, and full bottles.
    </p>
  </article>
)

export default ShopPage
export { generateMetadata }

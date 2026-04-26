import { type Metadata, type ResolvingMetadata } from 'next'

import HomeLayout from '@/layouts/HomeLayout'
import { BASE_PATH } from '@/lib/constants'
import { getCustomContent } from '@/lib/custom-content/getCustomContent'
import { DecantsOverviewSection } from '~/components/DecantsOverviewSection'
import { HomeSeeAllDecantsCta } from '~/components/HomeSeeAllDecantsCta'

const { metadataTitle } = getCustomContent(['metadata:title'])

const generateMetadata = async (_, parent: ResolvingMetadata): Promise<Metadata> => {
  const parentAlternates = (await parent).alternates

  return {
    title: metadataTitle,
    alternates: {
      canonical: `${BASE_PATH}`,
      ...(parentAlternates && {
        languages: parentAlternates.languages || undefined,
        media: parentAlternates.media || undefined,
        types: parentAlternates.types || undefined,
      }),
    },
  }
}

const HomePage = () => (
  <HomeLayout>
    <div className="flex flex-col gap-10">
      <DecantsOverviewSection category="featured" layout="carousel" />
      <DecantsOverviewSection category="new" layout="carousel" />
      <HomeSeeAllDecantsCta />
    </div>
  </HomeLayout>
)

export default HomePage
export { generateMetadata }

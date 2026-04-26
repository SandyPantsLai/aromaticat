import { type Metadata, type ResolvingMetadata } from 'next'
import Link from 'next/link'

import { GlassPanelWithIconPicker } from '@/features/ui/GlassPanelWithIconPicker'
import HomeLayout from '@/layouts/HomeLayout'
import { BASE_PATH } from '@/lib/constants'
import { getCustomContent } from '@/lib/custom-content/getCustomContent'
import { DecantsOverviewSection } from '~/components/DecantsOverviewSection'

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

const docSections = [
  {
    title: 'Fragrance notes overview',
    icon: 'fragrance' as const,
    hasLightIcon: true,
    href: '/fragrance-notes/overview',
    description:
      'How this documentation site is organized for fragrance topics.',
    span: 'col-span-12 md:col-span-8',
  },
]

const HomePage = () => (
  <HomeLayout>
    <div className="flex flex-col gap-10">
      <section aria-labelledby="fragrances">
        <ul className="grid grid-cols-12 gap-6 not-prose mt-8 [&_svg]:text-brand-600">
          {docSections.map((section) => (
            <li key={section.title} className={section.span ?? 'col-span-12 md:col-span-6'}>
              <Link href={section.href} passHref>
                <GlassPanelWithIconPicker {...section}>{section.description}</GlassPanelWithIconPicker>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <DecantsOverviewSection category="featured" layout="carousel" />
      <DecantsOverviewSection category="new" layout="carousel" />
    </div>
  </HomeLayout>
)

export default HomePage
export { generateMetadata }

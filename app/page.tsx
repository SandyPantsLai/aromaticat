import { type Metadata, type ResolvingMetadata } from 'next'
import Link from 'next/link'

import { GlassPanelWithIconPicker } from '@/features/ui/GlassPanelWithIconPicker'
import HomeLayout from '@/layouts/HomeLayout'
import { BASE_PATH } from '@/lib/constants'
import { getCustomContent } from '@/lib/custom-content/getCustomContent'

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
      'How this documentation site is organized for fragrance topics: notes, accords, materials, and MDX patterns.',
    span: 'col-span-12 md:col-span-8',
  },
]

const HomePage = () => (
  <HomeLayout>
    <div className="flex flex-col gap-10">
      <section aria-labelledby="fragrance-docs">
        <h2 id="fragrance-docs" className="scroll-mt-24">
          Documentation
        </h2>
        <p className="text-foreground-light max-w-2xl">
          Aromaticat centers on <strong>fragrance</strong> writing and reference content. Start with
          the overview, then add more guides under{' '}
          <code className="text-sm">content/fragrance-notes/</code> as you grow the catalog.
        </p>
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

      <section className="border-t pt-10 text-foreground-light text-sm">
        <p className="m-0">
          Supabase platform guides were removed from this fork; upstream docs live at{' '}
          <a className="text-brand-link" href="https://supabase.com/docs">
            supabase.com/docs
          </a>
          .
        </p>
      </section>
    </div>
  </HomeLayout>
)

export default HomePage
export { generateMetadata }

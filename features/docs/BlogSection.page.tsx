import { type Metadata } from 'next'

import { BlogEntries, BlogListHeader } from '~/features/docs/Blog.ui'
import { getBlogEntriesByTag } from '~/features/docs/Blog.utils'
import { PROD_URL } from '~/lib/constants'
import { getCustomContent } from '~/lib/custom-content/getCustomContent'

const { metadataTitle } = getCustomContent(['metadata:title'])

interface SectionBlogPageProps {
  tag: string
  sectionName: string
  description?: string
}

export default async function SectionBlogPage({ tag, sectionName, description }: SectionBlogPageProps) {
  const blogEntries = await getBlogEntriesByTag(tag)

  const pageTitle = `${sectionName} blog`
  const pageDescription =
    description || `Browse blog posts tagged “${sectionName}”.`

  return (
    <div className="flex flex-col">
      <BlogListHeader title={pageTitle} description={pageDescription} />
      <div className="flex-1">
        <div className="px-5 pt-6">
          <BlogEntries name={sectionName} entries={blogEntries} />
        </div>
      </div>
    </div>
  )
}

export function generateSectionBlogMetadata(tag: string, sectionName: string): Metadata {
  return {
    title: `${metadataTitle ?? 'Site'} | ${sectionName} blog`,
    alternates: {
      canonical: `${PROD_URL}/blog/tag/${encodeURIComponent(tag)}`,
    },
  }
}

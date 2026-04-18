import SectionBlogPage, { generateSectionBlogMetadata } from '~/features/docs/BlogSection.page'

type Params = { tag: string }

export default async function BlogTagPage(props: { params: Promise<Params> }) {
  const { tag } = await props.params
  const decoded = decodeURIComponent(tag)
  const sectionName = decoded[0].toUpperCase() + decoded.slice(1)
  return <SectionBlogPage tag={decoded} sectionName={sectionName} />
}

export async function generateMetadata(props: { params: Promise<Params> }) {
  const { tag } = await props.params
  const decoded = decodeURIComponent(tag)
  const sectionName = decoded[0].toUpperCase() + decoded.slice(1)
  return generateSectionBlogMetadata(decoded, sectionName)
}

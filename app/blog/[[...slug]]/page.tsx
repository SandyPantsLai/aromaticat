import { redirect } from 'next/navigation'

import { genBlogMeta, genBlogStaticParams, getBlogMarkdown } from '~/features/docs/BlogMdx.utils'
import { MdxDocTemplate } from '~/features/docs/MdxDocTemplate'
import { removeRedundantH1 } from '~/features/docs/mdx/removeRedundantH1'
import { IS_PROD } from 'common'
import { getEmptyArray } from '~/features/helpers.fn'

type Params = { slug?: string[] }

const BlogPage = async (props: { params: Promise<Params> }) => {
  const params = await props.params
  const parts = params.slug ?? []
  if (parts.length === 0) {
    redirect('/blog/overview')
  }
  const data = await getBlogMarkdown(parts)

  return (
    <MdxDocTemplate
      meta={data.meta}
      content={removeRedundantH1(data.content)}
    />
  )
}

const generateStaticParams = IS_PROD ? genBlogStaticParams : getEmptyArray
const generateMetadata = genBlogMeta(async (params: { slug?: string[] }) => {
  const parts = params.slug ?? []
  const data =
    parts.length === 0 ? await getBlogMarkdown(['overview']) : await getBlogMarkdown(parts)
  return { meta: data.meta, pathname: data.pathname }
})

export default BlogPage
export { generateStaticParams, generateMetadata }

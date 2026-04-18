import { redirect, notFound } from 'next/navigation'

import { MdxDocTemplate } from '~/features/docs/MdxDocTemplate'
import { removeRedundantH1 } from '~/features/docs/mdx/removeRedundantH1'
import {
  genShopMeta,
  genShopStaticParams,
  getShopMarkdown,
  isShopSection,
} from '~/features/docs/ShopMdx.utils'
import { IS_PROD } from 'common'
import { getEmptyArray } from '~/features/helpers.fn'
import { resolveShopFragranceMeta } from '~/lib/resolveShopFragranceMeta'

type Params = { section: string; slug?: string[] }

const ShopProductPage = async (props: { params: Promise<Params> }) => {
  const params = await props.params
  if (!isShopSection(params.section)) {
    notFound()
  }
  const section = params.section
  const parts = params.slug ?? []
  if (parts.length === 0) {
    redirect(`/shop/${section}/overview`)
  }
  const data = await getShopMarkdown(section, parts)
  const meta = await resolveShopFragranceMeta(data.meta, data.pathname)

  return (
    <MdxDocTemplate
      meta={meta}
      content={removeRedundantH1(data.content)}
    />
  )
}

const generateStaticParams = IS_PROD ? genShopStaticParams : getEmptyArray

const generateMetadata = genShopMeta(async (params: Params) => {
  const { section, slug: slugParam } = params
  if (!isShopSection(section)) {
    notFound()
  }
  const parts = slugParam ?? []
  const data =
    parts.length === 0
      ? await getShopMarkdown(section, ['overview'])
      : await getShopMarkdown(section, parts)
  return { meta: data.meta, pathname: data.pathname }
})

export default ShopProductPage
export { generateStaticParams, generateMetadata }

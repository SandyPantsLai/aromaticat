import { redirect } from 'next/navigation'

import { MdxDocTemplate } from '~/features/docs/MdxDocTemplate'
import {
  genGuideMeta,
  genGuidesStaticParams,
  getGuidesMarkdown,
} from '~/features/docs/FragranceNotesMdx.utils'
import { IS_PROD } from 'common'
import { getEmptyArray } from '~/features/helpers.fn'

type Params = { slug?: string[] }

const FragranceGuidePage = async (props: { params: Promise<Params> }) => {
  const params = await props.params
  const parts = params.slug ?? []
  if (parts.length === 0) {
    redirect('/fragrance-notes/overview')
  }
  const data = await getGuidesMarkdown(parts)

  return <MdxDocTemplate {...data!} />
}

const generateStaticParams = IS_PROD ? genGuidesStaticParams : getEmptyArray
const generateMetadata = genGuideMeta(async (params: { slug?: string[] }) => {
  const parts = params.slug ?? []
  const data =
    parts.length === 0 ? await getGuidesMarkdown(['overview']) : await getGuidesMarkdown(parts)
  return { meta: data.meta, pathname: data.pathname }
})

export default FragranceGuidePage
export { generateStaticParams, generateMetadata }

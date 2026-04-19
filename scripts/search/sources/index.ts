import { type GuideModel } from '../../../resources/guide/guideModel.js'
import { GuideModelLoader, SHOP_GUIDE_FS_CONTEXT } from '../../../resources/guide/guideModelLoader.js'
import { type BlogSource } from './blog.js'
import { fetchBlogSources } from './blog.js'
import { MarkdownLoader, type MarkdownSource } from './markdown.js'

export type SearchPageSource = MarkdownSource | BlogSource

export async function fetchGuideSources() {
  const guides = (await GuideModelLoader.allFromFs()).unwrapLeft()

  return guides.map((guide: GuideModel) => MarkdownLoader.fromGuideModel('markdown', guide))
}

export async function fetchShopGuideSources() {
  const guides = (await GuideModelLoader.allFromFs(undefined, SHOP_GUIDE_FS_CONTEXT)).unwrapLeft()
  return guides.map((guide: GuideModel) => MarkdownLoader.fromGuideModel('markdown', guide))
}

/**
 * Fetches all MDX-backed sources for FTS indexing: fragrance notes, shop, blog.
 */
export async function fetchAllSources(_fullIndex: boolean): Promise<SearchPageSource[]> {
  const [fragrance, shop, blogLoaders] = await Promise.all([
    fetchGuideSources(),
    fetchShopGuideSources(),
    fetchBlogSources(),
  ])

  const blogNested = await Promise.all(blogLoaders.map((loader) => loader.load()))
  const blog = blogNested.flat() as BlogSource[]

  return [...fragrance, ...shop, ...blog]
}

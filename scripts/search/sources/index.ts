import { type GuideModel } from '../../../resources/guide/guideModel.js'
import { GuideModelLoader, SHOP_GUIDE_FS_CONTEXT } from '../../../resources/guide/guideModelLoader.js'
import { MarkdownLoader, type MarkdownSource } from './markdown.js'

export type SearchPageSource = MarkdownSource

export async function fetchGuideSources() {
  const guides = (await GuideModelLoader.allFromFs()).unwrapLeft()

  return guides.map((guide: GuideModel) => MarkdownLoader.fromGuideModel('markdown', guide))
}

export async function fetchShopGuideSources() {
  const guides = (await GuideModelLoader.allFromFs(undefined, SHOP_GUIDE_FS_CONTEXT)).unwrapLeft()
  return guides.map((guide: GuideModel) => MarkdownLoader.fromGuideModel('markdown', guide))
}

/**
 * Fetches all MDX-backed sources for FTS indexing: fragrance notes, shop.
 */
export async function fetchAllSources(_fullIndex: boolean): Promise<SearchPageSource[]> {
  const [fragrance, shop] = await Promise.all([fetchGuideSources(), fetchShopGuideSources()])

  return [...fragrance, ...shop]
}

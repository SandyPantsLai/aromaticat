import { type GuideModel } from '../../../resources/guide/guideModel.js'
import { GuideModelLoader } from '../../../resources/guide/guideModelLoader.js'
import { MarkdownLoader, type MarkdownSource } from './markdown.js'

export type SearchSource = MarkdownSource

export async function fetchGuideSources() {
  const guides = (await GuideModelLoader.allFromFs()).unwrapLeft()

  return guides.map((guide: GuideModel) => MarkdownLoader.fromGuideModel('guide', guide))
}

/**
 * Fetches all the sources we want to index for search
 */
export async function fetchAllSources(_fullIndex: boolean) {
  const guideSources = await fetchGuideSources()
  return guideSources as SearchSource[]
}

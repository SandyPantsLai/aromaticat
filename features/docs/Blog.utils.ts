import { z } from 'zod'

import { cache_fullProcess_withDevCacheBust } from '~/features/helpers.fs'
import {
  getAllBlogEntriesInternal,
  getArticleSlug as getArticleSlugInternal,
  BlogSchema,
  BLOG_DIRECTORY,
} from './Blog.utils.common.mjs'

export type IBlogMetadata = z.infer<typeof BlogSchema> &
  Pick<Required<z.infer<typeof BlogSchema>>, 'title' | 'tags'>

export interface IBlogEntry {
  filePath: string
  content: string
  contentWithoutJsx: string
  data: IBlogMetadata
}

export const getArticleSlug = getArticleSlugInternal

async function getAllBlogEntriesTyped() {
  const result: IBlogEntry[] = (await getAllBlogEntriesInternal()) as IBlogEntry[]
  return result ?? []
}
export const getAllBlogEntries = cache_fullProcess_withDevCacheBust(
  getAllBlogEntriesTyped,
  BLOG_DIRECTORY,
  () => JSON.stringify([])
)

export async function getAllBlogTags() {
  const entries = await getAllBlogEntries()
  const tags = new Set<string>()
  for (const entry of entries) {
    for (const tag of entry.data.tags) {
      tags.add(tag)
    }
  }
  return Array.from(tags).sort((a, b) => a.localeCompare(b))
}

async function getBlogEntriesByTagImpl(tag: string) {
  const allEntries = await getAllBlogEntries()
  return allEntries.filter((entry) => entry.data.tags.includes(tag))
}
export const getBlogEntriesByTag = cache_fullProcess_withDevCacheBust(
  getBlogEntriesByTagImpl,
  BLOG_DIRECTORY,
  () => JSON.stringify([])
)

import { createHash } from 'node:crypto'
import { BaseLoader, BaseSource } from './base.js'
import { getAllBlogEntriesInternal, getArticleSlug } from '../../../features/docs/Blog.utils.common.mjs'
import type { IBlogEntry } from '../../../features/docs/Blog.utils.js'

/**
 * Loader for blog articles from local MDX files under `content/blog/`.
 * Public path: `/blog/{slug}` (slug from filename).
 */
export class BlogLoader extends BaseLoader {
  type = 'blog' as const

  constructor(
    source: string,
    public entry: IBlogEntry
  ) {
    const slug = getArticleSlug(entry)
    super(source, `/blog/${slug}`)
  }

  async load(): Promise<BlogSource[]> {
    return [new BlogSource(this.source, this.path, this.entry)]
  }
}

export class BlogSource extends BaseSource {
  type = 'blog' as const

  constructor(
    source: string,
    path: string,
    public entry: IBlogEntry
  ) {
    super(source, path)
  }

  async process() {
    const { title, tags, description } = this.entry.data
    const content = this.entry.contentWithoutJsx

    const checksum = createHash('sha256')
      .update(JSON.stringify({ title, tags, description, content }))
      .digest('base64')

    const meta = { title, tags, description }

    const sections = [
      {
        heading: title,
        slug: undefined as string | undefined,
        content: `# ${title}\n${content}`,
      },
    ]

    this.checksum = checksum
    this.meta = meta
    this.sections = sections

    return { checksum, meta, sections }
  }

  extractIndexedContent(): string {
    return `# ${this.entry.data.title}\n\n${this.entry.contentWithoutJsx}`
  }
}

export async function fetchBlogSources(): Promise<BlogLoader[]> {
  const entries = (await getAllBlogEntriesInternal()) as IBlogEntry[]
  return entries.map((entry) => new BlogLoader('blog', entry))
}

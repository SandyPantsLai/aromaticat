import matter from 'gray-matter'
import { promises as fs } from 'node:fs'
import { join, relative, resolve } from 'node:path'

import { extractMessageFromAnyError, FileNotFoundError, MultiError } from '~/app/api/utils'
import { preprocessMdxWithDefaults } from '~/features/directives/utils'
import { checkGuidePageEnabled } from '~/features/docs/NavigationPageStatus.utils'
import { Both, Result } from '~/features/helpers.fn'
import { BLOG_DIRECTORY, FRAGRANCE_NOTES_DIRECTORY, SHOP_DIRECTORY } from '~/lib/docs'
import { processMdx } from '~/scripts/helpers.mdx'
import { GuideModel } from './guideModel'

export type GuideFsContext = {
  rootDirectory: string
  /** Public path prefix without trailing slash, e.g. `/fragrance-notes` or `/blog` */
  pathPrefix: string
}

export const DEFAULT_GUIDE_FS_CONTEXT: GuideFsContext = {
  rootDirectory: FRAGRANCE_NOTES_DIRECTORY,
  pathPrefix: '/fragrance-notes',
}

export const BLOG_GUIDE_FS_CONTEXT: GuideFsContext = {
  rootDirectory: BLOG_DIRECTORY,
  pathPrefix: '/blog',
}

export const SHOP_GUIDE_FS_CONTEXT: GuideFsContext = {
  rootDirectory: SHOP_DIRECTORY,
  pathPrefix: '/shop',
}

/**
 * Determines if a file is hidden.
 *
 * A file is hidden if its name, or the name of any of its parent directories,
 * starts with an underscore.
 */
function isHiddenFile(path: string): boolean {
  return path.split('/').some((part) => part.startsWith('_'))
}

/**
 * Determines if a doc file is disabled in the navigation configuration.
 */
function isDisabledDoc(relPath: string, ctx: GuideFsContext): boolean {
  const fullPath = resolve(ctx.rootDirectory, relPath)
  if (!fullPath.startsWith(ctx.rootDirectory)) return false

  if (ctx.pathPrefix !== '/fragrance-notes') {
    return false
  }

  const relDocPath = relative(ctx.rootDirectory, fullPath)
  const urlPath = relDocPath.replace(/\.mdx?$/, '').replace(/\/index$/, '')
  const docPath = `/fragrance-notes/${urlPath}`.replace(/\/$/, '')

  return !checkGuidePageEnabled(docPath)
}

/**
 * Recursively walks a directory and collects all .mdx files that are not hidden.
 */
async function walkMdxFiles(
  dir: string,
  multiError: { current: MultiError | null },
  ctx: GuideFsContext
): Promise<Array<string>> {
  const readDirResult = await Result.tryCatch(
    () => fs.readdir(dir, { recursive: true }),
    (error) => error
  )

  return readDirResult.match(
    (allPaths) => {
      const mdxFiles: string[] = []

      for (const relativePath of allPaths) {
        if (isHiddenFile(relativePath)) {
          continue
        }

        if (isDisabledDoc(relativePath, ctx)) {
          continue
        }

        if (relativePath.endsWith('.mdx')) {
          mdxFiles.push(join(dir, relativePath))
        }
      }

      return mdxFiles
    },
    (error) => {
      ;(multiError.current ??= new MultiError('Failed to load some docs:')).appendError(
        `Failed to read directory ${dir}: ${extractMessageFromAnyError(error)}`,
        error
      )
      return []
    }
  )
}

/**
 * Node.js-specific loader for GuideModel instances from the filesystem.
 */
export class GuideModelLoader {
  /**
   * @param relPath - Relative path within the content root (e.g. `overview.mdx`)
   * @param ctx - Filesystem root and URL prefix (defaults to fragrance notes)
   */
  static async fromFs(
    relPath: string,
    ctx: GuideFsContext = DEFAULT_GUIDE_FS_CONTEXT
  ): Promise<Result<GuideModel, Error>> {
    return Result.tryCatch(
      async () => {
        const filePath = join(ctx.rootDirectory, relPath)
        const fileContent = await fs.readFile(filePath, 'utf-8')

        const { data: metadata, content: rawContent } = matter(fileContent)

        const processedContent = await preprocessMdxWithDefaults(rawContent)

        const { sections } = await processMdx(processedContent)

        const subsections = sections.map((section) => ({
          title: section.heading,
          href: section.slug,
          content: section.content,
        }))

        const title = metadata.title || sections.find((s) => s.heading)?.heading

        const urlPath = relPath.replace(/\.mdx?$/, '').replace(/\/index$/, '')
        const base = ctx.pathPrefix.replace(/\/$/, '') || ctx.pathPrefix
        const hrefPath = urlPath ? `${base}/${urlPath}` : base

        return new GuideModel({
          title,
          href: hrefPath,
          content: processedContent,
          metadata,
          subsections,
        })
      },
      (error) => {
        if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
          return new FileNotFoundError('', error)
        }
        return new Error(
          `Failed to load doc from ${relPath}: ${extractMessageFromAnyError(error)}`,
          {
            cause: error,
          }
        )
      }
    )
  }

  private static async loadDocs(
    filePaths: Array<string>,
    multiError: { current: MultiError | null },
    ctx: GuideFsContext
  ): Promise<Array<GuideModel>> {
    const loadPromises = filePaths.map(async (filePath) => {
      const relPath = relative(ctx.rootDirectory, filePath)
      return this.fromFs(relPath, ctx)
    })

    const results = await Promise.all(loadPromises)
    const docs: Array<GuideModel> = []

    results.forEach((result, index) => {
      const relPath = relative(ctx.rootDirectory, filePaths[index])

      result.match(
        (guide) => docs.push(guide),
        (error) => {
          ;(multiError.current ??= new MultiError('Failed to load some docs:')).appendError(
            `Failed to load ${relPath}: ${extractMessageFromAnyError(error)}`,
            error
          )
        }
      )
    })

    return docs
  }

  /**
   * Walks the configured content root (optionally a subdirectory) and loads models.
   */
  static async allFromFs(
    section?: string,
    ctx: GuideFsContext = DEFAULT_GUIDE_FS_CONTEXT
  ): Promise<Both<Array<GuideModel>, MultiError | null>> {
    const searchDir = section ? join(ctx.rootDirectory, section) : ctx.rootDirectory
    const multiError = { current: null as MultiError | null }

    const mdxFiles = await walkMdxFiles(searchDir, multiError, ctx)

    const docs = await this.loadDocs(mdxFiles, multiError, ctx)

    return new Both(docs, multiError.current)
  }
}

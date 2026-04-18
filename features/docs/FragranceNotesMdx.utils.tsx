import * as Sentry from '@sentry/nextjs'
import { type Metadata, type ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import { readdir } from 'node:fs/promises'
import { extname, join, relative, sep } from 'node:path'

import { extractMessageFromAnyError, FileNotFoundError } from '~/app/api/utils'
import { pluckPromise } from '~/features/helpers.fn'
import { cache_fullProcess_withDevCacheBust, existsFile } from '~/features/helpers.fs'
import type { OrPromise } from '~/features/helpers.types'
import { generateOpenGraphImageMeta } from '~/features/seo/openGraph'
import { BASE_PATH } from '~/lib/constants'
import {
  composeOpenGraphDescription,
  FRAGRANCE_NOTES_DIRECTORY,
  isValidGuideFrontmatter,
  type GuideFrontmatter,
} from '~/lib/docs'
import { GuideModelLoader } from '~/resources/guide/guideModelLoader'
import { checkGuidePageEnabled } from './NavigationPageStatus.utils'
import { getCustomContent } from '~/lib/custom-content/getCustomContent'

const { metadataTitle } = getCustomContent(['metadata:title'])

/** URL pathname for a doc slug (segments under `/fragrance-notes/`). */
function publicPathForSlug(slug: string[]): `/${string}` {
  return (slug.length ? `/fragrance-notes/${slug.join('/')}` : '/fragrance-notes') as `/${string}`
}

function isSafeSlug(slug: string[]): boolean {
  return !slug.some((s) => s === '..' || s.includes(sep) || s.includes('/'))
}

const getGuidesMarkdownInternal = async (slug: string[]) => {
  if (!isSafeSlug(slug)) {
    notFound()
  }

  const relPath = slug.join(sep).replace(/\/$/, '')
  const fullPath = join(FRAGRANCE_NOTES_DIRECTORY, relPath + '.mdx')
  const docPath = publicPathForSlug(slug)

  if (!fullPath.startsWith(FRAGRANCE_NOTES_DIRECTORY)) {
    notFound()
  }

  if (!checkGuidePageEnabled(docPath)) {
    console.log('Page is disabled: %s', docPath)
    notFound()
  }

  try {
    const guide = (await GuideModelLoader.fromFs(relative(FRAGRANCE_NOTES_DIRECTORY, fullPath))).unwrap()
    const content = guide.content ?? ''
    const meta = guide.metadata ?? {}

    if (!isValidGuideFrontmatter(meta)) {
      throw Error(`Type of frontmatter is not valid for path: ${fullPath}`)
    }

    return {
      pathname: publicPathForSlug(slug),
      meta,
      content,
    }
  } catch (error: unknown) {
    if (error instanceof Error && error.cause instanceof FileNotFoundError) {
      console.log('Could not read Markdown at path: %s', fullPath)
    } else {
      console.error(
        'Error processing Markdown file at path: %s:\n\t%s',
        fullPath,
        extractMessageFromAnyError(error)
      )
      Sentry.captureException(error)
    }
    notFound()
  }
}

/**
 * Caching this for the entire process is fine because the Markdown content is
 * baked into each deployment and cannot change. There's also nothing sensitive
 * here: this is just reading the public MDX files from the codebase.
 */
const getGuidesMarkdown = cache_fullProcess_withDevCacheBust(
  getGuidesMarkdownInternal,
  FRAGRANCE_NOTES_DIRECTORY,
  (filename: string) => JSON.stringify([filename.replace(/\.mdx$/, '').split(sep)])
)

const genGuidesStaticParams = async () => {
  const files = (await readdir(FRAGRANCE_NOTES_DIRECTORY, { recursive: true }))
    .filter((file) => extname(file) === '.mdx' && !file.split(sep).at(-1)?.startsWith('_'))
    .map((file) => ({ slug: file.replace(/\.mdx$/, '').split(sep) }))
    .concat(
      (await existsFile(join(FRAGRANCE_NOTES_DIRECTORY, 'index.mdx'))) ? [{ slug: [] as string[] }] : []
    )

  const enabledParams = files.filter((param) => {
    const docPath = publicPathForSlug(param.slug)
    const isEnabled = checkGuidePageEnabled(docPath)
    if (!isEnabled) {
      console.log('Excluding disabled page from static generation: %s', docPath)
    }
    return isEnabled
  })

  return enabledParams
}

const genGuideMeta =
  <Params,>(
    generate: (params: Params) => OrPromise<{ meta: GuideFrontmatter; pathname: `/${string}` }>
  ) =>
  async (props: { params: Promise<Params> }, parent: ResolvingMetadata): Promise<Metadata> => {
    const params = await props.params
    const [parentAlternates, parentOg, { meta, pathname }] = await Promise.all([
      pluckPromise(parent, 'alternates'),
      pluckPromise(parent, 'openGraph'),
      generate(params),
    ])

    const ogType = pathname.startsWith('/fragrance-notes') ? 'fragrance-notes' : 'docs'
    const htmlDescription = meta.description || meta.family || meta.subtitle
    const ogDescription = composeOpenGraphDescription(meta)

    return {
      title: `${meta.title} | ${metadataTitle || 'Supabase'}`,
      description: htmlDescription,
      // @ts-ignore
      alternates: {
        ...parentAlternates,
        canonical: meta.canonical || `${BASE_PATH}${pathname}`,
      },
      openGraph: {
        ...parentOg,
        url: `${BASE_PATH}${pathname}`,
        ...(ogDescription ? { description: ogDescription } : {}),
        images: generateOpenGraphImageMeta({
          type: ogType,
          title: meta.title,
          description: ogDescription ?? meta.description,
        }),
      },
    }
  }

export { genGuideMeta, genGuidesStaticParams, getGuidesMarkdown }

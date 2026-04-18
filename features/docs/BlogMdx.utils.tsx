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
import { BLOG_DIRECTORY, isValidGuideFrontmatter, type GuideFrontmatter } from '~/lib/docs'
import { BLOG_GUIDE_FS_CONTEXT, GuideModelLoader } from '~/resources/guide/guideModelLoader'
import { checkGuidePageEnabled } from './NavigationPageStatus.utils'
import { getCustomContent } from '~/lib/custom-content/getCustomContent'

const { metadataTitle } = getCustomContent(['metadata:title'])

function publicPathForSlug(slug: string[]): `/${string}` {
  return (slug.length ? `/blog/${slug.join('/')}` : '/blog') as `/${string}`
}

function isSafeSlug(slug: string[]): boolean {
  return !slug.some((s) => s === '..' || s.includes(sep) || s.includes('/'))
}

const getBlogMarkdownInternal = async (slug: string[]) => {
  if (!isSafeSlug(slug)) {
    notFound()
  }

  const relPath = slug.join(sep).replace(/\/$/, '')
  const fullPath = join(BLOG_DIRECTORY, relPath + '.mdx')
  const docPath = publicPathForSlug(slug)

  if (!fullPath.startsWith(BLOG_DIRECTORY)) {
    notFound()
  }

  if (!checkGuidePageEnabled(docPath)) {
    console.log('Page is disabled: %s', docPath)
    notFound()
  }

  try {
    const guide = (
      await GuideModelLoader.fromFs(relative(BLOG_DIRECTORY, fullPath), BLOG_GUIDE_FS_CONTEXT)
    ).unwrap()
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

const getBlogMarkdown = cache_fullProcess_withDevCacheBust(
  getBlogMarkdownInternal,
  BLOG_DIRECTORY,
  (filename: string) => JSON.stringify([filename.replace(/\.mdx$/, '').split(sep)])
)

const genBlogStaticParams = async () => {
  const files = (await readdir(BLOG_DIRECTORY, { recursive: true }))
    .filter((file) => extname(file) === '.mdx' && !file.split(sep).at(-1)?.startsWith('_'))
    .map((file) => ({ slug: file.replace(/\.mdx$/, '').split(sep) }))
    .concat((await existsFile(join(BLOG_DIRECTORY, 'index.mdx'))) ? [{ slug: [] as string[] }] : [])

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

const genBlogMeta =
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

    const htmlDescription = meta.description || meta.subtitle || meta.family

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
        images: generateOpenGraphImageMeta({
          type: 'docs',
          title: meta.title,
          description: htmlDescription,
        }),
      },
    }
  }

export { genBlogMeta, genBlogStaticParams, getBlogMarkdown }

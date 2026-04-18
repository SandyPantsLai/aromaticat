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
  isValidGuideFrontmatter,
  SHOP_DIRECTORY,
  type GuideFrontmatter,
} from '~/lib/docs'
import { GuideModelLoader, type GuideFsContext } from '~/resources/guide/guideModelLoader'
import { checkGuidePageEnabled } from './NavigationPageStatus.utils'
import { getCustomContent } from '~/lib/custom-content/getCustomContent'

const { metadataTitle } = getCustomContent(['metadata:title'])

export const SHOP_SECTIONS = ['bottles', 'decants', 'catch-and-release'] as const
export type ShopSection = (typeof SHOP_SECTIONS)[number]

export function isShopSection(s: string): s is ShopSection {
  return (SHOP_SECTIONS as readonly string[]).includes(s)
}

function shopRoot(section: ShopSection) {
  return join(SHOP_DIRECTORY, section)
}

function shopFsContext(section: ShopSection): GuideFsContext {
  return {
    rootDirectory: shopRoot(section),
    pathPrefix: `/shop/${section}`,
  }
}

function publicPathForSlug(section: ShopSection, slug: string[]): `/${string}` {
  const tail = slug.length ? slug.join('/') : ''
  return (tail ? `/shop/${section}/${tail}` : `/shop/${section}`) as `/${string}`
}

function isSafeSlug(slug: string[]): boolean {
  return !slug.some((s) => s === '..' || s.includes(sep) || s.includes('/'))
}

async function getShopMarkdownInternal(section: ShopSection, slug: string[]) {
  if (!isSafeSlug(slug)) {
    notFound()
  }

  const root = shopRoot(section)
  const relPath = slug.join(sep).replace(/\/$/, '')
  const fullPath = join(root, relPath + '.mdx')
  const docPath = publicPathForSlug(section, slug)

  if (!fullPath.startsWith(root)) {
    notFound()
  }

  if (!checkGuidePageEnabled(docPath)) {
    console.log('Page is disabled: %s', docPath)
    notFound()
  }

  try {
    const guide = (
      await GuideModelLoader.fromFs(relative(root, fullPath), shopFsContext(section))
    ).unwrap()
    const content = guide.content ?? ''
    const meta = guide.metadata ?? {}

    if (!isValidGuideFrontmatter(meta)) {
      throw Error(`Type of frontmatter is not valid for path: ${fullPath}`)
    }

    return {
      pathname: publicPathForSlug(section, slug),
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

const getShopMarkdown = cache_fullProcess_withDevCacheBust(
  getShopMarkdownInternal,
  SHOP_DIRECTORY,
  (filename: string) => {
    const normalized = filename.split(sep).join('/')
    const withoutExt = normalized.replace(/\.mdx$/, '')
    const parts = withoutExt.split('/')
    const section = parts[0]
    if (!section || !isShopSection(section)) {
      return JSON.stringify(['__invalid__', []])
    }
    const slugParts = parts.slice(1)
    return JSON.stringify([section, slugParts])
  }
)

export async function genShopStaticParams() {
  const out: Array<{ section: ShopSection; slug: string[] }> = []

  for (const section of SHOP_SECTIONS) {
    const root = shopRoot(section)
    const files = (await readdir(root, { recursive: true })).filter(
      (file) => extname(file) === '.mdx' && !file.split(sep).at(-1)?.startsWith('_')
    )
    for (const file of files) {
      out.push({ section, slug: file.replace(/\.mdx$/, '').split(sep) })
    }
    if (await existsFile(join(root, 'index.mdx'))) {
      out.push({ section, slug: [] })
    }
  }

  const enabled = out.filter(({ section, slug }) => {
    const docPath = publicPathForSlug(section, slug)
    const isEnabled = checkGuidePageEnabled(docPath)
    if (!isEnabled) {
      console.log('Excluding disabled page from static generation: %s', docPath)
    }
    return isEnabled
  })

  return enabled
}

export const genShopMeta =
  <Params extends { section: ShopSection; slug?: string[] }>(
    generate: (params: Params) => OrPromise<{ meta: GuideFrontmatter; pathname: `/${string}` }>
  ) =>
  async (props: { params: Promise<Params> }, parent: ResolvingMetadata): Promise<Metadata> => {
    const params = await props.params
    const [parentAlternates, parentOg, { meta, pathname }] = await Promise.all([
      pluckPromise(parent, 'alternates'),
      pluckPromise(parent, 'openGraph'),
      generate(params),
    ])

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
          type: 'docs',
          title: meta.title,
          description: ogDescription ?? meta.description,
        }),
      },
    }
  }

export { getShopMarkdown }

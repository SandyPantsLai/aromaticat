// @ts-check

/**
 * Shared blog MDX metadata parsing for the Next.js app and tooling.
 */

import matter from 'gray-matter'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { gfmFromMarkdown, gfmToMarkdown } from 'mdast-util-gfm'
import { mdxFromMarkdown } from 'mdast-util-mdx'
import { toMarkdown } from 'mdast-util-to-markdown'
import { gfm } from 'micromark-extension-gfm'
import { mdxjs } from 'micromark-extension-mdxjs'
import { readdir, readFile, stat } from 'node:fs/promises'
import { join, sep } from 'node:path'
import { visit } from 'unist-util-visit'
import { z } from 'zod'

export const BLOG_DIRECTORY = join(process.cwd(), 'content/blog')

/** Minimal frontmatter for static blog posts (listing + optional tag pages). */
export const BlogSchema = z
  .object({
    title: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
  })
  .strict()

/**
 * @param {unknown} metadata
 */
function validateBlogMetadata(metadata) {
  return BlogSchema.safeParse(metadata)
}

export async function getAllBlogEntriesInternal() {
  let directoryContents
  try {
    directoryContents = await readdir(BLOG_DIRECTORY, {
      recursive: true,
    })
  } catch {
    return []
  }

  const files = directoryContents.map(async (entry) => {
    const isHidden = entry.startsWith('_')
    if (isHidden) return null

    const filePath = join(BLOG_DIRECTORY, entry)

    const isFile = (await stat(filePath)).isFile()
    if (!isFile) return null

    const fileContents = await readFile(filePath, 'utf-8')
    const { content, data: frontmatter } = matter(fileContents)

    const parseResult = validateBlogMetadata(frontmatter)
    if ('error' in parseResult) {
      console.error(`Error validating blog metadata\nEntry:%O\nError:%O`, frontmatter, parseResult.error)
      return null
    }

    const mdxTree = fromMarkdown(content, {
      extensions: [gfm(), mdxjs()],
      mdastExtensions: [gfmFromMarkdown(), mdxFromMarkdown()],
    })
    visit(mdxTree, (node) => {
      if ('children' in node) {
        node.children = node.children.filter(
          (child) =>
            ![
              'mdxJsxFlowExpression',
              'mdxJsxTextExpression',
              'mdxFlowExpression',
              'mdxTextExpression',
              'mdxJsxFlowElement',
              'mdxJsxTextElement',
              'mdxJsxExpressionAttribute',
              'mdxJsxAttribute',
              'mdxJsxAttributeValueExpression',
              'mdxjsEsm',
            ].includes(child.type)
        )
      }

      if (node.type === 'link' || node.type === 'image') {
        canonicalizeUrl(node)
      }
    })

    const contentWithoutJsx = toMarkdown(mdxTree, {
      extensions: [gfmToMarkdown()],
    })

    return {
      filePath,
      content,
      contentWithoutJsx,
      data: parseResult.data,
    }
  })

  return (await Promise.all(files)).filter((x) => x != null)
}

/**
 * @param {import('mdast').Image | import('mdast').Link} node
 */
function canonicalizeUrl(node) {
  if (node.url.startsWith('/')) {
    node.url === 'https://supabase.com' + node.url
  }
}

/**
 * @param {{ filePath: string }} entry
 */
export function getArticleSlug(entry) {
  const parts = entry.filePath.split(sep)
  return parts[parts.length - 1].replace(/\.mdx$/, '')
}

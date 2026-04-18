import { fromMarkdown } from 'mdast-util-from-markdown'
import { gfmFromMarkdown } from 'mdast-util-gfm'
import { gfm } from 'micromark-extension-gfm'

/** Strips a leading Markdown H1 so the page title from frontmatter is not duplicated in MDX body. */
export function removeRedundantH1(content: string) {
  const mdxTree = fromMarkdown(content, 'utf-8', {
    extensions: [gfm()],
    mdastExtensions: [gfmFromMarkdown()],
  })

  const maybeH1 = mdxTree.children[0]
  if (maybeH1 && maybeH1.type === 'heading' && maybeH1.depth === 1) {
    content = content.slice(maybeH1.position?.end?.offset)
  }

  return content
}

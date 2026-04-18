import fs from 'node:fs'
import path from 'node:path'
import { globby } from 'globby'
import matter from 'gray-matter'
import { create as createTar } from 'tar'

const PARTIALS_DIR = path.join(process.cwd(), 'content', '_partials')

/**
 * Reads <$Partial path="..." /> tags and replaces them with the file contents.
 * Recurses to handle nested partials.
 */
async function inlinePartials(content: string): Promise<string> {
  const partialRegex = /<\$Partial\s+path="([^"]+)"[^/]*\/>/g
  const matches = [...content.matchAll(partialRegex)]
  for (const [fullMatch, partialPath] of matches) {
    try {
      const raw = await fs.promises.readFile(path.join(PARTIALS_DIR, partialPath), 'utf8')
      const { content: partialBody } = matter(raw)
      const inlined = await inlinePartials(partialBody)
      content = content.replace(fullMatch, inlined)
    } catch {
      content = content.replace(fullMatch, '')
    }
  }
  return content
}

/** Remove the minimum common leading whitespace from all non-empty lines. */
function dedentBlock(text: string): string {
  const lines = text.split('\n')
  const nonEmpty = lines.filter((l) => /\S/.test(l))
  if (!nonEmpty.length) return text
  const minIndent = Math.min(...nonEmpty.map((l) => (l.match(/^([ \t]*)/) ?? ['', ''])[1].length))
  if (!minIndent) return text
  return lines.map((l) => l.slice(minIndent)).join('\n')
}

/**
 * Strips JSX component tags while keeping inner content.
 */
function stripJsxTags(content: string): string {
  content = content.replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
  content = content.replace(/<[\$A-Z][\w.]*(?:\s[^>]*)?\s*\/>/gs, '')
  content = content.replace(/<[\$A-Z][\w.]*(?:\s[^>]*)?\s*>/gs, '')
  content = content.replace(/<\/[\$A-Z][\w.]*>/g, '')
  content = content.replace(/<div(?:\s[^>]*)?\s*>/g, '')
  content = content.replace(/<\/div>/g, '')
  content = content.replace(/<a(?:\s[^>]*)?\s*>/g, '')
  content = content.replace(/<\/a>/g, '')

  const segments = content.split(/(```[\s\S]*?```)/g)
  content = segments
    .map((seg, i) => {
      if (i % 2 === 0) return seg.replace(/^[ \t]+/gm, '')
      return seg.replace(
        /^(```[^\n]*\n)([\s\S]*?)(\n[ \t]*```)$/,
        (_, open, body) => open + dedentBlock(body) + '\n```'
      )
    })
    .join('')

  content = content.replace(/^[^\S\n]+$/gm, '')
  content = content.replace(/\n{3,}/g, '\n\n').trim()

  return content
}

async function generate() {
  const files = await globby(['content/fragrance-notes/**/!(_)*.mdx'])
  let warnings = 0

  await Promise.all(
    files.map(async (filePath) => {
      const outPath = filePath
        .replace(/^content\/fragrance-notes\//, 'public/docs/fragrance-notes/')
        .replace(/\.mdx$/, '.md')

      let output: string
      try {
        const raw = await fs.promises.readFile(filePath, 'utf8')
        const { content: rawContent, data } = matter(raw)

        const withPartials = await inlinePartials(rawContent)
        const processed = stripJsxTags(withPartials)

        const tagline = data.family ?? data.subtitle ?? data.description
        const headerLines: string[] = []
        if (data.title) headerLines.push(`# ${data.title}`)
        if (data.brand) headerLines.push(String(data.brand))
        if (tagline) headerLines.push(String(tagline))
        const header = headerLines.join('\n')

        output = header ? `${header}\n\n${processed}` : processed
      } catch (err) {
        warnings++
        console.warn(
          `[warn] Failed to process ${filePath}: ${err instanceof Error ? err.message : err}`
        )
        try {
          output = await fs.promises.readFile(filePath, 'utf8')
        } catch {
          output = `<!-- failed to generate: ${filePath} -->`
        }
      }

      await fs.promises.mkdir(path.dirname(outPath), { recursive: true })
      await fs.promises.writeFile(outPath, output)
    })
  )

  const summary = warnings ? ` (${warnings} with warnings)` : ''
  console.log(`Generated ${files.length} markdown files under public/docs/fragrance-notes/${summary}`)

  const archivePath = 'public/docs.tar.gz'
  const entries = (await globby(['**'], { cwd: 'public/docs' })).sort()
  await createTar(
    { gzip: true, file: archivePath, cwd: 'public/docs', portable: true, mtime: new Date() },
    entries
  )
  console.log(`Created archive at ${archivePath}`)
}

generate()

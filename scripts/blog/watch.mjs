import { watch } from 'node:fs'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const BLOG_DIRECTORY = join(__dirname, '../../content/blog')

let __template
function getTemplate() {
  if (!__template) {
    __template = readFileSync(join(BLOG_DIRECTORY, '_template.mdx'), 'utf8')
  }
  return __template
}

mkdirSync(BLOG_DIRECTORY, { recursive: true })

watch(BLOG_DIRECTORY, { ignoreInitial: true }, (event, filename) => {
  if (!filename || filename.startsWith('_')) return
  if (event !== 'rename') return

  const filePath = join(BLOG_DIRECTORY, filename)
  try {
    readFileSync(filePath)
  } catch {
    return
  }

  if (!filename.endsWith('.mdx')) return

  const content = readFileSync(filePath, 'utf8').trim()
  if (content.length > 0) return

  writeFileSync(filePath, getTemplate(), 'utf8')
  // eslint-disable-next-line no-console
  console.log(`Initialized empty blog file from template: ${filename}`)
})

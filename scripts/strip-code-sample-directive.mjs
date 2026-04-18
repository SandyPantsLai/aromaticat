/**
 * Replaces self-closing <$CodeSample ... /> blocks with plain fenced code
 * so $CodeSample remark can be removed. Preserves meta="name=..." for $CodeTabs.
 */
import fs from 'node:fs'
import path from 'node:path'

const roots = [path.join(process.cwd(), 'content'), path.join(process.cwd(), 'app')]

function extractName(attrs) {
  const meta = attrs.match(/\bmeta=["']([^"']*)["']/)
  if (meta) {
    const m = meta[1].match(/name=([^\s&]+)/)
    if (m) return m[1]
  }
  const p = attrs.match(/\bpath=["']([^"']+)["']/)
  if (p) {
    const base = p[1].split('/').pop() || 'snippet'
    return base.replace(/\.[^.]+$/, '') || 'snippet'
  }
  return 'snippet'
}

function extractLang(attrs) {
  const lang = attrs.match(/\blanguage=["']([^"']+)["']/)
  return lang ? lang[1] : 'text'
}

function replaceAll(content) {
  const re = /<\$CodeSample\s+([\s\S]*?)\/>/g
  return content.replace(re, (_, attrs) => {
    const name = extractName(attrs)
    const lang = extractLang(attrs)
    return `\`\`\`${lang} name=${name}\n# Excerpt removed — use normal fenced code in fragrance docs.\n\`\`\``
  })
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(full, out)
    else if (ent.name.endsWith('.mdx')) out.push(full)
  }
  return out
}

let changed = 0
for (const root of roots) {
  for (const file of walk(root)) {
    const raw = fs.readFileSync(file, 'utf8')
    if (!raw.includes('<$CodeSample')) continue
    const next = replaceAll(raw)
    if (next !== raw) {
      fs.writeFileSync(file, next)
      changed++
      console.log('updated', path.relative(process.cwd(), file))
    }
  }
}
console.log('files changed:', changed)

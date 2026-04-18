/*
 * kudos to leerob from vercel
 * https://leerob.io/blog/nextjs-sitemap-robots
 */

import fs from 'fs'
import { globby } from 'globby'
import matter from 'gray-matter'
import prettier from 'prettier'

async function generate() {
  const contentFiles = await globby(['content/fragrance-notes/**/!(_)*.mdx'])
  const contentPages = await Promise.all(
    contentFiles.map(async (filePath) => {
      const fileContents = await fs.promises.readFile(filePath, 'utf8')
      const {
        data: { sitemapPriority },
      } = matter(fileContents)

      return {
        link: filePath.replace(/^content\//, '').replace(/\.mdx$/, ''),
        priority: sitemapPriority ?? 0.8,
      }
    })
  )

  const blogFiles = await globby(['content/blog/**/!(_)*.mdx'])
  const blogPages = await Promise.all(
    blogFiles.map(async (filePath) => {
      return {
        link: filePath.replace(/^content\//, '').replace(/\.mdx$/, ''),
        priority: 1,
      }
    })
  )

  const shopFiles = await globby(['content/shop/**/!(_)*.mdx'])
  const shopPages = await Promise.all(
    shopFiles.map(async (filePath) => {
      return {
        link: filePath.replace(/^content\//, '').replace(/\.mdx$/, ''),
        priority: 0.9,
      }
    })
  )

  const allPages = (contentPages as Array<{ link: string; priority: number }>)
    .concat(blogPages)
    .concat(shopPages)

  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${allPages
          .map(({ link, priority }) => {
            const finalPriority = priority ?? 0.8
            return `
              <url>
                  <loc>${`https://supabase.com/docs/${link}`}</loc>
                  <changefreq>weekly</changefreq>
                  <priority>${finalPriority}</priority>
              </url>
            `
          })
          .join('')}
    </urlset>
    `

  const prettierConfig = await prettier.resolveConfig('./.prettierrc.js')
  const formatted = await prettier.format(sitemap, {
    ...prettierConfig,
    parser: 'html',
  })

  const sitemapFilePath = `public/sitemap.xml`
  console.log(
    `Total of ${allPages.length} pages in sitemap, located at /apps/docs/${sitemapFilePath}`
  )

  // eslint-disable-next-line no-sync
  fs.writeFileSync(sitemapFilePath, formatted)
}

generate()

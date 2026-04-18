import Link from 'next/link'

import { cn } from 'ui'
import { type IBlogEntry, getArticleSlug } from './Blog.utils'

export function BlogPreview({ entry }: { entry: IBlogEntry }) {
  const slug = getArticleSlug(entry)

  return (
    <div
      className="relative border-b py-4 flex flex-col gap-y-3 @4xl/blog:grid @4xl/blog:grid-cols-[minmax(0,1fr)_auto] @4xl/blog:gap-x-4 @4xl/blog:items-start"
      aria-labelledby={`blog-entry-title-${slug}`}
    >
      <div className="flex flex-col gap-2 min-w-0">
        <Link
          href={`/blog/${slug}`}
          className={cn(
            'visited:text-foreground-lighter',
            'before:absolute before:inset-0',
            'max-w-[90vw]'
          )}
        >
          <h3 id={`blog-entry-title-${slug}`} className="text-lg @4xl/blog:truncate gap-x-4">
            {entry.data.title}
          </h3>
        </Link>
        {entry.data.description ? (
          <p className="text-sm text-foreground-lighter line-clamp-2">{entry.data.description}</p>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-0.5 items-start text-xs">
        {entry.data.tags.map((tag) => (
          <span key={tag} className="px-2 border rounded-full inline-flex items-center">
            {tag[0].toUpperCase() + tag.slice(1)}
          </span>
        ))}
      </div>
    </div>
  )
}

export function BlogListHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="lg:sticky lg:top-[var(--header-height)] lg:z-10 bg-background">
      <div className="pt-8 pb-6 px-5">
        <h1 className="text-4xl tracking-tight mb-7">{title}</h1>
        <p className="text-lg text-foreground-light">{description}</p>
        <hr className="my-7" aria-hidden />
      </div>
    </div>
  )
}

export function BlogEntries({ name, entries }: { name: string; entries: Array<IBlogEntry> }) {
  return (
    <div className="@container/blog">
      <h2 className="sr-only">Blog posts</h2>
      {entries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-foreground-light text-lg">No blog posts available for {name} yet.</p>
        </div>
      ) : (
        <ul className="flex flex-col">
          {entries.map((entry) => (
            <li key={getArticleSlug(entry)}>
              <BlogPreview entry={entry} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

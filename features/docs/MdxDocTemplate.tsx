import { type ReactNode } from 'react'

import { cn } from 'ui'

import BreadcrumbsDefer from '~/components/BreadcrumbsDefer'
import GuidesSidebar from '~/components/GuidesSidebar'
import { TocAnchorsProvider } from '~/features/docs/MdxToc.client'
import { MDXRemoteBase } from '~/features/docs/MdxBase'
import type { WithRequired } from '~/features/helpers.types'
import { type GuideFrontmatter } from '~/lib/docs'
import { SerializeOptions } from '~/types/next-mdx-remote-serialize'

interface BaseMdxDocTemplateProps {
  meta?: GuideFrontmatter
  content?: string
  children?: ReactNode
  mdxOptions?: SerializeOptions
}

type MdxDocTemplateProps =
  | WithRequired<BaseMdxDocTemplateProps, 'children'>
  | WithRequired<BaseMdxDocTemplateProps, 'content'>

const MdxDocTemplate = ({ meta, content, children, mdxOptions }: MdxDocTemplateProps) => {
  const hideToc = meta?.hideToc || meta?.hide_table_of_contents
  const tagline = meta?.family ?? meta?.subtitle

  return (
    <TocAnchorsProvider>
      <div className={'grid grid-cols-12 relative gap-4'}>
        <div
          className={cn(
            'relative',
            'transition-all ease-out',
            'duration-100',
            'col-span-12 md:col-span-9'
          )}
        >
          <BreadcrumbsDefer className="mb-2" />
          <article
            id="sb-docs-guide-main-article"
            className="prose max-w-none"
          >
            <h1 className="mb-0">{meta?.title || 'Supabase Docs'}</h1>
            {meta?.brand && (
              <div className="mt-2 text-sm text-foreground-light">{meta.brand}</div>
            )}
            {tagline && (
              <div
                className={cn(
                  'not-prose text-sm text-foreground-light',
                  meta?.brand ? 'mt-1' : 'mt-2'
                )}
              >
                {tagline}
              </div>
            )}
            <hr className="not-prose border-t-0 border-b my-8" />

            {content && (
              <MDXRemoteBase source={content} options={mdxOptions} customPreprocess={(x) => x} />
            )}
            {children}
          </article>
        </div>
        <GuidesSidebar
          video={meta?.tocVideo}
          hideToc={hideToc}
          className={cn(
            'hidden md:flex',
            'col-span-3 self-start',
            'sticky',
            'top-[calc(var(--header-height)+1px+2rem)]',
            'max-h-[calc(100vh-var(--header-height)-3rem)]'
          )}
        />
      </div>
    </TocAnchorsProvider>
  )
}

export { MdxDocTemplate }

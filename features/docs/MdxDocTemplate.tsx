import { type ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'

import { cn } from 'ui'

import Breadcrumbs from '~/components/Breadcrumbs'
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
          <Breadcrumbs className="mb-2" />
          <article
            id="sb-docs-guide-main-article"
            className="prose max-w-none"
          >
            <h1 className="mb-0 [&>p]:m-0">
              <ReactMarkdown>{meta?.title || 'Supabase Docs'}</ReactMarkdown>
            </h1>
            {meta?.subtitle && (
              <h2 className="mt-3 text-xl text-foreground-light">
                <ReactMarkdown>{meta.subtitle}</ReactMarkdown>
              </h2>
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

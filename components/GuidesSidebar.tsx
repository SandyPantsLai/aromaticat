'use client'

import { cn } from 'ui'
import { ExpandableVideo } from 'ui-patterns/ExpandableVideo'
import { Toc, TOCItems, TOCScrollArea } from 'ui-patterns/Toc'
import { useTocAnchors } from '../features/docs/MdxToc.state'

interface TOCHeader {
  id?: string
  text: string
  link: string
  level: number
}

const GuidesSidebar = ({
  className,
  video,
  hideToc,
}: {
  className?: string
  video?: string
  hideToc?: boolean
}) => {
  const { toc } = useTocAnchors()
  const tocVideoPreview = `https://img.youtube.com/vi/${video}/0.jpg`

  return (
    <div className={cn('thin-scrollbar overflow-y-auto h-fit', 'px-px', className)}>
      <div className="w-full relative border-l flex flex-col gap-6 lg:gap-8 px-2 h-fit">
        {video && (
          <div className="relative pl-5">
            <ExpandableVideo imgUrl={tocVideoPreview} videoId={video} />
          </div>
        )}
        {!hideToc && toc.length !== 0 && (
          <Toc className="-ml-[calc(0.25rem+6px)]">
            <h3 className="inline-flex items-center gap-1.5 font-mono text-xs uppercase text-foreground pl-[calc(1.5rem+6px)]">
              On this page
            </h3>
            <TOCScrollArea>
              <TOCItems items={toc} />
            </TOCScrollArea>
          </Toc>
        )}
      </div>
    </div>
  )
}

export default GuidesSidebar
export { GuidesSidebar }
export type { TOCHeader }

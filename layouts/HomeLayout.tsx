import { type PropsWithChildren } from 'react'

import { getCustomContent } from '~/lib/custom-content/getCustomContent'

import HomePageCover from '~/components/HomePageCover'
import { LayoutMainContent } from './DefaultLayout'
import { SidebarSkeleton } from './MainSkeleton'

const { metadataTitle } = getCustomContent(['metadata:title'])

const HomeLayout = ({ children }: PropsWithChildren) => {
  return (
    <SidebarSkeleton hideSideNav>
      <article>
        <HomePageCover title={metadataTitle ?? 'Documentation'} />
        <LayoutMainContent>
          <div className={['relative transition-all ease-out', 'duration-150 '].join(' ')}>
            <div className="prose max-w-none">{children}</div>
          </div>
        </LayoutMainContent>
      </article>
    </SidebarSkeleton>
  )
}

export default HomeLayout

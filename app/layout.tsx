import '@code-hike/mdx/styles.css'
import 'config/code-hike.scss'
import 'ui-patterns/ShimmeringLoader/index.css'
import '../styles/main.scss'
import '../styles/new-docs.scss'
import '../styles/prism-okaidia.scss'

import { GlobalProviders } from '~/features/app.providers'
import { TopNavSkeleton } from '~/layouts/MainSkeleton'
import { BASE_PATH, IS_PRODUCTION, METADATA_BASE } from '~/lib/constants'
import { getCustomContent } from '~/lib/custom-content/getCustomContent'
import { genFaviconData } from 'common/MetaFavicons/app-router'
import type { Metadata, Viewport } from 'next'

const { metadataApplicationName, metadataTitle } = getCustomContent([
  'metadata:application_name',
  'metadata:title',
])

const metadata: Metadata = {
  metadataBase: METADATA_BASE,
  applicationName: metadataApplicationName,
  title: metadataTitle,
  description:
    'AromatiCat is a fragrance decant trade site for fragrance lovers.',
  icons: genFaviconData(BASE_PATH),
  robots: {
    index: IS_PRODUCTION,
    follow: IS_PRODUCTION,
  },
  openGraph: {
    type: 'article',
    authors: 'AromatiCat',
    url: `${BASE_PATH}`,
    images: `${BASE_PATH}/aromaticat-long-logo.svg`,
    publishedTime: new Date().toISOString(),
    modifiedTime: new Date().toISOString(),
  },
}

const viewport: Viewport = {
  themeColor: '#f6f7f8',
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <GlobalProviders>
          <TopNavSkeleton>{children}</TopNavSkeleton>
        </GlobalProviders>
      </body>
    </html>
  )
}

export { metadata, viewport }
export default RootLayout

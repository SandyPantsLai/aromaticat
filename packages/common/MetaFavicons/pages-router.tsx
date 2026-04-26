'use client'

import Head from 'next/head'
import { useRouter } from 'next/router'

export const DEFAULT_FAVICON_THEME_COLOR = 'f6f7f8'
export const DEFAULT_FAVICON_ROUTE = '/favicon'

const MetaFaviconsPagesRouter = ({
  applicationName,
  route = DEFAULT_FAVICON_ROUTE,
  themeColor = DEFAULT_FAVICON_THEME_COLOR,
  includeRssXmlFeed = false,
  includeManifest = false,
  includeMsApplicationConfig = false,
}: {
  applicationName: string
  route?: string
  themeColor?: string
  includeRssXmlFeed?: boolean
  includeManifest?: boolean
  includeMsApplicationConfig?: boolean
}) => {
  const { basePath } = useRouter()
  const p = `${basePath}${route}`

  return (
    <Head>
      <link rel="apple-touch-icon" href={`${p}/apple-touch-icon.png`} />
      <link rel="icon" type="image/png" sizes="16x16" href={`${p}/favicon-16x16.png`} />
      <link rel="icon" type="image/png" sizes="32x32" href={`${p}/favicon-32x32.png`} />
      <link rel="icon" type="image/png" sizes="192x192" href={`${p}/android-chrome-192x192.png`} />
      <link rel="icon" type="image/png" sizes="512x512" href={`${p}/android-chrome-512x512.png`} />
      <link rel="shortcut icon" href={`${p}/favicon.ico`} />
      <link rel="icon" type="image/x-icon" href={`${p}/favicon.ico`} />
      <meta name="application-name" content={applicationName ?? '\u00a0'} />
      <meta name="theme-color" content={`#${themeColor}`} />
      {includeRssXmlFeed && (
        <link rel="alternate" type="application/rss+xml" href={`${basePath}/feed.xml`} />
      )}
      {includeManifest && <link rel="manifest" href={`${p}/manifest.json`} />}
      {includeMsApplicationConfig && (
        <meta name="msapplication-config" content={`${p}/browserconfig.xml`} />
      )}
    </Head>
  )
}

export default MetaFaviconsPagesRouter

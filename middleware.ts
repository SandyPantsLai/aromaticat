import { NextResponse, type NextRequest } from 'next/server'

import { BASE_PATH } from '~/lib/constants'

const FRAGRANCE_NOTES_PATH = `${BASE_PATH ?? ''}/fragrance-notes`

export function middleware(request: NextRequest) {
  const url = new URL(request.url)

  const requestsMarkdown =
    request.headers.get('Accept')?.includes('text/markdown') || url.pathname.endsWith('.md')

  if (url.pathname.startsWith(FRAGRANCE_NOTES_PATH + '/') && requestsMarkdown) {
    const slug = url.pathname.replace(`${FRAGRANCE_NOTES_PATH}/`, '').replace(/\.md$/, '')
    const rewriteUrl = new URL(url)
    rewriteUrl.pathname = `${BASE_PATH ?? ''}/api/fragrance-notes-md/${slug}`
    return NextResponse.rewrite(rewriteUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/fragrance-notes/:path*'],
}

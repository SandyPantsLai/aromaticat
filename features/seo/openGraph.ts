import { BASE_PATH } from '~/lib/constants'

function docsSiteOrigin(): string {
  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  if (site) return site
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return ''
}

export function generateOpenGraphImageMeta({
  type,
  title,
  description,
}: {
  type: string
  title: string
  description?: string
}) {
  const origin = docsSiteOrigin()
  const path = `${BASE_PATH}/og`
  const qs = new URLSearchParams({
    site: 'docs',
    type,
    title,
    description: description ?? 'undefined',
  })
  const url = origin ? `${origin}${path}?${qs}` : `${path}?${qs}`

  return {
    url,
    width: 800,
    height: 600,
    alt: title,
  }
}

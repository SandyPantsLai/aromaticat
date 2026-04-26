import { BASE_PATH, getPublicSiteOrigin } from '~/lib/constants'

function docsSiteOrigin(): string {
  return getPublicSiteOrigin()
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

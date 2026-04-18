import { ImageResponse } from 'next/og'

export const runtime = 'edge'

/**
 * Open Graph images served from this deployment (no separate misc Supabase project).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') ?? 'Docs'
  const description = searchParams.get('description') ?? ''

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 48,
          background: '#1c1c1c',
          color: '#f8f8f8',
          fontSize: 36,
          fontWeight: 600,
        }}
      >
        <div style={{ marginBottom: 16 }}>{title}</div>
        {description && description !== 'undefined' ? (
          <div style={{ fontSize: 22, fontWeight: 400, color: '#b4b4b4' }}>{description}</div>
        ) : null}
      </div>
    ),
    { width: 800, height: 600 }
  )
}

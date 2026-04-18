import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { POST } from '../route'

const ftsRows = [
  {
    id: 1,
    path: '/fragrance-notes/test',
    type: 'markdown',
    title: 'Test Guide',
    subtitle: null,
    description: 'Test content',
  },
  {
    id: 2,
    path: '/fragrance-notes/another',
    type: 'markdown',
    title: 'Another Guide',
    subtitle: null,
    description: 'Another content',
  },
  {
    id: 3,
    path: '/blog/foo',
    type: 'blog',
    title: 'Blog article',
    subtitle: null,
    description: 'Blog body',
  },
]

const rpcSpy = vi.fn().mockImplementation((funcName: string, params: { query?: string }) => {
  if (funcName === 'docs_search_fts' || funcName === 'docs_search_fts_nimbus') {
    const limit = params?.query === 'database' ? 1 : undefined
    const rows = limit ? ftsRows.slice(0, 1) : ftsRows
    return Promise.resolve({ data: rows, error: null })
  }
  return Promise.resolve({ data: [], error: null })
})
vi.mock('~/lib/supabase', () => ({
  supabase: () => ({
    rpc: rpcSpy,
  }),
}))

describe('/api/graphql searchDocs', () => {
  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    vi.restoreAllMocks()
    vi.doUnmock('~/lib/supabase')
  })

  it('should return search results when given a valid query', async () => {
    const searchQuery = `
      query {
        searchDocs(query: "authentication") {
          nodes {
            title
            href
          }
        }
      }
    `
    const request = new Request('http://localhost/api/graphql', {
      method: 'POST',
      body: JSON.stringify({ query: searchQuery }),
    })

    const response = await POST(request)
    const json = await response.json()

    expect(json.errors).toBeUndefined()
    expect(json.data).toBeDefined()
    expect(json.data.searchDocs).toBeDefined()
    expect(json.data.searchDocs.nodes).toBeInstanceOf(Array)
    expect(json.data.searchDocs.nodes).toHaveLength(3)
    expect(json.data.searchDocs.nodes[0]).toMatchObject({
      title: 'Test Guide',
      href: '/fragrance-notes/test',
    })
  })

  it('should respect the limit parameter', async () => {
    const searchQuery = `
      query {
        searchDocs(query: "database", limit: 1) {
          nodes {
            title
          }
        }
      }
    `
    const request = new Request('http://localhost/api/graphql', {
      method: 'POST',
      body: JSON.stringify({ query: searchQuery }),
    })

    const response = await POST(request)
    const json = await response.json()

    expect(json.errors).toBeUndefined()
    expect(json.data.searchDocs.nodes).toHaveLength(1)
    expect(json.data.searchDocs.nodes[0].title).toBe('Test Guide')
    expect(rpcSpy).toHaveBeenCalledWith(
      'docs_search_fts',
      expect.objectContaining({
        query: 'database',
      })
    )
  })

  it('should include content field when requested', async () => {
    const searchQuery = `
      query {
        searchDocs(query: "api") {
          nodes {
            title
            content
          }
        }
      }
    `
    const request = new Request('http://localhost/api/graphql', {
      method: 'POST',
      body: JSON.stringify({ query: searchQuery }),
    })

    const response = await POST(request)
    const json = await response.json()

    expect(json.errors).toBeUndefined()
    expect(json.data.searchDocs.nodes[0].content).toBe('Test content')
    expect(rpcSpy).toHaveBeenCalledWith(
      'docs_search_fts',
      expect.objectContaining({
        query: 'api',
      })
    )
  })

  it('should handle errors from search RPC', async () => {
    rpcSpy.mockImplementationOnce(() =>
      Promise.resolve({ data: null, error: { message: 'RPC failed' } })
    )

    const searchQuery = `
      query {
        searchDocs(query: "failed query") {
          nodes {
            title
          }
        }
      }
    `
    const request = new Request('http://localhost/api/graphql', {
      method: 'POST',
      body: JSON.stringify({ query: searchQuery }),
    })

    const response = await POST(request)
    const json = await response.json()

    expect(json.errors).toBeDefined()
    expect(json.errors[0].message).toBe('Internal Server Error')
  })

  it('should require a query parameter', async () => {
    const searchQuery = `
      query {
        searchDocs {
          nodes {
            title
          }
        }
      }
    `
    const request = new Request('http://localhost/api/graphql', {
      method: 'POST',
      body: JSON.stringify({ query: searchQuery }),
    })

    const response = await POST(request)
    const json = await response.json()

    expect(json.errors).toBeDefined()
    expect(json.errors[0].message).toContain('required')
  })

  it('should return blog hits with proper fields', async () => {
    const searchQuery = `
      query {
        searchDocs(query: "SSO provider", limit: 3) {
          nodes {
            ... on BlogPost {
              title
              href
              content
            }
          }
        }
      }
    `
    const request = new Request('http://localhost/api/graphql', {
      method: 'POST',
      body: JSON.stringify({ query: searchQuery }),
    })

    const response = await POST(request)
    const json = await response.json()

    expect(json.errors).toBeUndefined()
    expect(json.data).toBeDefined()
    expect(json.data.searchDocs).toBeDefined()
    expect(json.data.searchDocs.nodes).toBeInstanceOf(Array)
    expect(json.data.searchDocs.nodes).toHaveLength(3)

    const blogNode = json.data.searchDocs.nodes[2]
    expect(blogNode).toMatchObject({
      title: 'Blog article',
      href: '/blog/foo',
      content: 'Blog body',
    })
  })
})

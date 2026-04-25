import { describe, expect, it } from 'vitest'

const GRAPHQL_URL = 'https://supabase.com/docs/api/graphql'
// For dev testing: comment out above and uncomment below
// const GRAPHQL_URL = 'http://localhost:3001/docs/api/graphql'

describe('prod smoke test: graphql: searchDocs', () => {
  it('searchDocs query returns results', async () => {
    const query = `
        query SearchDocsQuery($query: String!) {
          searchDocs(query: $query) {
            edges {
              node {
                title
                href
                content
              }
            }
            nodes {
              title
              href
              content
            }
          }
        }
      `
    const result = await fetch(GRAPHQL_URL, {
      method: 'POST',
      body: JSON.stringify({ query, variables: { query: 'typescript type generation' } }),
    })

    expect(result.status).toBe(200)
    const { data, errors } = await result.json()
    expect(errors).toBeUndefined()

    const {
      searchDocs: { edges, nodes },
    } = data
    expect(Array.isArray(nodes)).toBe(true)
    expect(nodes.length).toBeGreaterThan(0)
    expect(nodes[0]).toHaveProperty('title')
    expect(nodes[0]).toHaveProperty('href')
    expect(nodes[0]).toHaveProperty('content')

    expect(Array.isArray(edges)).toBe(true)
    expect(edges.length).toBeGreaterThan(0)
    expect(edges[0].node).toHaveProperty('title')
    expect(edges[0].node).toHaveProperty('href')
    expect(edges[0].node).toHaveProperty('content')
  })

  it('searchDocs query includes guides', async () => {
    const query = `
        query SearchDocsQuery($query: String!) {
          searchDocs(query: $query) {
            nodes {
              ...on Guide {
                title
                href
                content
                subsections {
                  nodes {
                    title
                    href
                    content
                  }
                }
              }
            }
          }
        }
      `
    const result = await fetch(GRAPHQL_URL, {
      method: 'POST',
      body: JSON.stringify({ query, variables: { query: 'typescript type generation' } }),
    })

    expect(result.status).toBe(200)
    const { data, errors } = await result.json()
    expect(errors).toBeUndefined()

    const {
      searchDocs: { nodes },
    } = data
    expect(Array.isArray(nodes)).toBe(true)
    expect(nodes.length).toBeGreaterThan(0)

    const guideNode = nodes.find((node: any) => !!node.title)
    expect(guideNode).toBeDefined()
    expect(guideNode).toHaveProperty('title')
    expect(guideNode).toHaveProperty('href')
    expect(guideNode).toHaveProperty('content')
    expect(guideNode).toHaveProperty('subsections')
  })

})

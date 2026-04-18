import { afterAll, beforeAll, vi } from 'vitest'

let oldEnv: NodeJS.ProcessEnv

/** jsdom does not implement `matchMedia`; `common` reads it at import time. */
function installMatchMediaMock() {
  if (typeof window === 'undefined') return
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

beforeAll(() => {
  // Use local Supabase to run e2e tests
  oldEnv = { ...process.env }
  process.env = {
    ...process.env,
    NEXT_PUBLIC_SUPABASE_URL: 'http://localhost:54321',
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
  }

  // Prevent errors about importing server-only modules from Client Components
  vi.mock('server-only', () => {
    return {}
  })
})

afterAll(() => {
  process.env = oldEnv
  vi.doUnmock('server-only')
})

installMatchMediaMock()

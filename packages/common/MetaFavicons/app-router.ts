import { type Metadata } from 'next'

/**
 * Favicon set under `public/favicon/`: ICO + PNG sizes, Apple touch icon, Android Chrome (PWA).
 * Paths are prefixed with `basePath` (e.g. `NEXT_PUBLIC_BASE_PATH`).
 */
const genFaviconData = (basePath: string): Metadata['icons'] => ({
  icon: [
    { url: `${basePath}/favicon/favicon-16x16.png`, sizes: '16x16', type: 'image/png' },
    { url: `${basePath}/favicon/favicon-32x32.png`, sizes: '32x32', type: 'image/png' },
    { url: `${basePath}/favicon/favicon.ico`, type: 'image/x-icon' },
    {
      url: `${basePath}/favicon/android-chrome-192x192.png`,
      sizes: '192x192',
      type: 'image/png',
    },
    {
      url: `${basePath}/favicon/android-chrome-512x512.png`,
      sizes: '512x512',
      type: 'image/png',
    },
  ],
  shortcut: `${basePath}/favicon/favicon.ico`,
  apple: `${basePath}/favicon/apple-touch-icon.png`,
})

export { genFaviconData }

import type { Components } from 'react-markdown'

/**
 * Default react-markdown wraps prose in `<p>`, which is invalid inside `<h1>` / `<h2>`
 * and can make the browser “fix” the DOM differently from React (hydration warnings).
 */
export const guideHeadingMarkdownComponents = {
  p: ({ children }) => <span className="block m-0">{children}</span>,
} satisfies Components

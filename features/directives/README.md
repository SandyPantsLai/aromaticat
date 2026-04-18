# Directives

Directives are a small MDX extension for this documentation site: compile-time transforms on the MDX AST before pages render.

## Why not only React components?

MDX supports React components, and you should use them when they are enough. Directives are for patterns that are easier to author as lightweight syntax (for example, tabbed code) and are rewritten into components during preprocessing.

## Syntax

Directives use a leading `$` so they stay distinct from normal React components, for example `<$CodeTabs>`.

### `<$CodeTabs>` (supported)

Wrap several **fenced code blocks** so they render as tabs. Each fence may include `name=` in the opening line metadata for the tab label:

```mdx
<$CodeTabs>

```text name=example-one
First snippet
```

```text name=example-two
Second snippet
```

</$CodeTabs>
```

See [`CodeTabs.ts`](./CodeTabs.ts) for the transform and [`features/docs/MdxBase.shared.tsx`](../docs/MdxBase.shared.tsx) for the `Tabs` / `TabPanel` components used at runtime.

# Add a Reusable MDX Component

**Job:** You want a custom JSX tag (e.g. **`<MyWidget />`**) available inside **shop** and **fragrance-notes** MDX.

---

## 1. Implement the component

1. Add a React component under **`components/`** (or another appropriate folder).
2. Prefer a **server component** unless you need client hooks (`useState`, etc.).

---

## 2. Register it for MDX

1. Open **`features/docs/MdxBase.shared.tsx`**.
2. **`import`** your component.
3. Add it to the **`components`** object with the **PascalCase** key you want in MDX (e.g. **`MyWidget`**).

---

## 3. Use it in MDX

```mdx
<MyWidget foo="bar" />
```

---

## 4. Verify

Load any MDX page that uses the tag. If the compiler errors, check the import path and that the key in **`components`** matches the tag name exactly.

Registered components today include decant/bottle helpers, `Image`, `Link`, etc. — browse **`MdxBase.shared.tsx`** for examples.

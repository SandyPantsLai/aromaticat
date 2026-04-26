# Troubleshooting Missing Pages and 404s

**Job:** Debug why a guide URL 404s, a grid tile is missing, or nav points nowhere.

---

## URL rules (quick map)

| Area | Disk | URL |
|------|------|-----|
| Decants | `content/shop/decants/...mdx` | `/shop/decants/...` |
| Bottles | `content/shop/bottles/...mdx` | `/shop/bottles/...` |
| Catch and release | `content/shop/catch-and-release/...mdx` | `/shop/catch-and-release/...` |
| Fragrance notes | `content/fragrance-notes/...mdx` | `/fragrance-notes/...` |

- **`/shop/{section}`** with no slug redirects to **`/shop/{section}/overview`** ([`app/shop/[section]/[[...slug]]/page.tsx`](../../../app/shop/[section]/[[...slug]]/page.tsx)).
- **`/fragrance-notes`** with no slug redirects to **`/fragrance-notes/overview`**.

---

## Checklist (go in order)

### A. File exists and path matches URL

1. Slug segments must match the file path (e.g. **`lotus-flower`** → **`lotus-flower.mdx`**).
2. Extension must be **`.mdx`**.

### B. Frontmatter

1. Every guide needs **`title`** (string). See [`isValidGuideFrontmatter`](../../../lib/docs.ts).
2. Invalid types → error when loading the page.

### C. Hidden from routes (`_` prefix)

If the **filename** starts with **`_`** (e.g. **`_template.mdx`**), static generation **skips** it — intentional for drafts/templates. Rename to publish.

### D. Fragrance notes: nav disabled

If [`checkGuidePageEnabled`](../../../features/docs/NavigationPageStatus.utils.ts) treats your URL as disabled ( **`enabled: false`** in [`NavigationMenu.constants.ts`](../../../components/Navigation/NavigationMenu/NavigationMenu.constants.ts) for **`/fragrance-notes/...`** ), the app **404s** the MDX even when the file exists. Fix the nav entry.

### E. Decant overview tile missing

1. Entry in **`config/shop/decantsOverviewSections.ts`**?
2. **`name`** matches Notion fragrance **title** (case-insensitive)?
3. **`slug`** matches decant MDX stem?

### F. Bottles tile missing

1. Row in **`config/shop/bottlesOverviewInventory.ts`**?
2. **`content/shop/bottles/overview.mdx`** still contains **`<BottlesOverviewGrid />`**?

### G. Sidebar link missing (shop)

Update **`components/Navigation/NavigationMenu/shopCatalog.ts`** (`SHOP_CATALOG`) so **`slug`** matches the MDX file.

### H. Production vs dev

New **`content/`** files require **deployment** (and static params generation in prod). Dev server may need a restart if a rare cache path misses updates.

### I. Search index out of date

FTS is separate from the page existing — see [When I need search to see new content](./search-to-see-new-content.md).

### J. Stale Notion fields on decant UI

See [Refresh the fragrances catalog](./refresh-the-fragrances-catalog.md).

---

## SEO / robots (FYI)

[`app/layout.tsx`](../../../app/layout.tsx): **`robots.index`** follows **`IS_PRODUCTION`** (non-prod often **noindex**). Sitemap runs in **`postbuild`**.

---

## Deep reference (code)

| Topic | File |
|------|------|
| Shop MDX + static params | `features/docs/ShopMdx.utils.tsx` |
| Fragrance notes MDX | `features/docs/FragranceNotesMdx.utils.tsx` |
| Frontmatter shape | `lib/docs.ts` |
| MDX component registry | `features/docs/MdxBase.shared.tsx` |
| Decants overview config | `config/shop/decantsOverviewSections.ts` |
| Bottles grid config | `config/shop/bottlesOverviewInventory.ts` |
| Shop sidebar tree | `components/Navigation/NavigationMenu/shopCatalog.ts` |
| Notion cache | `lib/fragrances.ts` |
| Revalidate API | `app/api/revalidate/` |
| FTS indexer | `scripts/search/index-pages.ts` |

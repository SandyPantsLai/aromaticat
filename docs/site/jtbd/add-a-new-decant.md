# Add a New Decant

**Job:** A decant exists in Notion (or will). You want a public **`/shop/decants/{slug}`** page, correct catalog tiles, and it listed in the shop sidebar.

---

## 1. Create the MDX page

1. Choose a URL slug (lowercase, hyphens), e.g. `northern`.
2. Create **`content/shop/decants/{slug}.mdx`**.
3. Add YAML frontmatter with at least **`title`** (required for all guide MDX). See [`lib/docs.ts`](../../../lib/docs.ts) (`GuideFrontmatter`).
4. Copy body structure from **`content/shop/decants/_template.mdx`** and replace the placeholder **`Frag Name`** with the exact **`name`** you will use in Notion (next step).

**Visitor list (no checkout):** The template includes **`<DecantInfo />`**, which lets people pick **3 / 5 / 10 ml** and add the line to a **browser-only list** (local storage; they open the list from the header, use **Copy list** to paste into a message, or take a screenshot, then contact you). **Decant overview** cards are browse-only and do not add to that list.

**Important:** Every component that takes **`name="..."`** (e.g. `<FragranceCost name="…" />`, `<FragranceImage name="…" />`) must use the **same string** as the fragrance **title** in Notion (`notion.fragrances`). Matching is **case-insensitive**.

---

## 2. Align Notion (catalog source)

1. In Notion, set the fragrance **title** property to match the **`name=`** strings in your MDX (spacing and punctuation matter for display; lookup is case-insensitive).
2. After bulk catalog edits, you may need to **invalidate the Next cache** so decant cards update everywhere — see [Refresh the fragrances catalog](./refresh-the-fragrances-catalog.md).

---

## 3. Show it on a decants overview grid (optional)

Overview sections are defined in **`config/shop/decantsOverviewSections.ts`** (`DECANTS_OVERVIEW_SECTIONS`).

1. Open **`config/shop/decantsOverviewSections.ts`**.
2. Under the right section key (`all`, `featured`, `new`, or a key you add), add an entry:
   - **`slug`:** same as the MDX filename **without** `.mdx` (e.g. `northern`).
   - **`name`:** same string as Notion title / MDX **`name=`** props.
3. If you added a **new section key**, use it in **`content/shop/decants/overview.mdx`** (or elsewhere) as  
   `<DecantsOverviewSection category="yourKey" />`  
   Optional: `layout="carousel"` for a horizontal strip.

---

## 4. Add it to the shop sidebar (recommended)

The left nav “Shop → Decants → brand → product” tree comes from **`components/Navigation/NavigationMenu/shopCatalog.ts`** (`SHOP_CATALOG`).

1. Open **`shopCatalog.ts`**.
2. Under **`id: 'decants'`**, find or create the right **`brands`** block.
3. Add **`{ name: 'Display name', slug: 'your-slug' }`** where **`slug`** matches the MDX stem (no `.mdx`).

If you skip this step, the page can still load at **`/shop/decants/{slug}`**, but the sidebar may not link to it.

---

## 5. Verify

1. Run the app, open **`/shop/decants/{slug}`** — no 404, frontmatter errors, or “fragrance not found” tiles.
2. Open **`/shop/decants/overview`** — your section shows the card if you added it in step 3.
3. Open Shop from the header — decants nav includes the product if you did step 4.

If something fails, use [Troubleshooting: missing pages and 404s](./troubleshooting-missing-pages-and-404s.md).

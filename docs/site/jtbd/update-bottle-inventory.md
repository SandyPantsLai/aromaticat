# Update Bottle Inventory

**Job:** You want a **tile on `/shop/bottles/overview`** (manual text + image) and optionally a **detail page** and **sidebar link**.

---

## 1. Add or edit a grid tile (manual data)

Tiles are **not** loaded from Notion. They come from **`config/shop/bottlesOverviewInventory.ts`**.

1. Open **`config/shop/bottlesOverviewInventory.ts`**.
2. Add or edit an object in **`BOTTLES_OVERVIEW_INVENTORY`**:
   - **`image`:** `https://…` **or** a path under **`public/`** starting with **`/`** (e.g. `/img/bottles/foo.png`).
   - **`brand`**, **`name`**, **`condition`**, **`remainingMl`**, **`bottleSizeMl`**, **`cost`:** any strings you want shown.
   - **`href` (optional):** internal path like **`/shop/bottles/lotus-flower`** or an external URL. If omitted, the tile is not clickable.

3. Confirm **`content/shop/bottles/overview.mdx`** still includes **`<BottlesOverviewGrid />`** (it renders the inventory).

---

## 2. Add a bottle detail page (optional)

1. Pick the same slug you used in **`href`** (e.g. `lotus-flower`).
2. Create **`content/shop/bottles/{slug}.mdx`** with frontmatter (**`title`** required) and body content.
3. The public URL is **`/shop/bottles/{slug}`**.

---

## 3. List the bottle in the shop sidebar (optional)

1. Open **`components/Navigation/NavigationMenu/shopCatalog.ts`**.
2. Under **`id: 'bottles'`**, add a **`products`** entry (or extend **`brands`** if you use that structure) with **`slug`** equal to the MDX filename without **`.mdx`**.

If **`href`** in the grid points to a slug that has no MDX file, the link will 404 until you add step 2.

---

## 4. Verify

1. **`/shop/bottles/overview`** — tile shows updated copy and image.
2. If **`href`** is set — link opens the right URL and the detail page exists when internal.
3. Sidebar — product appears under Bottles if you updated **`SHOP_CATALOG`**.

Troubleshooting: [When a page does not show up or 404s](./when-a-page-does-not-show-up-or-404s.md).

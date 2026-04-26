# Add and Update Catch and Release Inventory

**Job:** You want to change the **stock table** on **`/shop/catch-and-release/overview`** without touching the database.

---

## 1. Edit the TypeScript inventory (source of truth)

1. Open **`config/shop/catchAndReleaseInventory.ts`**.
2. Add, remove, or edit objects in **`CATCH_AND_RELEASE_INVENTORY`** (fields: **`brand`**, **`name`**, **`remainingMl`**, **`bottleSizeMl`**, **`cost`**, **`comments`** — all strings for display).
3. Save. In dev, refresh the page; in production, deploy the change.

The MDX file **`content/shop/catch-and-release/overview.mdx`** should keep **`<CatchAndReleaseInventoryTable />`**, which reads that list and renders a table with an **Add to your list** action per row (client-only list, no checkout).

---

## 2. Optional: change intro copy

Edit paragraphs in **`content/shop/catch-and-release/overview.mdx`** (frontmatter and body above the shortcode).

---

## 3. Verify

1. Open **`/shop/catch-and-release/overview`** and confirm the table matches **`catchAndReleaseInventory.ts`** and columns read correctly on mobile (horizontal scroll if the table is wide).
2. Spot-check **Add to your list** for a row if you care about the fake-cart flow (see [Add a new decant](./add-a-new-decant.md) for how the list behaves site-wide).

If the whole route 404s, see [Troubleshooting: missing pages and 404s](./troubleshooting-missing-pages-and-404s.md).

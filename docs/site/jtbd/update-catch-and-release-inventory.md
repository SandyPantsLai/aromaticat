# Add and Update Catch and Release Inventory

**Job:** You want to change the **stock table** on **`/shop/catch-and-release/overview`** without touching the database.

---

## 1. Edit the overview MDX

1. Open **`content/shop/catch-and-release/overview.mdx`**.
2. Update the **GitHub-flavored markdown pipe table** (header row, separator row, one row per line item).
3. Save. In dev, refresh the page; in production, deploy the change.

There is **no** separate TypeScript inventory file for this section today — the table lives entirely in MDX.

---

## 2. Optional: change intro copy

Same file: edit any paragraphs above or below the table.

---

## 3. Verify

Open **`/shop/catch-and-release/overview`** and confirm the table renders and columns read correctly on mobile (horizontal scroll inside prose if the table is wide).

If the whole route 404s, see [When a page does not show up or 404s](./when-a-page-does-not-show-up-or-404s.md).

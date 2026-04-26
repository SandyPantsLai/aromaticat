# Add a Fragrance Notes Page

**Job:** You want a new doc under **`/fragrance-notes/...`** and (usually) a link from the Fragrance Notes nav.

---

## 1. Create the MDX file

1. Decide the URL path. File **`content/fragrance-notes/vanilla.mdx`** → **`/fragrance-notes/vanilla`**. Nested folders become nested URL segments.
2. Create **`content/fragrance-notes/{path}.mdx`** (use **`/`** in the path by using subfolders if needed).
3. Add frontmatter with at least **`title`** (required).

**Do not** start the filename with **`_`** if you want a public route — files like **`_draft.mdx`** are excluded from static generation.

---

## 2. Wire the nav (so the route is “enabled”)

Fragrance notes routes can be treated as **disabled** if the URL is marked off in nav config. See **`checkGuidePageEnabled`** in [`features/docs/NavigationPageStatus.utils.ts`](../../../features/docs/NavigationPageStatus.utils.ts).

1. Open **`components/Navigation/NavigationMenu/NavigationMenu.constants.ts`**.
2. Find the **`fragrance`** / **`GLOBAL_MENU_ITEMS`** structure for Fragrance Notes (and any nested **`items`** / **`menuItems`**).
3. Add a menu entry whose **`url`** (or **`href`**) matches your page path (e.g. **`/fragrance-notes/vanilla`**). Ensure **`enabled`** is not **`false`** on that branch.

If the nav marks a path disabled, the app will **404** that guide even if the MDX file exists.

---

## 3. Verify

1. Open **`/fragrance-notes/{your-path}`** in the browser.
2. Confirm the new item appears in the header or mobile Fragrance Notes menu.

Troubleshooting: [When a page does not show up or 404s](./when-a-page-does-not-show-up-or-404s.md).

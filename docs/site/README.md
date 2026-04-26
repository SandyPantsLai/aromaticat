# Site maintainer guides (Jobs to be done)

Step-by-step docs for **AromatiCat** live under [`jtbd/`](./jtbd/). Start from the job you need; shared concepts (URLs, frontmatter, hidden files) are in [Troubleshooting: missing pages and 404s](./jtbd/troubleshooting-missing-pages-and-404s.md) and linked from each guide.

| When you need to… | Open |
|-------------------|------|
| Ship a **new decant** (MDX page, Notion match, overview tile, sidebar) | [Add a new decant](./jtbd/add-a-new-decant.md) |
| Add or change **bottles** (grid tile, image, optional detail page, sidebar) | [Update bottle inventory](./jtbd/update-bottle-inventory.md) |
| Edit **catch and release** stock list | [Add and update catch and release inventory](./jtbd/update-catch-and-release-inventory.md) |
| Add a **fragrance notes** doc and list it in nav | [Add a fragrance note page](./jtbd/add-a-fragrance-note-page.md) |
| Use a **new React shortcode** inside MDX | [Add a reusable MDX component](./jtbd/add-a-reusable-mdx-component.md) |
| Make **site search** see new/changed pages | [When I need search to see new content](./jtbd/search-to-see-new-content.md) |
| Fix **stale decant numbers** after Notion / DB updates | [Refresh the fragrances catalog](./jtbd/refresh-the-fragrances-catalog.md) |
| Debug **404, missing tile, or nav** issues | [Troubleshooting: missing pages and 404s](./jtbd/troubleshooting-missing-pages-and-404s.md) |

**Where content lives:** shipped MDX is under `content/`; structured shop data is under `config/`; navigation trees include `components/Navigation/NavigationMenu/shopCatalog.ts` and `NavigationMenu.constants.ts`. The **visitor “your list”** (local storage, no checkout) is implemented under `features/shop/dmList/` and is documented in the decant, bottle, and C&R guides above. **Testing:** re-adding the same line (same decant + size, bottle, or C&amp;R row) does not create a second entry; the toast **“Already previously added”** confirms deduplication in the UI.

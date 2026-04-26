# Site maintainer guides (Jobs to be done)

Step-by-step docs for **AromatiCat** live under [`jtbd/`](./jtbd/). Start from the job you need; shared concepts (URLs, frontmatter, hidden files) are in [When a page does not show up or 404s](./jtbd/when-a-page-does-not-show-up-or-404s.md) and linked from each guide.

| When you need to… | Open |
|-------------------|------|
| Ship a **new decant** (MDX page, Notion match, overview tile, sidebar) | [When I add a new decant](./jtbd/when-i-add-a-new-decant.md) |
| Add or change **bottles** (grid tile, image, optional detail page, sidebar) | [When I add or change bottles](./jtbd/when-i-add-or-change-bottles.md) |
| Edit **catch and release** stock list | [When I update catch and release inventory](./jtbd/when-i-update-catch-and-release-inventory.md) |
| Add a **fragrance notes** doc and list it in nav | [When I add a fragrance notes page](./jtbd/when-i-add-a-fragrance-notes-page.md) |
| Use a **new React shortcode** inside MDX | [When I add a reusable MDX component](./jtbd/when-i-add-a-reusable-mdx-component.md) |
| Make **site search** see new/changed pages | [When I need search to see new content](./jtbd/when-i-need-search-to-see-new-content.md) |
| Fix **stale decant numbers** after Notion / DB updates | [When Notion catalog looks stale](./jtbd/when-notion-catalog-looks-stale.md) |
| Debug **404, missing tile, or nav** issues | [When a page does not show up or 404s](./jtbd/when-a-page-does-not-show-up-or-404s.md) |

**Where content lives:** shipped MDX is under `content/`; structured shop data is under `config/`; navigation trees include `components/Navigation/NavigationMenu/shopCatalog.ts` and `NavigationMenu.constants.ts`.

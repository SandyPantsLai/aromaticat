# Search to See New Content

**Job:** Full-text search (Supabase **`page` / `page_section`**) should reflect **new or renamed** MDX paths after you changed **`content/`**.

---

## 1. Know when indexing runs

- **`pnpm run index:docs`** runs [`scripts/search/index-pages.ts`](../../../scripts/search/index-pages.ts).
- **`postbuild`** in **`package.json`** normally runs **`index:docs`** after build (along with sitemap and asset upload). So a **full production build** usually refreshes the index unless **`postbuild`** is skipped.

---

## 2. Run indexing manually (local or CI)

1. Set env vars (see script header): **`NEXT_PUBLIC_SUPABASE_URL`**, plus **`SUPABASE_SERVICE_ROLE_KEY`** or **`SUPABASE_SECRET_KEY`**.
2. From the repo root: **`pnpm run index:docs`**
3. Optional dry run: **`pnpm run index:docs -- --dry-run`**

---

## 3. Shop-specific behavior

For most **`/shop/...`** pages (except paths ending in **`/overview`**), the indexer can merge **catalog fields** from **`notion.fragrances`** — see **`resolveShopMetaForIndexing`** in **`scripts/search/`**.

Purely manual config (e.g. **`bottlesOverviewInventory.ts`**) still only updates search after indexing re-reads built content and your pipeline writes rows.

---

## 4. If search still looks wrong

Confirm the Supabase project has the expected tables / RPC (`docs_search_fts`, etc.). See comments at the top of **`scripts/search/index-pages.ts`**.

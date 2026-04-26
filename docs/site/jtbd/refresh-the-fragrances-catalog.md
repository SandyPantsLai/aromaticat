# Refresh the Fragrances Catalog

**Job:** Decant cards or metadata still show **old** levels, prices, or images after you updated **Notion / `notion.fragrances`**.

---

## Why it happens

[`lib/fragrances.ts`](../../../lib/fragrances.ts) caches Supabase reads with **Next.js `unstable_cache()`**, tagged **`notion-fragrances`**, with a long TTL ([`TIME_TO_CACHE`](../../../features/helpers.time.ts)). Browsers may also cache responses normally.

---

## 1. Invalidate the server Data Cache (immediate)

1. **POST** to **`/api/revalidate`** on your deployed origin (include **`NEXT_PUBLIC_BASE_PATH`** in the URL if you use a path prefix).
2. Headers: **`Content-Type: application/json`**, **`Authorization: Bearer <key>`**  
   Use a key from **`DOCS_REVALIDATION_KEYS`** or **`DOCS_REVALIDATION_OVERRIDE_KEYS`** (override bypasses a per-tag cooldown).
3. Body example:

```json
{ "tags": ["notion-fragrances"] }
```

4. Expect **204** on success (see [`README.md`](../../../README.md) for curl examples).

Valid **`tags`** may also include `graphql`, `partners`, `wrappers` depending on your API schema — see [`features/helpers.fetch.ts`](../../../features/helpers.fetch.ts) (`REVALIDATION_TAGS`).

---

## 2. Wait for TTL (passive)

Cached entries eventually expire per **`TIME_TO_CACHE`** without a POST — fine for non-urgent updates.

---

## 3. What this does **not** affect

Manual **`config/`** files and MDX copy (no Notion components) update on **redeploy** only; they are not behind this Notion cache.

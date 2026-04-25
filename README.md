# AromatiCat

AromatiCat is a [Next.js](https://nextjs.org/) application for fragrance-related content and tooling. The app includes areas such as fragrance notes info and shop routes, and uses a [pnpm](https://pnpm.io/) monorepo with shared packages under `packages/*` (for example `ui`, `common`, and `config`).

The UI is built with React and TypeScript. Data and auth integrate with [Supabase](https://supabase.com/) where configured.

## Prerequisites

- Node.js — a current LTS version compatible with this repo’s TypeScript and Next.js versions.
- pnpm — required; installs are enforced with `only-allow pnpm` in `package.json`.

## Getting started

```bash
pnpm install
pnpm dev
```

The dev server listens on port 3001 (see the `dev` script in `package.json`).

GraphQL codegen runs before `dev` and `build` via `predev` / `prebuild`; ensure environment variables needed for codegen are present if those steps fail locally.

## Common scripts

| Script        | Description |
|---------------|-------------|
| `pnpm dev`    | Next.js dev server and blog file watcher |
| `pnpm build`  | Production build (runs codegen and doc markdown generation first) |
| `pnpm start`  | Start the production server |
| `pnpm lint`   | ESLint |
| `pnpm typecheck` | TypeScript check |
| `pnpm test:local` | Vitest (excluding smoke tests) |
| `pnpm index:docs` | Rebuild site-search FTS data from local MDX into Supabase (`page` / `page_section`; requires service role — see below) |

Integration tests that need a local database use `pnpm test` (starts Supabase locally, runs tests, then stops Supabase).

## Environment

Copy or create `.env.local` (and other env files your setup expects). Do not commit secrets. Use `pnpm dev:secrets:pull` if your workflow pulls secrets via the provided script.

For **`pnpm index:docs`**, set at least:

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — service role key (or `SUPABASE_SECRET_KEY` as an alternative name)
- `DOCS_REVALIDATION_KEYS` - used when manually revalidating the cache after product catalog data changes
- `DOCS_REVALIDATION_OVERRIDE_KEYS` - used to bypass the 6-hour cooldown period if you want to revalidate again before 6 hours has passed

### Fragrance catalog cache

Shop and MDX code paths resolve rows from `notion.fragrances` via [`getFragranceByName`](lib/fragrances.ts) (`server-only`). That helper uses **React `cache()`** so the same trimmed name only hits the data layer once per request, and **Next.js `unstable_cache()`** so results are shared across users until they expire or are invalidated.

- **TTL:** entries revalidate after one day (`TIME_TO_CACHE` in [`features/helpers.time.ts`](features/helpers.time.ts)) as a safety net.
- **Tags:** the cache is tagged with `notion-fragrances` (see [`REVALIDATION_TAGS`](features/helpers.fetch.ts)). CLI scripts should keep using [`fetchFragranceByNameWithClient`](lib/fragrancesQuery.ts) directly so they are not tied to this cache.

To **invalidate immediately** after catalog data changes, POST to **`/api/revalidate`** with a Bearer token from **`DOCS_REVALIDATION_KEYS`** or **`DOCS_REVALIDATION_OVERRIDE_KEYS`** (comma-separated lists are supported). Override keys bypass the six-hour per-tag cooldown enforced for basic keys. Valid `tags` values are: `graphql`, `partners`, `wrappers`, `notion-fragrances`.

Example (local dev on port 3001):

```bash
curl -sS -X POST 'http://localhost:3001/api/revalidate' \
  -H 'Authorization: Bearer YOUR_DOCS_REVALIDATION_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"tags":["notion-fragrances"]}'
```

Use your deployed origin in production; if the app uses a path prefix, include `NEXT_PUBLIC_BASE_PATH` in the URL before `/api/revalidate`. A successful response is **204** with an empty body.

## Supabase

SQL migrations live under [`supabase/migrations/`](supabase/migrations/). Apply them to your **hosted** project in either of these ways:

1. **Supabase CLI** — Install the [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started), run `supabase login`, ensure the repo has `supabase/config.toml` (for example via `supabase init` if it is missing), run `supabase link --project-ref <project-ref>` (the ref is in your project dashboard URL), then `supabase db push` from the repository root.
2. **Dashboard SQL Editor** — Open **SQL** → **New query**, paste the full contents of the migration file you need, and run it. This is enough for a one-off apply when you do not use the CLI. If you later use `db push`, you may need to align migration history (see [`supabase migration repair`](https://supabase.com/docs/reference/cli/supabase-migration-repair)) so the CLI does not try to re-apply an already-run file.

After migrations define the docs search tables and `docs_search_fts`, run `pnpm index:docs` so search has content.

## License

This project is private (see `package.json`).

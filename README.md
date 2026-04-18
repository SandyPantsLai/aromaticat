# AromatiCat

AromatiCat is a [Next.js](https://nextjs.org/) application for fragrance-related content and tooling. The app includes areas such as guides, fragrance notes, a blog, and shop routes, and uses a [pnpm](https://pnpm.io/) monorepo with shared packages under `packages/*` (for example `ui`, `common`, and `config`).

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

Integration tests that need a local database use `pnpm test` (starts Supabase locally, runs tests, then stops Supabase).

## Environment

Copy or create `.env.local` (and other env files your setup expects). Do not commit secrets. Use `pnpm dev:secrets:pull` if your workflow pulls secrets via the provided script.

## License

This project is private (see `package.json`).

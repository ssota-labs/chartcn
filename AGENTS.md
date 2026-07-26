# AGENTS.md

## Cursor Cloud specific instructions

### Overview
`chartcn` is a single-product pnpm monorepo (pnpm workspaces, `pnpm@9.15.4`, Node 22). There is exactly **one runnable service**: the Next.js 16 app in `apps/web`, which serves the docs site, the home page, and the shadcn **registry API** (`/r/registry.json`, `/r/<name>.json`). There is no database, cache, queue, or external dependency — everything is self-contained.

### Commands
All root scripts just delegate to `apps/web` via `pnpm --filter web`. Use the root scripts in `package.json` (do not duplicate them elsewhere):
- `pnpm dev` — start the dev server (Next dev + Turbopack) on `http://localhost:3000`.
- `pnpm build` — production build.
- `pnpm typecheck` — runs `fumadocs-mdx` codegen, `next typegen`, then `tsc --noEmit`.
- `pnpm lint` — ESLint over `apps/web`.
- `pnpm chartcn-search <query>` — the `@chartcn/cli` registry search tool (add `--json` for machine output). Not a service.

### Non-obvious notes
- **MDX types are generated, not committed.** `fumadocs-mdx` generates `.source` types and runs automatically on `pnpm install` (postinstall) and at the start of `pnpm dev` / `pnpm typecheck`. If docs/content types look stale or missing, re-run `pnpm --filter web exec fumadocs-mdx`.
- **`pnpm lint` may report a pre-existing error** in `apps/web/components/charts/treemap-highlight.tsx` (`react-hooks/static-components`). This is unrelated to environment setup — the lint tooling itself works.
- **Registry is the core product surface.** To verify end-to-end that the registry API works, consume it with the shadcn CLI from a scratch project: it needs both a `components.json` and a `tsconfig.json`, then run `npx shadcn@latest add http://localhost:3000/r/<name>.json --yes`. This installs the chart component plus its `card`/`chart` deps.
- `apps/web/next.config.mjs` already sets `allowedDevOrigins` (localhost, `127.0.0.1`, `172.30.0.2`, `null`) so the dev server works inside sandboxed/iframe/LAN previews. Without it, client-side charts stay inert after SSR.
- The `CHARTCN_REGISTRY_URL` / `NEXT_PUBLIC_CHARTCN_REGISTRY_URL` env vars only customize the host printed in generated install commands; they are optional and not needed for local dev.

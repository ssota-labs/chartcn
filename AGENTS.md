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
- **Registry is the core product surface.** To verify end-to-end that the registry API works, consume it with the shadcn CLI from a scratch project. Recent `shadcn` versions need a `package.json` (with a framework dep like `next` so it detects an existing project), a `components.json`, and a `tsconfig.json`; they also prompt once for a component library — pick the default **Base UI (Recommended)**, which is what chartcn's components target. Then run `npx shadcn@latest add http://localhost:3000/r/<name>.json --yes`. This installs the chart component plus its `card`/`chart` deps.
- `apps/web/next.config.mjs` already sets `allowedDevOrigins` (localhost, `127.0.0.1`, `172.30.0.2`, `null`) so the dev server works inside sandboxed/iframe/LAN previews. Without it, client-side charts stay inert after SSR.
- The `CHARTCN_REGISTRY_URL` / `NEXT_PUBLIC_CHARTCN_REGISTRY_URL` env vars only customize the host printed in generated install commands; they are optional and not needed for local dev.

<!-- oh-my-docs:start -->
# Oh My Docs

This repository uses a docs-first workflow. Canonical product intent lives in
**one** handbook SSOT — either local docs (`docs/content/docs` or
`apps/docs/content/docs`) or Notion — never more than one as authoritative.

## Content source (SSOT)

1. Read `.omd/project.json` and use `contentSource.ssot`
   (`local` | `notion`).
2. Missing `contentSource` means `local`.
3. If `.omd/project.json` is missing, run `inspect` / ask the user to choose
   SSOT and `adopt` before inventing handbook files.
4. For `local`, edit the Fumadocs MDX tree. For `notion`, edit the single
   Home page: only `# 도메인` / `# 기획` / `# 개발` section headers, with
   catalog DBs stacked inline under them (no per-catalog headings, no child
   pages, no sidebar) via the host Notion MCP. Do not treat an unselected
   provider as truth.

## Documentation is always first

Any decision, agreement, requirement, design choice, open question, or new
discussion that should outlive this chat must be written into the selected SSOT
— not left only in conversation.

1. Before and during the talk, check whether the topic already exists in the SSOT.
2. Create or update the matching handbook artifacts as the discussion progresses.
3. Catalog entries (PRD, story, plan, ADR, …) go in the **catalog store** — a
   Notion inline database row on Home, or a local catalog folder +
   `meta.json` — never as ad-hoc child pages. **Planning ≠ Plans**:
   implementation plans belong in Plans (`dbs.plans`).
4. Prefer `node <skill>/scripts/omd.mjs new <kind> --title "…" --yes` (local)
   or the Notion catalog workflow (notion) over ad-hoc files or chat-only notes.
5. Run `node <skill>/scripts/omd.mjs check` after meaningful documentation edits.
<!-- oh-my-docs:end -->

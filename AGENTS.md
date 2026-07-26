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

<!-- oh-my-docs:start -->
# Oh My Docs

This repository uses a docs-first workflow. Canonical product intent lives in
**one** handbook SSOT — either local docs (`docs/content/docs` or
`apps/docs/content/docs`) or Notion — never both as authoritative.

## Content source (SSOT)

1. Read `.omd/project.json` and use `contentSource.ssot` (`local` | `notion`).
2. Missing `contentSource` means `local`.
3. If `.omd/project.json` is missing, run `inspect` / ask the user to choose
   SSOT and `adopt` before inventing handbook files.
4. For `notion`, edit the mapped Notion handbook (via the host Notion MCP).
   For `local`, edit the docs content tree. Do not treat the other side as truth.

## Documentation is always first

Any decision, agreement, requirement, design choice, open question, or new
discussion that should outlive this chat must be written into the selected SSOT
— not left only in conversation.

1. Before and during the talk, check whether the topic already exists in the SSOT.
2. Create or update the matching handbook artifacts as the discussion progresses.
3. Catalog entries (PRD, story, plan, ADR, …) go in the **catalog store** — a
   Notion inline database row or a local catalog folder + `meta.json` — never as
   ad-hoc child pages of the parent section. **Planning ≠ Plans**: implementation
   plans belong in Plans (`dbs.plans`), not under Planning.

## Docs-first gate

1. Classify the change as `product`, `bugfix`, `maintenance`, or docs-only.
2. Product changes require an active PRD, a story, an accepted specification, and a ready plan.
3. Bug fixes require an existing PRD/specification and a ready plan.
4. Maintenance requires a ready plan; add a specification if an observable contract changes.
5. If required documents are missing, create and review a docs-only change first.
6. An implementation PR must reference a plan that already exists on the PR base with `stage: ready|active` and covering `codeAreas`.
7. Docs-only edits under the docs content/templates trees (plus root `README.md` / `CHANGELOG.md`) are exempt. There is no general bypass.

Dependency direction:

`product vision → PRD → story → specification/ADR → implementation plan → code`
<!-- oh-my-docs:end -->

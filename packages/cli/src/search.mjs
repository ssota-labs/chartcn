import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, "../../..")
const REGISTRY_PATH = path.join(
  REPO_ROOT,
  "apps/web/registry/registry.json"
)

const DEFAULT_HOST =
  process.env.CHARTCN_REGISTRY_URL?.replace(/\/$/, "") ||
  "https://chartcn.vercel.app"

function printHelp() {
  console.log(`chartcn-search — search the in-repo chartcn registry

Usage:
  pnpm chartcn-search [query] [options]
  node packages/cli/bin/chartcn-search.mjs [query] [options]

Options:
  --json              Machine-readable JSON output (for agents)
  --category <name>   Filter by category (area, bar, line, scatter, pie, analytics, finance, extras)
  --tag <name>        Filter by tag
  --status <name>     Filter by status (ready | stub)
  --host <url>        Registry host for install commands (default: CHARTCN_REGISTRY_URL or the public host)
  --list              List all items (same as empty query)
  -h, --help          Show help

Examples:
  pnpm chartcn-search stacked
  pnpm chartcn-search --category area --json
  pnpm chartcn-search cohort --status stub
`)
}

function parseArgs(argv) {
  const opts = {
    query: "",
    json: false,
    category: null,
    tag: null,
    status: null,
    host: DEFAULT_HOST,
    list: false,
    help: false,
  }

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === "-h" || arg === "--help") {
      opts.help = true
    } else if (arg === "--json") {
      opts.json = true
    } else if (arg === "--list") {
      opts.list = true
    } else if (arg === "--category") {
      opts.category = argv[++i]
    } else if (arg === "--tag") {
      opts.tag = argv[++i]
    } else if (arg === "--status") {
      opts.status = argv[++i]
    } else if (arg === "--host") {
      opts.host = (argv[++i] || "").replace(/\/$/, "")
    } else if (arg.startsWith("-")) {
      throw new Error(`Unknown option: ${arg}`)
    } else if (!opts.query) {
      opts.query = arg
    } else {
      opts.query = `${opts.query} ${arg}`
    }
  }

  return opts
}

function installCommand(name, host) {
  return `npx shadcn@latest add ${host}/r/${name}.json`
}

function matches(item, opts) {
  if (opts.category) {
    const cats = (item.categories || []).map((c) => c.toLowerCase())
    if (!cats.includes(opts.category.toLowerCase())) return false
  }
  if (opts.tag) {
    const tags = (item.tags || []).map((t) => t.toLowerCase())
    if (!tags.includes(opts.tag.toLowerCase())) return false
  }
  if (opts.status) {
    if ((item.status || "").toLowerCase() !== opts.status.toLowerCase()) {
      return false
    }
  }
  if (!opts.query || opts.list) return true

  const q = opts.query.toLowerCase()
  const haystack = [
    item.name,
    item.title,
    item.description,
    item.dataShape,
    ...(item.categories || []),
    ...(item.tags || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  return haystack.includes(q)
}

function formatHuman(item, host) {
  const lines = [
    `${item.name}${item.status === "stub" ? " [stub]" : ""}`,
    `  ${item.title || ""}`,
    `  ${item.description || ""}`,
    `  categories: ${(item.categories || []).join(", ") || "—"}`,
    `  tags: ${(item.tags || []).join(", ") || "—"}`,
    `  deps: ${(item.dependencies || []).join(", ") || "—"}`,
    `  registryDeps: ${(item.registryDependencies || []).join(", ") || "—"}`,
    `  dataShape: ${item.dataShape || "—"}`,
    `  install: ${installCommand(item.name, host)}`,
  ]
  return lines.join("\n")
}

export async function run(argv) {
  const opts = parseArgs(argv)
  if (opts.help) {
    printHelp()
    return
  }

  const raw = await readFile(REGISTRY_PATH, "utf8")
  const registry = JSON.parse(raw)
  const items = (registry.items || []).filter((item) => matches(item, opts))

  const results = items.map((item) => ({
    name: item.name,
    title: item.title,
    description: item.description,
    categories: item.categories || [],
    tags: item.tags || [],
    status: item.status || "ready",
    dependencies: item.dependencies || [],
    registryDependencies: item.registryDependencies || [],
    dataShape: item.dataShape || null,
    install: installCommand(item.name, opts.host),
  }))

  if (opts.json) {
    console.log(
      JSON.stringify(
        {
          query: opts.query || null,
          filters: {
            category: opts.category,
            tag: opts.tag,
            status: opts.status,
          },
          host: opts.host,
          count: results.length,
          items: results,
        },
        null,
        2
      )
    )
    return
  }

  if (results.length === 0) {
    console.log("No matching registry items.")
    process.exitCode = 1
    return
  }

  console.log(
    results.map((item) => formatHuman(item, opts.host)).join("\n\n")
  )
  console.log(`\n${results.length} item(s)`)
}

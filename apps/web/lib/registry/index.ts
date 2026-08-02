/**
 * Registry helpers for serving shadcn-compatible registry JSON.
 * Mark-layer-free: items point at ChartContainer + Recharts source files.
 */

import { readFile, readdir } from "node:fs/promises"
import path from "node:path"

export type RegistryFile = {
  path: string
  type: string
  target?: string
  content?: string
}

export type RegistryItem = {
  $schema?: string
  name: string
  type: string
  title?: string
  description?: string
  dependencies?: string[]
  registryDependencies?: string[]
  categories?: string[]
  tags?: string[]
  status?: "ready" | "stub" | string
  dataShape?: string
  files?: RegistryFile[]
  docs?: string
}

export type RegistryIndex = {
  $schema?: string
  name: string
  homepage?: string
  items: RegistryItem[]
}

/** Scoped under apps/web — keep joins under known subfolders for Turbopack NFT. */
const REGISTRY_DIR = path.join(process.cwd(), "registry")
const ITEMS_DIR = path.join(process.cwd(), "registry", "items")
const COMPONENTS_DIR = path.join(process.cwd(), "components")

/**
 * Public install base, used only for the install command printed alongside
 * each item — serving works regardless of what this returns.
 *
 * The env vars stay as an override for forks and for pointing the docs at a
 * preview deployment; the default is the real host.
 */
export function getRegistryHost(): string {
  return (
    process.env.CHARTCN_REGISTRY_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_CHARTCN_REGISTRY_URL?.replace(/\/$/, "") ||
    "https://chartcn.vercel.app"
  )
}

export function getInstallCommand(itemName: string, host = getRegistryHost()): string {
  return `npx shadcn@latest add ${host}/r/${itemName}.json`
}

export async function loadRegistryIndex(): Promise<RegistryIndex> {
  const raw = await readFile(path.join(REGISTRY_DIR, "registry.json"), "utf8")
  return JSON.parse(raw) as RegistryIndex
}

export async function listItemNames(): Promise<string[]> {
  const files = await readdir(ITEMS_DIR)
  return files
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""))
    .sort()
}

export async function loadRegistryItem(name: string): Promise<RegistryItem | null> {
  const normalized = name.replace(/\.json$/, "")
  const itemPath = path.join(ITEMS_DIR, `${normalized}.json`)
  try {
    const raw = await readFile(itemPath, "utf8")
    return JSON.parse(raw) as RegistryItem
  } catch {
    const index = await loadRegistryIndex()
    return index.items.find((item) => item.name === normalized) ?? null
  }
}

/**
 * Build a shadcn CLI-consumable registry item payload (files include content).
 */
export async function buildRegistryItemPayload(
  name: string
): Promise<RegistryItem | null> {
  const item = await loadRegistryItem(name)
  if (!item) return null

  const files: RegistryFile[] = []
  for (const file of item.files ?? []) {
    const sourcePath = resolveItemSourcePath(file.path)
    let content = ""
    try {
      content = await readFile(sourcePath, "utf8")
    } catch {
      content = `/* Source missing for ${file.path} — stub or not yet merged */\n`
    }
    files.push({
      path: file.target ?? file.path,
      type: file.type,
      target: file.target,
      content,
    })
  }

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    dependencies: item.dependencies ?? [],
    registryDependencies: item.registryDependencies ?? [],
    categories: item.categories,
    tags: item.tags,
    status: item.status,
    dataShape: item.dataShape,
    files,
    docs: item.docs,
  }
}

function resolveItemSourcePath(filePath: string): string {
  // Item JSON paths are relative to apps/web (e.g. components/charts/area-basic.tsx)
  const normalized = filePath.replace(/^\.\.\//, "")
  if (normalized.startsWith("components/")) {
    return path.join(COMPONENTS_DIR, normalized.slice("components/".length))
  }
  if (normalized.startsWith("registry/")) {
    return path.join(REGISTRY_DIR, normalized.slice("registry/".length))
  }
  return path.join(process.cwd(), "registry", normalized)
}

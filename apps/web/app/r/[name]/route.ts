import { NextResponse } from "next/server"

import {
  buildRegistryItemPayload,
  listItemNames,
  loadRegistryIndex,
  getRegistryHost,
  getInstallCommand,
} from "@/lib/registry"

type RouteContext = { params: Promise<{ name: string }> }

/**
 * Serves shadcn-compatible registry JSON for local / demo use.
 *
 * - GET /r/registry.json → index
 * - GET /r/<name>.json or /r/<name> → built registry item (with file content)
 *
 * Install (host via CHARTCN_REGISTRY_URL):
 *   npx shadcn@latest add https://<CHARTCN_REGISTRY_HOST>/r/<name>.json
 */
export async function GET(_request: Request, context: RouteContext) {
  const { name: rawName } = await context.params
  const name = decodeURIComponent(rawName).replace(/\.json$/, "")

  if (name === "registry" || name === "index") {
    const index = await loadRegistryIndex()
    const host = getRegistryHost()
    const payload = {
      ...index,
      $schema: "https://ui.shadcn.com/schema/registry.json",
      items: index.items.map((item) => ({
        name: item.name,
        type: item.type,
        title: item.title,
        description: item.description,
        categories: item.categories,
        tags: item.tags,
        status: item.status,
        dataShape: item.dataShape,
        dependencies: item.dependencies,
        registryDependencies: item.registryDependencies,
        install: getInstallCommand(item.name, host),
      })),
    }
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        "Access-Control-Allow-Origin": "*",
      },
    })
  }

  if (name === "_meta" || name === "catalog") {
    const names = await listItemNames()
    return NextResponse.json(
      { names, host: getRegistryHost() },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    )
  }

  const item = await buildRegistryItemPayload(name)
  if (!item) {
    return NextResponse.json(
      { error: `Registry item not found: ${name}` },
      { status: 404 }
    )
  }

  if (item.status === "stub" && (!item.files || item.files.length === 0)) {
    return NextResponse.json(
      {
        ...item,
        docs: `This item is a stub placeholder. ${getInstallCommand(item.name)} will work once the chart lands in a later phase.`,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          "Access-Control-Allow-Origin": "*",
        },
      }
    )
  }

  return NextResponse.json(item, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      "Access-Control-Allow-Origin": "*",
    },
  })
}

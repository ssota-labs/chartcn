"use client"

import {
  ChartAreaBasic,
  ChartAreaStacked,
  ChartBarBasic,
  ChartBarGrouped,
  ChartLineBasic,
  ChartLineMulti,
} from "@/components/charts"

/**
 * Registry item name → React component (json-render / Vercel Labs style).
 * Agents emit `{ type: "chart-area-stacked", props: {} }` nodes; the runtime looks them up here.
 */
export const chartcnComponentMap = {
  "chart-area-basic": ChartAreaBasic,
  "chart-area-stacked": ChartAreaStacked,
  "chart-bar-basic": ChartBarBasic,
  "chart-bar-grouped": ChartBarGrouped,
  "chart-line-basic": ChartLineBasic,
  "chart-line-multi": ChartLineMulti,
} as const

export type ChartcnRegistryName = keyof typeof chartcnComponentMap

export type ChartcnJsonNode = {
  type: ChartcnRegistryName | string
  props?: Record<string, unknown>
  children?: ChartcnJsonNode[]
}

export function renderChartcnNode(node: ChartcnJsonNode) {
  const Comp = chartcnComponentMap[node.type as ChartcnRegistryName]
  if (!Comp) {
    return (
      <p className="text-sm text-muted-foreground">
        Unknown or stub registry item: <code>{node.type}</code>
      </p>
    )
  }
  return <Comp {...(node.props ?? {})} />
}

/** Demo tree — same registry items usable from MDX and json-render. */
export const demoChartTree: ChartcnJsonNode = {
  type: "chart-line-multi",
  props: {},
}

export function JsonRenderChartDemo({
  tree = demoChartTree,
}: {
  tree?: ChartcnJsonNode
}) {
  return (
    <div className="flex flex-col gap-4">
      <pre className="overflow-x-auto rounded-lg border bg-muted/40 p-3 text-xs">
        {JSON.stringify(tree, null, 2)}
      </pre>
      {renderChartcnNode(tree)}
    </div>
  )
}

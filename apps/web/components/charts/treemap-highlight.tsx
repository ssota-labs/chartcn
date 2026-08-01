"use client"

import * as React from "react"
import { Treemap } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { TreemapTile } from "./treemap-tile"

const leaves = [
  { name: "Alpha", size: 900 },
  { name: "Beta", size: 700 },
  { name: "Gamma", size: 520 },
  { name: "Delta", size: 410 },
  { name: "Epsilon", size: 300 },
]

const chartData = [{ name: "root", children: leaves }]

const chartConfig = {
  size: { label: "Size", color: "var(--chart-1)" },
} satisfies ChartConfig

/**
 * Declared outside the chart component: defining it inline would create a new
 * component type on every render, which remounts each tile and restarts its
 * entrance animation.
 */
function HighlightContent({
  active,
  onActivate,
  ...props
}: {
  x?: number
  y?: number
  width?: number
  height?: number
  name?: string
  size?: number
  depth?: number
  index?: number
  active?: string | null
  onActivate?: (name: string | null) => void
}) {
  const name = props.name
  return (
    <TreemapTile
      {...props}
      fill="var(--chart-1)"
      value={props.size?.toLocaleString()}
      seam="var(--card)"
      dimmed={active != null && active !== name}
      onMouseEnter={() => onActivate?.(name ?? null)}
      onMouseLeave={() => onActivate?.(null)}
    />
  )
}

export function ChartTreemapHighlight() {
  const [active, setActive] = React.useState<string | null>(null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Treemap — Highlight</CardTitle>
        <CardDescription>Hover highlights one cell</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[260px] w-full aspect-auto">
          <Treemap data={chartData} dataKey="size" nameKey="name" content={<HighlightContent active={active} onActivate={setActive} />} isAnimationActive={false} />
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

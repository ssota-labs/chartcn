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

export function ChartTreemapHighlight() {
  const [active, setActive] = React.useState<string | null>(null)

  function Content(props: {
    x?: number
    y?: number
    width?: number
    height?: number
    name?: string
    depth?: number
  }) {
    const { x = 0, y = 0, width = 0, height = 0, name, depth = 0 } = props
    if (depth < 1 || width < 2 || height < 2) return null
    const dimmed = active != null && active !== name
    return (
      <g
        onMouseEnter={() => setActive(name ?? null)}
        onMouseLeave={() => setActive(null)}
        style={{ cursor: "pointer" }}
      >
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill="var(--chart-1)"
          fillOpacity={dimmed ? 0.25 : 0.85}
          stroke="var(--background)"
          strokeWidth={2}
        />
        {width > 40 && height > 20 ? (
          <text x={x + 8} y={y + 18} className="fill-foreground text-[11px]">
            {name}
          </text>
        ) : null}
      </g>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Treemap — Highlight</CardTitle>
        <CardDescription>Hover highlights one cell</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[260px] w-full aspect-auto">
          <Treemap data={chartData} dataKey="size" nameKey="name" content={<Content />} isAnimationActive={false} />
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

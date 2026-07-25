"use client"

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

const chartData = [
  {
    name: "root",
    children: [
      {
        name: "Americas",
        children: [
          { name: "US", size: 900 },
          { name: "Canada", size: 320 },
          { name: "Brazil", size: 410 },
        ],
      },
      {
        name: "EMEA",
        children: [
          { name: "UK", size: 500 },
          { name: "Germany", size: 480 },
          { name: "France", size: 360 },
        ],
      },
      {
        name: "APAC",
        children: [
          { name: "Japan", size: 420 },
          { name: "Australia", size: 280 },
          { name: "India", size: 390 },
        ],
      },
    ],
  },
]

const chartConfig = {
  size: { label: "Size", color: "var(--chart-1)" },
} satisfies ChartConfig

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]

function GroupContent(props: {
  x?: number
  y?: number
  width?: number
  height?: number
  name?: string
  depth?: number
  index?: number
}) {
  const { x = 0, y = 0, width = 0, height = 0, name, depth = 0, index = 0 } = props
  if (width < 2 || height < 2) return null
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={depth < 2 ? "transparent" : COLORS[index % COLORS.length]}
        stroke="var(--background)"
        strokeWidth={2}
      />
      {depth > 1 && width > 40 && height > 20 ? (
        <text x={x + 6} y={y + 16} className="fill-foreground text-[11px]">
          {name}
        </text>
      ) : null}
    </g>
  )
}

export function ChartTreemapGrouped() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Treemap — Grouped</CardTitle>
        <CardDescription>Nested regions and countries</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[280px] w-full aspect-auto">
          <Treemap
            data={chartData}
            dataKey="size"
            nameKey="name"
            content={<GroupContent />}
            isAnimationActive={false}
          />
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

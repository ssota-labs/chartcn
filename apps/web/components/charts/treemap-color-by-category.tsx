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
import { TreemapTile } from "./treemap-tile"

const chartData = [
  {
    name: "root",
    children: [
      { name: "Cloud", size: 1100, fill: "var(--chart-1)" },
      { name: "Security", size: 720, fill: "var(--chart-2)" },
      { name: "Analytics", size: 540, fill: "var(--chart-3)" },
      { name: "Support", size: 360, fill: "var(--chart-4)" },
      { name: "Other", size: 220, fill: "var(--chart-5)" },
    ],
  },
]

const chartConfig = {
  size: { label: "Size", color: "var(--chart-1)" },
} satisfies ChartConfig

function ColorContent(props: {
  x?: number
  y?: number
  width?: number
  height?: number
  name?: string
  size?: number
  fill?: string
  depth?: number
  index?: number
}) {
  return (
    <TreemapTile
      {...props}
      fill={props.fill ?? "var(--chart-1)"}
      value={props.size?.toLocaleString()}
      seam="var(--card)"
    />
  )
}

export function ChartTreemapColorByCategory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Treemap — Color by Category</CardTitle>
        <CardDescription>Each category uses a chart token</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[260px] w-full aspect-auto">
          <Treemap data={chartData} dataKey="size" nameKey="name" content={<ColorContent />} isAnimationActive={false} />
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

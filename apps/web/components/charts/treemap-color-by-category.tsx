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
  fill?: string
  depth?: number
}) {
  const { x = 0, y = 0, width = 0, height = 0, name, fill, depth = 0 } = props
  if (depth < 1 || width < 2 || height < 2) return null
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill ?? "var(--chart-1)"} stroke="var(--background)" strokeWidth={2} />
      {width > 48 && height > 22 ? (
        <text x={x + 8} y={y + 18} className="fill-foreground text-[11px] font-medium">
          {name}
        </text>
      ) : null}
    </g>
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

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

const ascending = [
  { name: "Tiny", size: 120 },
  { name: "Small", size: 240 },
  { name: "Medium", size: 480 },
  { name: "Large", size: 720 },
  { name: "Huge", size: 1100 },
]

const chartData = [{ name: "root", children: [...ascending].reverse() }]

const chartConfig = {
  size: { label: "Size", color: "var(--chart-2)" },
} satisfies ChartConfig

function Content(props: {
  x?: number
  y?: number
  width?: number
  height?: number
  name?: string
  depth?: number
  index?: number
}) {
  const { x = 0, y = 0, width = 0, height = 0, name, depth = 0 } = props
  if (depth < 1 || width < 2 || height < 2) return null
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill="var(--chart-2)" fillOpacity={0.75} stroke="var(--background)" strokeWidth={2} />
      {width > 40 && height > 20 ? (
        <text x={x + 8} y={y + 18} className="fill-foreground text-[11px]">
          {name}
        </text>
      ) : null}
    </g>
  )
}

export function ChartTreemapReverse() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Treemap — Reverse</CardTitle>
        <CardDescription>Children ordered largest → smallest</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[260px] w-full aspect-auto">
          <Treemap data={chartData} dataKey="size" nameKey="name" content={<Content />} isAnimationActive={false} />
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

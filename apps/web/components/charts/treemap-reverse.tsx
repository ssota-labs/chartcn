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
  size?: number
  depth?: number
  index?: number
}) {
  return (
    <TreemapTile
      {...props}
      fill="var(--chart-2)"
      value={props.size?.toLocaleString()}
      seam="var(--card)"
    />
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

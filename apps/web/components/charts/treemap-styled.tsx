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
      { name: "Design", size: 640 },
      { name: "Engineering", size: 980 },
      { name: "Marketing", size: 420 },
      { name: "Sales", size: 560 },
      { name: "Ops", size: 300 },
    ],
  },
]

const chartConfig = {
  size: { label: "Headcount", color: "var(--chart-3)" },
} satisfies ChartConfig

const GAP = 4
const RADIUS = 8

function StyledContent(props: {
  x?: number
  y?: number
  width?: number
  height?: number
  name?: string
  size?: number
  depth?: number
  index?: number
}) {
  const colors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ]
  const index = props.index ?? 0
  return (
    <TreemapTile
      {...props}
      fill={colors[index % colors.length]}
      value={props.size?.toLocaleString()}
      gap={GAP}
      radius={RADIUS}
    />
  )
}

export function ChartTreemapStyled() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Treemap — Styled</CardTitle>
        <CardDescription>Gap + rounded corners</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[260px] w-full aspect-auto">
          <Treemap data={chartData} dataKey="size" nameKey="name" content={<StyledContent />} isAnimationActive={false} />
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

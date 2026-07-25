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
  depth?: number
  index?: number
}) {
  const { x = 0, y = 0, width = 0, height = 0, name, depth = 0, index = 0 } = props
  if (depth < 1 || width <= GAP * 2 || height <= GAP * 2) return null
  const colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]
  return (
    <g>
      <rect
        x={x + GAP}
        y={y + GAP}
        width={width - GAP * 2}
        height={height - GAP * 2}
        rx={RADIUS}
        ry={RADIUS}
        fill={colors[index % colors.length]}
        fillOpacity={0.85}
      />
      {width > 56 && height > 32 ? (
        <text x={x + GAP + 10} y={y + GAP + 20} className="fill-foreground text-[11px] font-medium">
          {name}
        </text>
      ) : null}
    </g>
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

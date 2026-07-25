"use client"

import { Layer, Rectangle, Sankey, Tooltip } from "recharts"

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

const data = {
  nodes: [
    { name: "Organic" },
    { name: "Paid" },
    { name: "Referral" },
    { name: "Landing" },
    { name: "Product" },
    { name: "Checkout" },
    { name: "Purchase" },
    { name: "Bounce" },
  ],
  links: [
    { source: 0, target: 3, value: 520 },
    { source: 1, target: 3, value: 340 },
    { source: 2, target: 3, value: 180 },
    { source: 3, target: 4, value: 610 },
    { source: 3, target: 7, value: 430 },
    { source: 4, target: 5, value: 390 },
    { source: 4, target: 7, value: 220 },
    { source: 5, target: 6, value: 260 },
    { source: 5, target: 7, value: 130 },
  ],
}

const chartConfig = {
  value: { label: "Sessions", color: "var(--chart-2)" },
} satisfies ChartConfig

function Node(props: {
  x?: number
  y?: number
  width?: number
  height?: number
  payload?: { name?: string }
}) {
  const { x = 0, y = 0, width = 0, height = 0, payload } = props
  return (
    <Layer>
      <Rectangle x={x} y={y} width={width} height={height} fill="var(--chart-2)" fillOpacity={0.9} />
      <text x={x + width + 6} y={y + height / 2} dominantBaseline="middle" className="fill-foreground text-[11px]">
        {payload?.name}
      </text>
    </Layer>
  )
}

export function ChartSankeyTrafficFlow() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sankey — Traffic Flow</CardTitle>
        <CardDescription>Acquisition → landing → purchase</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full aspect-auto">
          <Sankey
            data={data}
            nodePadding={18}
            nodeWidth={14}
            margin={{ left: 8, right: 80, top: 8, bottom: 8 }}
            node={<Node />}
            link={{ stroke: "var(--chart-2)", strokeOpacity: 0.28 }}
          >
            <Tooltip />
          </Sankey>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

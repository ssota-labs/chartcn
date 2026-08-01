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
    name: "Product",
    children: [
      { name: "Electronics", size: 1200, fill: "var(--chart-1)" },
      { name: "Apparel", size: 800, fill: "var(--chart-2)" },
      { name: "Home", size: 600, fill: "var(--chart-3)" },
      { name: "Beauty", size: 400, fill: "var(--chart-4)" },
    ],
  },
]

const chartConfig = {
  size: { label: "Size", color: "var(--chart-1)" },
} satisfies ChartConfig

function BasicContent(props: {
  x?: number
  y?: number
  width?: number
  height?: number
  name?: string
  size?: number
  fill?: string
  index?: number
  children?: readonly unknown[] | null
}) {
  return (
    <TreemapTile
      {...props}
      value={props.size?.toLocaleString()}
      seam="var(--card)"
    />
  )
}

export function ChartTreemapBasic() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Treemap — Basic</CardTitle>
        <CardDescription>Category size by rectangle area</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="h-[260px] w-full aspect-auto"
        >
          <Treemap
            data={chartData}
            dataKey="size"
            nameKey="name"
            // Recharts' own tween animates width/height, which lays out and
            // paints every frame. The node does its own transform/opacity one.
            isAnimationActive={false}
            content={<BasicContent />}
          >
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          </Treemap>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

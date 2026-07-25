"use client"

import * as React from "react"
import { CartesianGrid, Cell, Scatter, ScatterChart, XAxis, YAxis, ZAxis } from "recharts"

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
  { x: 10, y: 30 },
  { x: 25, y: 55 },
  { x: 40, y: 35 },
  { x: 55, y: 72 },
  { x: 70, y: 48 },
  { x: 85, y: 90 },
  { x: 32, y: 78 },
  { x: 62, y: 42 },
]

const chartConfig = {
  points: { label: "Points", color: "var(--chart-1)" },
} satisfies ChartConfig

export function ChartScatterHighlight() {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scatter Chart — Highlight</CardTitle>
        <CardDescription>Hover dims non-active points</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[240px] w-full">
          <ScatterChart
            accessibilityLayer
            margin={{ left: 12, right: 12 }}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <CartesianGrid />
            <XAxis type="number" dataKey="x" tickLine={false} axisLine={false} />
            <YAxis type="number" dataKey="y" tickLine={false} axisLine={false} />
            <ZAxis range={[80, 80]} />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Scatter data={chartData} name="points">
              {chartData.map((_, index) => (
                <Cell
                  key={index}
                  fill="var(--color-points)"
                  fillOpacity={activeIndex == null || activeIndex === index ? 1 : 0.25}
                  onMouseEnter={() => setActiveIndex(index)}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

"use client"

import { CartesianGrid, Scatter, ScatterChart, XAxis, YAxis, ZAxis } from "recharts"

import { ScatterDot } from "./scatter-dot"

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
  { x: 25, y: 50 },
  { x: 40, y: 35 },
  { x: 55, y: 70 },
  { x: 70, y: 55 },
  { x: 85, y: 90 },
  { x: 35, y: 80 },
  { x: 60, y: 40 },
]

const chartConfig = {
  points: { label: "Points", color: "var(--chart-1)" },
} satisfies ChartConfig

export function ChartScatterBasic() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scatter Chart — Basic</CardTitle>
        <CardDescription>X / Y correlation</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[240px] w-full">
          <ScatterChart accessibilityLayer margin={{ left: 12, right: 12, top: 8, bottom: 8 }}>
            <CartesianGrid />
            <XAxis type="number" dataKey="x" name="X" tickLine={false} axisLine={false} />
            <YAxis type="number" dataKey="y" name="Y" tickLine={false} axisLine={false} />
            <ZAxis range={[80, 80]} />
            <ChartTooltip cursor={{ strokeDasharray: "3 3" }} content={<ChartTooltipContent hideLabel />} />
            <Scatter
              data={chartData}
              fill="var(--color-points)"
              name="points"
              shape={<ScatterDot />}
              activeShape={<ScatterDot active />}
            />
          </ScatterChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

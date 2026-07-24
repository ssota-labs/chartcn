"use client"

import { CartesianGrid, Scatter, ScatterChart, XAxis, YAxis, ZAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const groupA = [
  { x: 12, y: 40 },
  { x: 28, y: 55 },
  { x: 45, y: 48 },
  { x: 60, y: 70 },
]
const groupB = [
  { x: 18, y: 22 },
  { x: 35, y: 30 },
  { x: 52, y: 38 },
  { x: 75, y: 50 },
]

const chartConfig = {
  groupA: { label: "Group A", color: "var(--chart-1)" },
  groupB: { label: "Group B", color: "var(--chart-2)" },
} satisfies ChartConfig

export function ChartScatterMulti() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scatter Chart — Multi-series</CardTitle>
        <CardDescription>Two cohorts compared</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[240px] w-full">
          <ScatterChart accessibilityLayer margin={{ left: 12, right: 12 }}>
            <CartesianGrid />
            <XAxis type="number" dataKey="x" tickLine={false} axisLine={false} />
            <YAxis type="number" dataKey="y" tickLine={false} axisLine={false} />
            <ZAxis range={[90, 90]} />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Scatter name="groupA" data={groupA} fill="var(--color-groupA)" />
            <Scatter name="groupB" data={groupB} fill="var(--color-groupB)" />
          </ScatterChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

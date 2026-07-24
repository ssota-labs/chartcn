"use client"

import { CartesianGrid, Line, ComposedChart, Scatter, XAxis, YAxis, ZAxis } from "recharts"

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

const chartData = [
  { x: 10, y: 22 },
  { x: 20, y: 30 },
  { x: 30, y: 38 },
  { x: 40, y: 55 },
  { x: 50, y: 52 },
  { x: 60, y: 70 },
  { x: 70, y: 68 },
  { x: 80, y: 88 },
]

// simple linear regression
const n = chartData.length
const sumX = chartData.reduce((s, d) => s + d.x, 0)
const sumY = chartData.reduce((s, d) => s + d.y, 0)
const sumXY = chartData.reduce((s, d) => s + d.x * d.y, 0)
const sumXX = chartData.reduce((s, d) => s + d.x * d.x, 0)
const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
const intercept = (sumY - slope * sumX) / n
const trendData = [
  { x: 10, trend: intercept + slope * 10 },
  { x: 80, trend: intercept + slope * 80 },
]

const chartConfig = {
  points: { label: "Points", color: "var(--chart-1)" },
  trend: { label: "Trend", color: "var(--chart-2)" },
} satisfies ChartConfig

export function ChartScatterTrend() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scatter Chart — Trend Line</CardTitle>
        <CardDescription>OLS trend overlay</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[260px] w-full">
          <ComposedChart accessibilityLayer margin={{ left: 12, right: 12 }}>
            <CartesianGrid />
            <XAxis type="number" dataKey="x" tickLine={false} axisLine={false} domain={[0, 90]} />
            <YAxis type="number" tickLine={false} axisLine={false} domain={[0, 100]} />
            <ZAxis range={[90, 90]} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Scatter name="points" data={chartData} fill="var(--color-points)" dataKey="y" />
            <Line
              name="trend"
              data={trendData}
              dataKey="trend"
              type="linear"
              stroke="var(--color-trend)"
              strokeWidth={2}
              dot={false}
              legendType="line"
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

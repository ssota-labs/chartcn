"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

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

/** Two-period slope: each series connects start → end. */
const chartData = [
  { period: "2024", alpha: 42, beta: 65, gamma: 28, delta: 55 },
  { period: "2025", alpha: 58, beta: 48, gamma: 51, delta: 62 },
]

const chartConfig = {
  alpha: { label: "Alpha", color: "var(--chart-1)" },
  beta: { label: "Beta", color: "var(--chart-2)" },
  gamma: { label: "Gamma", color: "var(--chart-3)" },
  delta: { label: "Delta", color: "var(--chart-4)" },
} satisfies ChartConfig

export function ChartSlope() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Slope Chart</CardTitle>
        <CardDescription>Segment NPS — year over year</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[240px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {(Object.keys(chartConfig) as (keyof typeof chartConfig)[]).map(
              (key) => (
                <Line
                  key={key}
                  type="linear"
                  dataKey={key}
                  stroke={`var(--color-${key})`}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              )
            )}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

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

const chartData = [
  { day: "Mon", thisWeek: 420, lastWeek: 390 },
  { day: "Tue", thisWeek: 510, lastWeek: 450 },
  { day: "Wed", thisWeek: 470, lastWeek: 480 },
  { day: "Thu", thisWeek: 580, lastWeek: 520 },
  { day: "Fri", thisWeek: 640, lastWeek: 560 },
  { day: "Sat", thisWeek: 390, lastWeek: 410 },
  { day: "Sun", thisWeek: 360, lastWeek: 340 },
]

const chartConfig = {
  thisWeek: { label: "This week", color: "var(--chart-1)" },
  lastWeek: { label: "Last week", color: "var(--chart-2)" },
} satisfies ChartConfig

export function ChartPeriodComparison() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Period Comparison</CardTitle>
        <CardDescription>This week vs last week sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[220px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              dataKey="thisWeek"
              type="monotone"
              stroke="var(--color-thisWeek)"
              strokeWidth={2}
              dot
            />
            <Line
              dataKey="lastWeek"
              type="monotone"
              stroke="var(--color-lastWeek)"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

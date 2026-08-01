"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
  { day: "Mon", range: [18, 42] as [number, number] },
  { day: "Tue", range: [22, 48] as [number, number] },
  { day: "Wed", range: [16, 39] as [number, number] },
  { day: "Thu", range: [25, 52] as [number, number] },
  { day: "Fri", range: [28, 55] as [number, number] },
  { day: "Sat", range: [20, 44] as [number, number] },
  { day: "Sun", range: [14, 36] as [number, number] },
]

const chartConfig = {
  range: {
    label: "Temp °C",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export function ChartBarRange() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart — Range</CardTitle>
        <CardDescription>Low–high interval bars via `[min, max]`</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[240px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis hide domain={[0, 60]} />
            <ChartTooltip
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="range" fill="var(--color-range)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

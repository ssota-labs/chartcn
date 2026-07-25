"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

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
  { month: "January", revenue: 186 },
  { month: "February", revenue: 305 },
  { month: "March", revenue: 237 },
  { month: "April", revenue: 203 },
  { month: "May", revenue: 209 },
  { month: "June", revenue: 264 },
]

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
} satisfies ChartConfig

export function ChartLineDots() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Line Chart — Dots / ActiveDot</CardTitle>
        <CardDescription>Visible dots with enlarged activeDot</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[220px] w-full">
          <LineChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => v.slice(0, 3)} />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Line
              dataKey="revenue"
              type="monotone"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              dot={{ r: 4, fill: "var(--color-revenue)" }}
              activeDot={{ r: 7, strokeWidth: 2, stroke: "var(--background)" }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

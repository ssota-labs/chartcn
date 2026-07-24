"use client"

import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts"

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
  { month: "January", revenue: 1860, margin: 22 },
  { month: "February", revenue: 3050, margin: 28 },
  { month: "March", revenue: 2370, margin: 24 },
  { month: "April", revenue: 1730, margin: 19 },
  { month: "May", revenue: 2090, margin: 26 },
  { month: "June", revenue: 2740, margin: 31 },
]

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  margin: { label: "Margin %", color: "var(--chart-2)" },
} satisfies ChartConfig

export function ChartBarDualAxis() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart — Dual Axis</CardTitle>
        <CardDescription>Revenue bars + margin line</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[240px] w-full">
          <ComposedChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => v.slice(0, 3)} />
            <YAxis yAxisId="left" tickLine={false} axisLine={false} />
            <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar yAxisId="left" dataKey="revenue" fill="var(--color-revenue)" radius={4} />
            <Line yAxisId="right" dataKey="margin" type="monotone" stroke="var(--color-margin)" strokeWidth={2} dot />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

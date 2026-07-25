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
  { month: "January", users: 1860, revenue: 12.4 },
  { month: "February", users: 3050, revenue: 18.1 },
  { month: "March", users: 2370, revenue: 15.2 },
  { month: "April", users: 1730, revenue: 11.8 },
  { month: "May", users: 2090, revenue: 14.6 },
  { month: "June", users: 2740, revenue: 19.3 },
]

const chartConfig = {
  users: { label: "Users", color: "var(--chart-1)" },
  revenue: { label: "Revenue ($k)", color: "var(--chart-2)" },
} satisfies ChartConfig

export function ChartLineDualAxis() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Line Chart — Dual Axis</CardTitle>
        <CardDescription>Users vs revenue</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[240px] w-full">
          <LineChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => v.slice(0, 3)} />
            <YAxis yAxisId="left" tickLine={false} axisLine={false} />
            <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line yAxisId="left" dataKey="users" type="monotone" stroke="var(--color-users)" strokeWidth={2} dot={false} />
            <Line yAxisId="right" dataKey="revenue" type="monotone" stroke="var(--color-revenue)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

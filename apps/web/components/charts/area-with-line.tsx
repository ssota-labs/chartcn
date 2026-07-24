"use client"

import { Area, CartesianGrid, ComposedChart, Line, XAxis } from "recharts"

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
  { month: "January", visitors: 186, trend: 160 },
  { month: "February", visitors: 305, trend: 210 },
  { month: "March", visitors: 237, trend: 230 },
  { month: "April", visitors: 173, trend: 220 },
  { month: "May", visitors: 209, trend: 240 },
  { month: "June", visitors: 274, trend: 260 },
]

const chartConfig = {
  visitors: { label: "Visitors", color: "var(--chart-1)" },
  trend: { label: "Trend", color: "var(--chart-2)" },
} satisfies ChartConfig

export function ChartAreaWithLine() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Area Chart — With Line Overlay</CardTitle>
        <CardDescription>Area fill with trend line</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[220px] w-full">
          <ComposedChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => v.slice(0, 3)} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area dataKey="visitors" type="natural" fill="var(--color-visitors)" fillOpacity={0.35} stroke="var(--color-visitors)" />
            <Line dataKey="trend" type="monotone" stroke="var(--color-trend)" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

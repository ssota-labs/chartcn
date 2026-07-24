"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
  { month: "January", sessions: 1860, conversion: 2.4 },
  { month: "February", sessions: 3050, conversion: 3.1 },
  { month: "March", sessions: 2370, conversion: 2.8 },
  { month: "April", sessions: 1730, conversion: 2.1 },
  { month: "May", sessions: 2090, conversion: 2.6 },
  { month: "June", sessions: 2740, conversion: 3.4 },
]

const chartConfig = {
  sessions: { label: "Sessions", color: "var(--chart-1)" },
  conversion: { label: "Conversion %", color: "var(--chart-2)" },
} satisfies ChartConfig

export function ChartAreaDualAxis() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Area Chart — Dual Axis</CardTitle>
        <CardDescription>Sessions vs conversion rate</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[240px] w-full">
          <AreaChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => v.slice(0, 3)} />
            <YAxis yAxisId="left" tickLine={false} axisLine={false} />
            <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area yAxisId="left" dataKey="sessions" type="natural" fill="var(--color-sessions)" fillOpacity={0.35} stroke="var(--color-sessions)" />
            <Area yAxisId="right" dataKey="conversion" type="natural" fill="var(--color-conversion)" fillOpacity={0.2} stroke="var(--color-conversion)" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

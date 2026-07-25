"use client"

import { Brush, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

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

const chartData = Array.from({ length: 24 }, (_, i) => ({
  month: `M${i + 1}`,
  revenue: Math.round(150 + Math.sin(i / 2) * 80 + i * 4 + (i % 3) * 12),
}))

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
} satisfies ChartConfig

export function ChartLineBrush() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Line Chart — Brush / Zoom</CardTitle>
        <CardDescription>Drag the brush to zoom a range</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[280px] w-full">
          <LineChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line dataKey="revenue" type="monotone" stroke="var(--color-revenue)" strokeWidth={2} dot={false} />
            <Brush dataKey="month" height={28} stroke="var(--color-revenue)" travellerWidth={8} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

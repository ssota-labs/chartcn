"use client"

import { Area, Bar, CartesianGrid, ComposedChart, XAxis } from "recharts"

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
  { month: "January", sales: 186, forecast: 160 },
  { month: "February", sales: 305, forecast: 220 },
  { month: "March", sales: 237, forecast: 250 },
  { month: "April", sales: 173, forecast: 210 },
  { month: "May", sales: 209, forecast: 230 },
  { month: "June", sales: 274, forecast: 260 },
]

const chartConfig = {
  forecast: { label: "Forecast", color: "var(--chart-2)" },
  sales: { label: "Sales", color: "var(--chart-1)" },
} satisfies ChartConfig

export function ChartBarAreaCombo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart — Area + Bar Combo</CardTitle>
        <CardDescription>Forecast area under sales bars</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[220px] w-full">
          <ComposedChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => v.slice(0, 3)} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area dataKey="forecast" type="monotone" fill="var(--color-forecast)" fillOpacity={0.25} stroke="var(--color-forecast)" />
            <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

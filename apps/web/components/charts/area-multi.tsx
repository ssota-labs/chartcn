"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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
  { month: "January", desktop: 186, mobile: 80, tablet: 45 },
  { month: "February", desktop: 305, mobile: 200, tablet: 90 },
  { month: "March", desktop: 237, mobile: 120, tablet: 70 },
  { month: "April", desktop: 73, mobile: 190, tablet: 55 },
  { month: "May", desktop: 209, mobile: 130, tablet: 85 },
  { month: "June", desktop: 214, mobile: 140, tablet: 95 },
]

const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
  tablet: { label: "Tablet", color: "var(--chart-3)" },
} satisfies ChartConfig

export function ChartAreaMulti() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Area Chart — Multi-series</CardTitle>
        <CardDescription>Overlapping device sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[220px] w-full">
          <AreaChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => v.slice(0, 3)} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area dataKey="desktop" type="natural" fill="var(--color-desktop)" fillOpacity={0.25} stroke="var(--color-desktop)" />
            <Area dataKey="mobile" type="natural" fill="var(--color-mobile)" fillOpacity={0.25} stroke="var(--color-mobile)" />
            <Area dataKey="tablet" type="natural" fill="var(--color-tablet)" fillOpacity={0.25} stroke="var(--color-tablet)" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

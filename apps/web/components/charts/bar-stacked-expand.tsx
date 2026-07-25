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

export function ChartBarStackedExpand() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart — Stacked Expand (100%)</CardTitle>
        <CardDescription>Device share by month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[220px] w-full">
          <BarChart accessibilityLayer data={chartData} stackOffset="expand">
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => v.slice(0, 3)} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `${Math.round(v * 100)}%`} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="desktop" stackId="a" fill="var(--color-desktop)" />
            <Bar dataKey="mobile" stackId="a" fill="var(--color-mobile)" />
            <Bar dataKey="tablet" stackId="a" fill="var(--color-tablet)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

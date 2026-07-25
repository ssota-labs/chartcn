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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]

const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
} satisfies ChartConfig

const curves = [
  { type: "linear" as const, title: "Linear" },
  { type: "monotone" as const, title: "Monotone" },
  { type: "step" as const, title: "Step" },
]

export function ChartAreaCurve() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {curves.map((curve) => (
        <Card key={curve.type}>
          <CardHeader>
            <CardTitle>Area — {curve.title}</CardTitle>
            <CardDescription>type=&quot;{curve.type}&quot;</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[160px] w-full">
              <AreaChart accessibilityLayer data={chartData} margin={{ left: 8, right: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => v.slice(0, 3)} />
                <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                <Area dataKey="desktop" type={curve.type} fill="var(--color-desktop)" fillOpacity={0.35} stroke="var(--color-desktop)" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

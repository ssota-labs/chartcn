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
  { month: "April", revenue: 73 },
  { month: "May", revenue: 209 },
  { month: "June", revenue: 264 },
]

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
} satisfies ChartConfig

const curves = [
  { type: "linear" as const, title: "Linear" },
  { type: "monotone" as const, title: "Monotone" },
  { type: "stepAfter" as const, title: "Step" },
]

export function ChartLineCurve() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {curves.map((curve) => (
        <Card key={curve.type}>
          <CardHeader>
            <CardTitle>Line — {curve.title}</CardTitle>
            <CardDescription>type=&quot;{curve.type}&quot;</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[160px] w-full">
              <LineChart accessibilityLayer data={chartData} margin={{ left: 8, right: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => v.slice(0, 3)} />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Line dataKey="revenue" type={curve.type} stroke="var(--color-revenue)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

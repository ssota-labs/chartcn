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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { month: "January", rank: 4 },
  { month: "February", rank: 2 },
  { month: "March", rank: 3 },
  { month: "April", rank: 5 },
  { month: "May", rank: 1 },
  { month: "June", rank: 2 },
]

const chartConfig = {
  rank: { label: "Rank", color: "var(--chart-1)" },
} satisfies ChartConfig

export function ChartLineInverted() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Line Chart — Inverted Axis</CardTitle>
        <CardDescription>Lower rank is better (Y reversed)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[220px] w-full">
          <LineChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => v.slice(0, 3)} />
            <YAxis reversed domain={[1, 5]} tickLine={false} axisLine={false} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line dataKey="rank" type="monotone" stroke="var(--color-rank)" strokeWidth={2} dot />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

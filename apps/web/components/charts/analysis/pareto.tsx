"use client"

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts"

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

const raw = [
  { cause: "Timeouts", count: 120 },
  { cause: "Auth", count: 85 },
  { cause: "Validation", count: 60 },
  { cause: "Rate limit", count: 35 },
  { cause: "Network", count: 25 },
  { cause: "Other", count: 15 },
].sort((a, b) => b.count - a.count)

const total = raw.reduce((s, r) => s + r.count, 0)
let cumulative = 0
const chartData = raw.map((r) => {
  cumulative += r.count
  return {
    ...r,
    cumulativePct: Math.round((cumulative / total) * 1000) / 10,
  }
})

const chartConfig = {
  count: { label: "Count", color: "var(--chart-1)" },
  cumulativePct: { label: "Cumulative %", color: "var(--chart-2)" },
} satisfies ChartConfig

export function ChartPareto() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pareto</CardTitle>
        <CardDescription>Error causes — bar + cumulative line</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[260px] w-full">
          <ComposedChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="cause"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v) => `${v}%`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              yAxisId="left"
              dataKey="count"
              fill="var(--color-count)"
              radius={4}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cumulativePct"
              stroke="var(--color-cumulativePct)"
              strokeWidth={2}
              dot
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

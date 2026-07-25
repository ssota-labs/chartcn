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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { day: "D0", product: 100, growth: 100, enterprise: 100 },
  { day: "D1", product: 48, growth: 55, enterprise: 62 },
  { day: "D3", product: 36, growth: 42, enterprise: 51 },
  { day: "D7", product: 28, growth: 34, enterprise: 44 },
  { day: "D14", product: 22, growth: 27, enterprise: 38 },
  { day: "D30", product: 18, growth: 21, enterprise: 33 },
]

const chartConfig = {
  product: { label: "Product", color: "var(--chart-1)" },
  growth: { label: "Growth", color: "var(--chart-2)" },
  enterprise: { label: "Enterprise", color: "var(--chart-3)" },
} satisfies ChartConfig

export function ChartRetentionCurve() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Retention Curve</CardTitle>
        <CardDescription>D1 / D7 / D30 retention by plan</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[220px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => `${value}%`}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              dataKey="product"
              type="monotone"
              stroke="var(--color-product)"
              strokeWidth={2}
              dot
            />
            <Line
              dataKey="growth"
              type="monotone"
              stroke="var(--color-growth)"
              strokeWidth={2}
              dot
            />
            <Line
              dataKey="enterprise"
              type="monotone"
              stroke="var(--color-enterprise)"
              strokeWidth={2}
              dot
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

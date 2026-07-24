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

const chartData = [
  { month: "Jan", conversions: 820, rate: 3.2 },
  { month: "Feb", conversions: 940, rate: 3.6 },
  { month: "Mar", conversions: 1010, rate: 3.9 },
  { month: "Apr", conversions: 880, rate: 3.4 },
  { month: "May", conversions: 1120, rate: 4.1 },
  { month: "Jun", conversions: 1260, rate: 4.5 },
]

const chartConfig = {
  conversions: { label: "Conversions", color: "var(--chart-1)" },
  rate: { label: "Conversion rate", color: "var(--chart-2)" },
} satisfies ChartConfig

export function ChartConversionDualAxis() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Dual-axis</CardTitle>
        <CardDescription>Volume (bars) + rate (line)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[220px] w-full">
          <ComposedChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
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
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              yAxisId="left"
              dataKey="conversions"
              fill="var(--color-conversions)"
              radius={3}
            />
            <Line
              yAxisId="right"
              dataKey="rate"
              type="monotone"
              stroke="var(--color-rate)"
              strokeWidth={2}
              dot
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

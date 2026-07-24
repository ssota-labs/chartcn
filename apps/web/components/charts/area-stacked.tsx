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
  { month: "January", organic: 186, paid: 80, referral: 45 },
  { month: "February", organic: 305, paid: 200, referral: 90 },
  { month: "March", organic: 237, paid: 120, referral: 70 },
  { month: "April", organic: 73, paid: 190, referral: 55 },
  { month: "May", organic: 209, paid: 130, referral: 85 },
  { month: "June", organic: 214, paid: 140, referral: 95 },
]

const chartConfig = {
  organic: { label: "Organic", color: "var(--chart-1)" },
  paid: { label: "Paid", color: "var(--chart-2)" },
  referral: { label: "Referral", color: "var(--chart-3)" },
} satisfies ChartConfig

export function ChartAreaStacked() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Area Chart — Stacked</CardTitle>
        <CardDescription>Traffic by acquisition channel</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[220px] w-full">
          <AreaChart
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
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              dataKey="referral"
              type="natural"
              fill="var(--color-referral)"
              fillOpacity={0.4}
              stroke="var(--color-referral)"
              stackId="a"
            />
            <Area
              dataKey="paid"
              type="natural"
              fill="var(--color-paid)"
              fillOpacity={0.4}
              stroke="var(--color-paid)"
              stackId="a"
            />
            <Area
              dataKey="organic"
              type="natural"
              fill="var(--color-organic)"
              fillOpacity={0.4}
              stroke="var(--color-organic)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

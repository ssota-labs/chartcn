"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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
  { quarter: "Q1", productA: 186, productB: 80, productC: 120 },
  { quarter: "Q2", productA: 305, productB: 200, productC: 160 },
  { quarter: "Q3", productA: 237, productB: 120, productC: 190 },
  { quarter: "Q4", productA: 273, productB: 190, productC: 140 },
]

const chartConfig = {
  productA: { label: "Product A", color: "var(--chart-1)" },
  productB: { label: "Product B", color: "var(--chart-2)" },
  productC: { label: "Product C", color: "var(--chart-3)" },
} satisfies ChartConfig

export function ChartBarGrouped() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart — Grouped</CardTitle>
        <CardDescription>Quarterly product revenue</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[220px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="quarter"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="productA" fill="var(--color-productA)" radius={3} />
            <Bar dataKey="productB" fill="var(--color-productB)" radius={3} />
            <Bar dataKey="productC" fill="var(--color-productC)" radius={3} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

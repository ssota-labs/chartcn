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
  { segment: "Free", conversion: 2.4, retention: 18, arpu: 0 },
  { segment: "Starter", conversion: 8.1, retention: 34, arpu: 12 },
  { segment: "Pro", conversion: 14.6, retention: 52, arpu: 49 },
  { segment: "Enterprise", conversion: 22.3, retention: 71, arpu: 220 },
]

const chartConfig = {
  conversion: { label: "Conversion %", color: "var(--chart-1)" },
  retention: { label: "D30 Retention %", color: "var(--chart-2)" },
  arpu: { label: "ARPU", color: "var(--chart-3)" },
} satisfies ChartConfig

export function ChartSegmentComparison() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Segment Comparison</CardTitle>
        <CardDescription>Plan cohorts side-by-side</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[220px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="segment"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="conversion"
              fill="var(--color-conversion)"
              radius={3}
            />
            <Bar
              dataKey="retention"
              fill="var(--color-retention)"
              radius={3}
            />
            <Bar dataKey="arpu" fill="var(--color-arpu)" radius={3} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

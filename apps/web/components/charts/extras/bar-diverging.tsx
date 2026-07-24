"use client"

import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, XAxis, YAxis } from "recharts"

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
  { region: "North", delta: 18 },
  { region: "East", delta: -12 },
  { region: "South", delta: 9 },
  { region: "West", delta: -7 },
  { region: "Central", delta: 14 },
  { region: "APAC", delta: -15 },
]

const chartConfig = {
  delta: { label: "Δ vs plan" },
  positive: { label: "Above plan", color: "var(--chart-2)" },
  negative: { label: "Below plan", color: "var(--chart-5)" },
} satisfies ChartConfig

export function ChartBarDiverging() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart — Diverging</CardTitle>
        <CardDescription>Positive / negative variance from plan</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[240px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="region"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis hide domain={[-20, 24]} />
            <ReferenceLine y={0} stroke="var(--border)" />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="delta" radius={4}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.region}
                  fill={
                    entry.delta >= 0
                      ? "var(--color-positive)"
                      : "var(--color-negative)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

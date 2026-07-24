"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, Cell, XAxis } from "recharts"

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
  { month: "January", sales: 186 },
  { month: "February", sales: 305 },
  { month: "March", sales: 237 },
  { month: "April", sales: 73 },
  { month: "May", sales: 209 },
  { month: "June", sales: 214 },
]

const chartConfig = {
  sales: { label: "Sales", color: "var(--chart-1)" },
} satisfies ChartConfig

export function ChartBarCursor() {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart — Cursor Band</CardTitle>
        <CardDescription>Cursor band + bar highlight</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[220px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            onMouseMove={(state) => {
              if (state?.activeTooltipIndex != null) setActiveIndex(Number(state.activeTooltipIndex))
            }}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => v.slice(0, 3)} />
            <ChartTooltip
              cursor={{ fill: "var(--muted)", opacity: 0.4 }}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="sales" radius={4}>
              {chartData.map((_, index) => (
                <Cell
                  key={index}
                  fill="var(--color-sales)"
                  fillOpacity={activeIndex == null || activeIndex === index ? 1 : 0.35}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

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
  { week: "W1", dau: 8200, wau: 21400, mau: 48200, stickiness: 38 },
  { week: "W2", dau: 8600, wau: 22100, mau: 49100, stickiness: 39 },
  { week: "W3", dau: 9100, wau: 22800, mau: 50300, stickiness: 40 },
  { week: "W4", dau: 9400, wau: 23600, mau: 51200, stickiness: 40 },
  { week: "W5", dau: 9800, wau: 24100, mau: 52400, stickiness: 41 },
  { week: "W6", dau: 10200, wau: 24900, mau: 53100, stickiness: 41 },
]

const chartConfig = {
  dau: { label: "DAU", color: "var(--chart-1)" },
  wau: { label: "WAU", color: "var(--chart-2)" },
  mau: { label: "MAU", color: "var(--chart-3)" },
  stickiness: { label: "DAU/MAU %", color: "var(--chart-4)" },
} satisfies ChartConfig

export function ChartStickiness() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stickiness</CardTitle>
        <CardDescription>DAU / WAU / MAU with DAU÷MAU ratio</CardDescription>
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
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              yAxisId="users"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              yAxisId="ratio"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              yAxisId="users"
              dataKey="dau"
              type="monotone"
              stroke="var(--color-dau)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="users"
              dataKey="wau"
              type="monotone"
              stroke="var(--color-wau)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="users"
              dataKey="mau"
              type="monotone"
              stroke="var(--color-mau)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="ratio"
              dataKey="stickiness"
              type="monotone"
              stroke="var(--color-stickiness)"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

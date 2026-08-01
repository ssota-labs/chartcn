"use client"

import { Brush, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

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
  { week: "W1", revenue: 120 },
  { week: "W2", revenue: 148 },
  { week: "W3", revenue: 132 },
  { week: "W4", revenue: 176 },
  { week: "W5", revenue: 164 },
  { week: "W6", revenue: 198 },
  { week: "W7", revenue: 210 },
  { week: "W8", revenue: 188 },
  { week: "W9", revenue: 224 },
  { week: "W10", revenue: 246 },
  { week: "W11", revenue: 238 },
  { week: "W12", revenue: 268 },
]

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartLineBrush() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Line Chart — Brush Zoom</CardTitle>
        <CardDescription>Pan and zoom weekly revenue with Brush</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[260px] w-full">
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
            <YAxis hide domain={["dataMin - 20", "dataMax + 20"]} />
            <ChartTooltip
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="revenue"
              type="monotone"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              dot={false}
            />
            <Brush
              dataKey="week"
              height={36}
              startIndex={3}
              endIndex={9}
              stroke="var(--color-revenue)"
              fill="var(--muted)"
              travellerWidth={8}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

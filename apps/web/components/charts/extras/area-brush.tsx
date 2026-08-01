"use client"

import { Area, AreaChart, Brush, CartesianGrid, XAxis, YAxis } from "recharts"

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
  { month: "Jan", visitors: 186 },
  { month: "Feb", visitors: 305 },
  { month: "Mar", visitors: 237 },
  { month: "Apr", visitors: 173 },
  { month: "May", visitors: 209 },
  { month: "Jun", visitors: 214 },
  { month: "Jul", visitors: 278 },
  { month: "Aug", visitors: 312 },
  { month: "Sep", visitors: 265 },
  { month: "Oct", visitors: 298 },
  { month: "Nov", visitors: 341 },
  { month: "Dec", visitors: 390 },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartAreaBrush() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Area Chart — Brush Zoom</CardTitle>
        <CardDescription>Drag the brush to zoom a time range</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[260px] w-full">
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
            />
            <YAxis hide domain={["dataMin - 20", "dataMax + 20"]} />
            <ChartTooltip
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="visitors"
              type="monotone"
              fill="var(--color-visitors)"
              fillOpacity={0.35}
              stroke="var(--color-visitors)"
            />
            <Brush
              dataKey="month"
              height={36}
              startIndex={2}
              endIndex={8}
              stroke="var(--color-visitors)"
              fill="var(--muted)"
              travellerWidth={8}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

"use client"

import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from "recharts"

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
  { month: "January", revenue: 186 },
  { month: "February", revenue: 305 },
  { month: "March", revenue: 237 },
  { month: "April", revenue: 203 },
  { month: "May", revenue: 209 },
  { month: "June", revenue: 264 },
]

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
} satisfies ChartConfig

export function ChartLineCrosshair() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Line Chart — Crosshair + Axis Labels</CardTitle>
        <CardDescription>Crosshair cursor with labeled axes</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[240px] w-full">
          <LineChart accessibilityLayer data={chartData} margin={{ left: 12, right: 24, top: 12 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => v.slice(0, 3)} label={{ value: "Month", position: "insideBottom", offset: -2 }} />
            <YAxis tickLine={false} axisLine={false} label={{ value: "Revenue", angle: -90, position: "insideLeft" }} />
            <ChartTooltip
              cursor={{ stroke: "var(--muted-foreground)", strokeWidth: 1, strokeDasharray: "4 4" }}
              content={<ChartTooltipContent />}
            />
            <Line dataKey="revenue" type="monotone" stroke="var(--color-revenue)" strokeWidth={2} dot>
              <LabelList dataKey="revenue" position="top" className="fill-muted-foreground" fontSize={10} />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

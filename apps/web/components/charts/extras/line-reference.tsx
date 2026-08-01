"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceDot,
  ReferenceLine,
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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { month: "Jan", sessions: 210 },
  { month: "Feb", sessions: 248 },
  { month: "Mar", sessions: 268 },
  { month: "Apr", sessions: 312 },
  { month: "May", sessions: 290 },
  { month: "Jun", sessions: 340 },
  { month: "Jul", sessions: 358 },
  { month: "Aug", sessions: 372 },
]

const chartConfig = {
  sessions: {
    label: "Sessions",
    color: "var(--chart-1)",
  },
  event: {
    label: "Launch window",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export function ChartLineReference() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Line Chart — Reference Highlights</CardTitle>
        <CardDescription>
          ReferenceArea + ReferenceDot + ReferenceLine for event callouts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[260px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12, top: 8 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis hide domain={[180, 400]} />
            <ChartTooltip
              content={<ChartTooltipContent indicator="line" />}
            />
            <ReferenceArea
              x1="Mar"
              x2="May"
              fill="var(--color-event)"
              fillOpacity={0.15}
              strokeOpacity={0}
            />
            <ReferenceLine
              y={300}
              stroke="var(--muted-foreground)"
              strokeDasharray="4 4"
              label={{
                value: "Target",
                position: "insideTopRight",
                fill: "var(--muted-foreground)",
                fontSize: 12,
              }}
            />
            <Line
              dataKey="sessions"
              type="monotone"
              stroke="var(--color-sessions)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <ReferenceDot
              x="Apr"
              y={312}
              r={6}
              fill="var(--color-event)"
              stroke="var(--background)"
              strokeWidth={2}
              label={{
                value: "Launch",
                position: "top",
                fill: "var(--foreground)",
                fontSize: 12,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

"use client"

import { Line, LineChart, YAxis } from "recharts"

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

const metrics = [
  {
    key: "dau",
    title: "DAU",
    value: "12.4k",
    delta: "+6.2%",
    description: "Daily active users",
    color: "var(--chart-1)",
    data: [
      { i: 1, v: 9800 },
      { i: 2, v: 10200 },
      { i: 3, v: 9900 },
      { i: 4, v: 10800 },
      { i: 5, v: 11200 },
      { i: 6, v: 11800 },
      { i: 7, v: 12400 },
    ],
  },
  {
    key: "signups",
    title: "Signups",
    value: "842",
    delta: "+12.1%",
    description: "New accounts this week",
    color: "var(--chart-2)",
    data: [
      { i: 1, v: 92 },
      { i: 2, v: 110 },
      { i: 3, v: 98 },
      { i: 4, v: 130 },
      { i: 5, v: 141 },
      { i: 6, v: 128 },
      { i: 7, v: 143 },
    ],
  },
  {
    key: "revenue",
    title: "Revenue",
    value: "$48.2k",
    delta: "+3.4%",
    description: "Net bookings",
    color: "var(--chart-3)",
    data: [
      { i: 1, v: 6100 },
      { i: 2, v: 6400 },
      { i: 3, v: 6200 },
      { i: 4, v: 6900 },
      { i: 5, v: 7100 },
      { i: 6, v: 7300 },
      { i: 7, v: 8200 },
    ],
  },
] as const

/**
 * A sparkline exists to show shape, so the axis fits the series rather than
 * anchoring at zero — the default domain flattened these into near-straight
 * lines. The padding keeps the extremes off the edges.
 */
function sparklineDomain(values: number[]): [number, number] {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const pad = (max - min) * 0.18 || Math.abs(max) * 0.05 || 1
  return [min - pad, max + pad]
}

const chartConfig = {
  v: { label: "Value", color: "var(--chart-1)" },
} satisfies ChartConfig

export function ChartMetricSparkline() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {metrics.map((metric) => (
        <Card key={metric.key}>
          <CardHeader className="pb-2">
            <CardDescription>{metric.description}</CardDescription>
            <CardTitle className="flex items-baseline gap-2 text-2xl">
              {metric.value}
              <span className="text-muted-foreground text-sm font-normal">
                {metric.delta}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                ...chartConfig,
                v: { label: metric.title, color: metric.color },
              }}
              className="aspect-auto h-[56px] w-full"
            >
              <LineChart
                accessibilityLayer
                data={[...metric.data]}
                margin={{ left: 0, right: 0, top: 4, bottom: 0 }}
              >
                <YAxis
                  hide
                  domain={sparklineDomain(metric.data.map((d) => d.v))}
                />
                <ChartTooltip
                  content={<ChartTooltipContent hideLabel />}
                  cursor={false}
                />
                <Line
                  dataKey="v"
                  type="monotone"
                  stroke="var(--color-v)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

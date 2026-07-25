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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

/** Synthetic latency samples binned into 8 equal-width buckets. */
const rawMs = [
  42, 55, 61, 68, 72, 75, 78, 81, 84, 88, 91, 95, 98, 102, 108, 115, 122,
  130, 145, 160, 178, 195, 48, 53, 66, 70, 77, 83, 89, 94, 101, 110, 125,
  140, 55, 62, 74, 86, 97, 105, 118, 132, 150, 170, 58, 80, 92, 112, 135,
]

function binHistogram(values: number[], binCount: number) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const width = (max - min) / binCount || 1
  const bins = Array.from({ length: binCount }, (_, i) => {
    const start = min + i * width
    const end = start + width
    return {
      bin: `${Math.round(start)}–${Math.round(end)}`,
      count: 0,
      start,
      end,
    }
  })
  for (const v of values) {
    const idx = Math.min(binCount - 1, Math.floor((v - min) / width))
    bins[idx].count += 1
  }
  return bins
}

const chartData = binHistogram(rawMs, 8)

const chartConfig = {
  count: {
    label: "Count",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartHistogram() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histogram</CardTitle>
        <CardDescription>Request latency distribution (ms)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[220px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="bin"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={50}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              allowDecimals={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" fill="var(--color-count)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

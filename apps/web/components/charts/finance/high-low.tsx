"use client"

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import { ohlcData } from "./ohlc-data"

const chartData = ohlcData.map((d) => ({
  date: d.date,
  close: d.close,
  low: d.low,
  range: d.high - d.low,
}))

const chartConfig = {
  close: { label: "Close", color: "var(--chart-1)" },
  low: { label: "Low", color: "transparent" },
  range: { label: "High–Low", color: "var(--chart-3)" },
} satisfies ChartConfig

/**
 * High–low range as a floating band: transparent stacked base at `low`
 * plus `range` (= high − low). Recharts has no native range mark.
 */
export function ChartHighLow() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>High–low range</CardTitle>
        <CardDescription>Daily range band with close overlay</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[260px] w-full">
          <ComposedChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
              tickFormatter={(v) => String(v).slice(5)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={40}
              domain={["auto", "auto"]}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              type="monotone"
              dataKey="low"
              stackId="range"
              stroke="none"
              fill="transparent"
              legendType="none"
            />
            <Area
              type="monotone"
              dataKey="range"
              stackId="range"
              stroke="none"
              fill="var(--color-range)"
              fillOpacity={0.35}
            />
            <Line
              type="monotone"
              dataKey="close"
              stroke="var(--color-close)"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

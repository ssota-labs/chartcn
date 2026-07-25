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

import { bollinger, ohlcData } from "./ohlc-data"

const closes = ohlcData.map((d) => d.close)
const bands = bollinger(closes, 20, 2)

const chartData = ohlcData.map((d, i) => ({
  date: d.date,
  close: d.close,
  mid: bands[i].mid,
  upper: bands[i].upper,
  lower: bands[i].lower,
  /** Range height for stacked area band approximation */
  bandBase: bands[i].lower,
  bandWidth:
    bands[i].upper != null && bands[i].lower != null
      ? bands[i].upper! - bands[i].lower!
      : null,
}))

const chartConfig = {
  close: { label: "Close", color: "var(--chart-1)" },
  mid: { label: "SMA 20", color: "var(--chart-2)" },
  upper: { label: "Upper", color: "var(--chart-3)" },
  lower: { label: "Lower", color: "var(--chart-3)" },
  bandWidth: { label: "Band", color: "var(--chart-3)" },
  bandBase: { label: "Band base", color: "transparent" },
} satisfies ChartConfig

export function ChartBollinger() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bollinger bands</CardTitle>
        <CardDescription>Close + SMA20 ± 2σ band</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[280px] w-full">
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
              dataKey="bandBase"
              stackId="band"
              stroke="none"
              fill="transparent"
              connectNulls
              legendType="none"
            />
            <Area
              type="monotone"
              dataKey="bandWidth"
              stackId="band"
              stroke="none"
              fill="var(--color-bandWidth)"
              fillOpacity={0.2}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="mid"
              stroke="var(--color-mid)"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
              connectNulls
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

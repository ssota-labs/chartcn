"use client"

import {
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  useXAxisScale,
  useYAxisScale,
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

import { ohlcData, sma, type OhlcPoint } from "./ohlc-data"

const closes = ohlcData.map((d) => d.close)
const ma10 = sma(closes, 10)
const ma20 = sma(closes, 20)

const chartData = ohlcData.map((d, i) => ({
  ...d,
  ma10: ma10[i],
  ma20: ma20[i],
}))

const chartConfig = {
  up: { label: "Up", color: "var(--chart-2)" },
  down: { label: "Down", color: "var(--chart-5)" },
  ma10: { label: "MA 10", color: "var(--chart-1)" },
  ma20: { label: "MA 20", color: "var(--chart-4)" },
} satisfies ChartConfig

function Candles({ data }: { data: OhlcPoint[] }) {
  const xScale = useXAxisScale()
  const yScale = useYAxisScale()
  if (!xScale || !yScale) return null

  return (
    <g>
      {data.map((d) => {
        const cx = xScale(d.date, { position: "middle" })
        const yHigh = yScale(d.high)
        const yLow = yScale(d.low)
        const yOpen = yScale(d.open)
        const yClose = yScale(d.close)
        if (
          cx == null ||
          yHigh == null ||
          yLow == null ||
          yOpen == null ||
          yClose == null
        ) {
          return null
        }
        const up = d.close >= d.open
        const color = up ? "var(--color-up)" : "var(--color-down)"
        return (
          <g key={d.date} opacity={0.85}>
            <line
              x1={cx}
              x2={cx}
              y1={yHigh}
              y2={yLow}
              stroke={color}
              strokeWidth={1}
            />
            <rect
              x={cx - 3}
              y={Math.min(yOpen, yClose)}
              width={6}
              height={Math.max(Math.abs(yClose - yOpen), 1)}
              fill={color}
            />
          </g>
        )
      })}
    </g>
  )
}

export function ChartMovingAverage() {
  const yDomain: [number, number] = [
    Math.floor(Math.min(...ohlcData.map((d) => d.low)) - 2),
    Math.ceil(Math.max(...ohlcData.map((d) => d.high)) + 2),
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Moving average overlay</CardTitle>
        <CardDescription>Candles with MA10 / MA20</CardDescription>
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
              domain={yDomain}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={40}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Candles data={ohlcData} />
            <Line
              type="monotone"
              dataKey="ma10"
              stroke="var(--color-ma10)"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="ma20"
              stroke="var(--color-ma20)"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

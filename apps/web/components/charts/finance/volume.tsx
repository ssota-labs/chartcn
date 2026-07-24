"use client"

import {
  Bar,
  CartesianGrid,
  Cell,
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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import { ohlcData, type OhlcPoint } from "./ohlc-data"

const chartConfig = {
  volume: { label: "Volume", color: "var(--chart-3)" },
  up: { label: "Up", color: "var(--chart-2)" },
  down: { label: "Down", color: "var(--chart-5)" },
  close: { label: "Close", color: "var(--chart-1)" },
} satisfies ChartConfig

function PriceCandles({ data }: { data: OhlcPoint[] }) {
  const xScale = useXAxisScale()
  const yScale = useYAxisScale(0)

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
        const bodyTop = Math.min(yOpen, yClose)
        const bodyHeight = Math.max(Math.abs(yClose - yOpen), 1)
        const half = 3

        return (
          <g key={d.date}>
            <line
              x1={cx}
              x2={cx}
              y1={yHigh}
              y2={yLow}
              stroke={color}
              strokeWidth={1}
            />
            <rect
              x={cx - half}
              y={bodyTop}
              width={half * 2}
              height={bodyHeight}
              fill={color}
            />
          </g>
        )
      })}
    </g>
  )
}

export function ChartVolumeUnderPrice() {
  const slice = ohlcData.slice(-24)
  const yDomain: [number, number] = [
    Math.floor(Math.min(...slice.map((d) => d.low)) - 2),
    Math.ceil(Math.max(...slice.map((d) => d.high)) + 2),
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Volume under price</CardTitle>
        <CardDescription>Candles + volume panel (dual axis)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <ComposedChart
            accessibilityLayer
            data={slice}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={20}
              tickFormatter={(v) => String(v).slice(5)}
            />
            <YAxis
              yAxisId={0}
              domain={yDomain}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={40}
            />
            <YAxis
              yAxisId="volume"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={48}
              tickFormatter={(v) => `${Math.round(Number(v) / 1e6)}M`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => String(label)}
                />
              }
            />
            <Bar
              yAxisId="volume"
              dataKey="volume"
              barSize={6}
              opacity={0.45}
              isAnimationActive={false}
            >
              {slice.map((d) => (
                <Cell
                  key={d.date}
                  fill={
                    d.close >= d.open ? "var(--color-up)" : "var(--color-down)"
                  }
                />
              ))}
            </Bar>
            <PriceCandles data={slice} />
            {/* close on price axis keeps tooltip / scale anchored */}
            <Line
              yAxisId={0}
              dataKey="close"
              stroke="transparent"
              dot={false}
              legendType="none"
              isAnimationActive={false}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import { ohlcData, type OhlcPoint } from "./ohlc-data"

const chartConfig = {
  up: { label: "Close ≥ Open", color: "var(--chart-2)" },
  down: { label: "Close < Open", color: "var(--chart-5)" },
  close: { label: "Close", color: "var(--chart-1)" },
} satisfies ChartConfig

/**
 * Recharts has no candlestick series. Custom SVG marks + ComposedChart,
 * positioned with useXAxisScale / useYAxisScale.
 */
function CandlestickLayer({ data }: { data: OhlcPoint[] }) {
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
        const bodyTop = Math.min(yOpen, yClose)
        const bodyHeight = Math.max(Math.abs(yClose - yOpen), 1)
        const half = 4

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
              stroke={color}
            />
          </g>
        )
      })}
    </g>
  )
}

export function ChartCandlestick() {
  const domainPad = 2
  const lows = ohlcData.map((d) => d.low)
  const highs = ohlcData.map((d) => d.high)
  const yDomain: [number, number] = [
    Math.floor(Math.min(...lows) - domainPad),
    Math.ceil(Math.max(...highs) + domainPad),
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>OHLC / Candlestick</CardTitle>
        <CardDescription>Synthetic daily candles (custom shape)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[280px] w-full">
          <ComposedChart
            accessibilityLayer
            data={ohlcData}
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
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => String(label)}
                  formatter={(_value, _name, item) => {
                    const p = item?.payload as OhlcPoint | undefined
                    if (!p) return null
                    return (
                      <div className="space-y-0.5 text-xs">
                        <div>O {p.open}</div>
                        <div>H {p.high}</div>
                        <div>L {p.low}</div>
                        <div>C {p.close}</div>
                      </div>
                    )
                  }}
                />
              }
            />
            <Line
              dataKey="close"
              stroke="transparent"
              dot={false}
              legendType="none"
              isAnimationActive={false}
            />
            <CandlestickLayer data={ohlcData} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

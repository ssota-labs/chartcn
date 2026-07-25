"use client"

import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import { macdSeries, ohlcData, rsiSeries } from "./ohlc-data"

const SYNC_ID = "finance-oscillators"

const closes = ohlcData.map((d) => d.close)
const { macd, signal, hist } = macdSeries(closes)
const rsi = rsiSeries(closes, 14)

const macdData = ohlcData.map((d, i) => ({
  date: d.date,
  macd: macd[i],
  signal: signal[i],
  hist: hist[i],
}))

const rsiData = ohlcData.map((d, i) => ({
  date: d.date,
  rsi: rsi[i],
}))

const macdConfig = {
  macd: { label: "MACD", color: "var(--chart-1)" },
  signal: { label: "Signal", color: "var(--chart-2)" },
  hist: { label: "Histogram", color: "var(--chart-3)" },
} satisfies ChartConfig

const rsiConfig = {
  rsi: { label: "RSI (14)", color: "var(--chart-4)" },
} satisfies ChartConfig

export function ChartMacdRsi() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>MACD / RSI synced panels</CardTitle>
        <CardDescription>
          Shared <code className="text-xs">syncId</code> for tooltip sync
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ChartContainer config={macdConfig} className="min-h-[180px] w-full">
          <ComposedChart
            accessibilityLayer
            syncId={SYNC_ID}
            data={macdData}
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
            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={40} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="hist" barSize={4} isAnimationActive={false}>
              {macdData.map((d) => (
                <Cell
                  key={d.date}
                  fill={
                    (d.hist ?? 0) >= 0
                      ? "var(--color-macd)"
                      : "var(--chart-5)"
                  }
                  fillOpacity={0.5}
                />
              ))}
            </Bar>
            <Line
              type="monotone"
              dataKey="macd"
              stroke="var(--color-macd)"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="signal"
              stroke="var(--color-signal)"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          </ComposedChart>
        </ChartContainer>

        <ChartContainer config={rsiConfig} className="min-h-[160px] w-full">
          <LineChart
            accessibilityLayer
            syncId={SYNC_ID}
            data={rsiData}
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
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={40}
            />
            <ReferenceLine y={70} stroke="var(--muted-foreground)" strokeDasharray="3 3" />
            <ReferenceLine y={30} stroke="var(--muted-foreground)" strokeDasharray="3 3" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="rsi"
              stroke="var(--color-rsi)"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

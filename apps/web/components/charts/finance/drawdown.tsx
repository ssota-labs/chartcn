"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

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

import { drawdownSeries, ohlcData } from "./ohlc-data"

const dd = drawdownSeries(ohlcData.map((d) => d.close))
const chartData = ohlcData.map((d, i) => ({
  date: d.date,
  drawdown: dd[i],
}))

const chartConfig = {
  drawdown: { label: "Drawdown %", color: "var(--chart-5)" },
} satisfies ChartConfig

export function ChartDrawdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Drawdown</CardTitle>
        <CardDescription>Underwater equity from running peak</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[240px] w-full">
          <AreaChart
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
              tickFormatter={(v) => `${v}%`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => `${value}%`}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="drawdown"
              stroke="var(--color-drawdown)"
              fill="var(--color-drawdown)"
              fillOpacity={0.35}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

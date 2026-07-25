"use client"

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"

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

type WaterfallRow = {
  step: string
  /** Invisible base that floats the visible bar */
  base: number
  value: number
  display: number
  kind: "total" | "increase" | "decrease"
}

function buildWaterfall(
  steps: { step: string; delta: number; total?: boolean }[]
): WaterfallRow[] {
  let running = 0
  return steps.map((s) => {
    if (s.total) {
      return {
        step: s.step,
        base: 0,
        value: running,
        display: running,
        kind: "total",
      }
    }
    const start = running
    running += s.delta
    if (s.delta >= 0) {
      return {
        step: s.step,
        base: start,
        value: s.delta,
        display: s.delta,
        kind: "increase",
      }
    }
    return {
      step: s.step,
      base: running,
      value: Math.abs(s.delta),
      display: s.delta,
      kind: "decrease",
    }
  })
}

const chartData = buildWaterfall([
  { step: "Start", delta: 120 },
  { step: "New", delta: 45 },
  { step: "Expansion", delta: 28 },
  { step: "Churn", delta: -32 },
  { step: "Contraction", delta: -18 },
  { step: "End", delta: 0, total: true },
])

const chartConfig = {
  value: { label: "Change", color: "var(--chart-1)" },
  base: { label: "Base", color: "transparent" },
  increase: { label: "Increase", color: "var(--chart-2)" },
  decrease: { label: "Decrease", color: "var(--chart-5)" },
  total: { label: "Total", color: "var(--chart-1)" },
} satisfies ChartConfig

function barColor(kind: WaterfallRow["kind"]) {
  if (kind === "increase") return "var(--color-increase)"
  if (kind === "decrease") return "var(--color-decrease)"
  return "var(--color-total)"
}

export function ChartWaterfall() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Waterfall</CardTitle>
        <CardDescription>ARR bridge ($k)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[240px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="step"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, _name, item) => {
                    const row = item?.payload as WaterfallRow | undefined
                    return (
                      <span>
                        {row?.kind === "total" ? "Total" : "Δ"}:{" "}
                        {row?.display ?? value}
                      </span>
                    )
                  }}
                />
              }
            />
            <Bar dataKey="base" stackId="a" fill="transparent" legendType="none" />
            <Bar dataKey="value" stackId="a" radius={[4, 4, 0, 0]}>
              {chartData.map((entry) => (
                <Cell key={entry.step} fill={barColor(entry.kind)} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

"use client"

import { Line, LineChart } from "recharts"

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

const series = [
  {
    name: "Checkout",
    color: "var(--chart-1)",
    data: [
      { i: 0, v: 40 },
      { i: 1, v: 42 },
      { i: 2, v: 38 },
      { i: 3, v: 45 },
      { i: 4, v: 48 },
      { i: 5, v: 52 },
      { i: 6, v: 50 },
    ],
  },
  {
    name: "Search",
    color: "var(--chart-2)",
    data: [
      { i: 0, v: 70 },
      { i: 1, v: 68 },
      { i: 2, v: 72 },
      { i: 3, v: 75 },
      { i: 4, v: 71 },
      { i: 5, v: 78 },
      { i: 6, v: 80 },
    ],
  },
  {
    name: "Profile",
    color: "var(--chart-3)",
    data: [
      { i: 0, v: 30 },
      { i: 1, v: 32 },
      { i: 2, v: 29 },
      { i: 3, v: 28 },
      { i: 4, v: 31 },
      { i: 5, v: 33 },
      { i: 6, v: 35 },
    ],
  },
  {
    name: "Billing",
    color: "var(--chart-4)",
    data: [
      { i: 0, v: 55 },
      { i: 1, v: 52 },
      { i: 2, v: 50 },
      { i: 3, v: 48 },
      { i: 4, v: 46 },
      { i: 5, v: 49 },
      { i: 6, v: 51 },
    ],
  },
  {
    name: "Support",
    color: "var(--chart-5)",
    data: [
      { i: 0, v: 22 },
      { i: 1, v: 24 },
      { i: 2, v: 26 },
      { i: 3, v: 25 },
      { i: 4, v: 28 },
      { i: 5, v: 30 },
      { i: 6, v: 29 },
    ],
  },
  {
    name: "Admin",
    color: "var(--chart-1)",
    data: [
      { i: 0, v: 15 },
      { i: 1, v: 16 },
      { i: 2, v: 14 },
      { i: 3, v: 18 },
      { i: 4, v: 17 },
      { i: 5, v: 19 },
      { i: 6, v: 21 },
    ],
  },
]

function Sparkline({
  name,
  color,
  data,
}: {
  name: string
  color: string
  data: { i: number; v: number }[]
}) {
  const config = {
    v: { label: name, color },
  } satisfies ChartConfig

  const last = data[data.length - 1]?.v ?? 0

  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium">{name}</span>
        <span className="text-sm font-semibold tabular-nums">{last}</span>
      </div>
      <ChartContainer config={config} className="h-12 w-full aspect-auto">
        <LineChart data={data} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
          <ChartTooltip
            content={<ChartTooltipContent hideLabel />}
            cursor={false}
          />
          <Line
            type="monotone"
            dataKey="v"
            stroke="var(--color-v)"
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}

export function ChartSmallMultiples() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Small Multiples</CardTitle>
        <CardDescription>Sparkline grid — page views (7d)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {series.map((s) => (
            <Sparkline key={s.name} {...s} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

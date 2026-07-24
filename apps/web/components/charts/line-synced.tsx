"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

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

const chartData = [
  { month: "January", sessions: 186, revenue: 12 },
  { month: "February", sessions: 305, revenue: 18 },
  { month: "March", sessions: 237, revenue: 15 },
  { month: "April", sessions: 173, revenue: 11 },
  { month: "May", sessions: 209, revenue: 14 },
  { month: "June", sessions: 274, revenue: 19 },
]

const sessionsConfig = {
  sessions: { label: "Sessions", color: "var(--chart-1)" },
} satisfies ChartConfig

const revenueConfig = {
  revenue: { label: "Revenue", color: "var(--chart-2)" },
} satisfies ChartConfig

export function ChartLineSynced() {
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(undefined)

  const handlers = {
    onMouseMove: (state: { activeTooltipIndex?: number | string | null }) => {
      if (state?.activeTooltipIndex != null) setActiveIndex(Number(state.activeTooltipIndex))
    },
    onMouseLeave: () => setActiveIndex(undefined),
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Line Chart — Synced Multi-panel</CardTitle>
        <CardDescription>Shared hover index across panels</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <ChartContainer config={sessionsConfig} className="min-h-[140px] w-full">
          <LineChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }} {...handlers}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => v.slice(0, 3)} hide />
            <ChartTooltip active={activeIndex != null} defaultIndex={activeIndex} content={<ChartTooltipContent />} />
            <Line dataKey="sessions" type="monotone" stroke="var(--color-sessions)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
        <ChartContainer config={revenueConfig} className="min-h-[140px] w-full">
          <LineChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }} {...handlers}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => v.slice(0, 3)} />
            <ChartTooltip active={activeIndex != null} defaultIndex={activeIndex} content={<ChartTooltipContent />} />
            <Line dataKey="revenue" type="monotone" stroke="var(--color-revenue)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]

const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
} satisfies ChartConfig

export function ChartAreaLinger() {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)
  const lingerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearLinger = () => {
    if (lingerRef.current) clearTimeout(lingerRef.current)
  }

  const handleMove = (state: { activeTooltipIndex?: number | string | null }) => {
    clearLinger()
    if (state?.activeTooltipIndex != null) {
      setActiveIndex(Number(state.activeTooltipIndex))
    }
  }

  const handleLeave = () => {
    clearLinger()
    lingerRef.current = setTimeout(() => setActiveIndex(null), 900)
  }

  React.useEffect(() => () => clearLinger(), [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Area Chart — Linger</CardTitle>
        <CardDescription>Active highlight lingers after mouse leave</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[220px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => v.slice(0, 3)} />
            <ChartTooltip
              active={activeIndex != null}
              defaultIndex={activeIndex ?? undefined}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={activeIndex == null ? 0.35 : 0.55}
              stroke="var(--color-desktop)"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

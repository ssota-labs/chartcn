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

export function ChartAreaClipToActive() {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)
  const clipPercent =
    activeIndex == null ? 100 : ((activeIndex + 0.5) / chartData.length) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Area Chart — Clip to Active</CardTitle>
        <CardDescription>Hover clips fill up to the active point</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[220px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
            onMouseMove={(state) => {
              if (state?.activeTooltipIndex != null) {
                setActiveIndex(Number(state.activeTooltipIndex))
              }
            }}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <defs>
              <clipPath id="clipActive">
                <rect x="0" y="0" width={`${clipPercent}%`} height="100%" />
              </clipPath>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => v.slice(0, 3)} />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <Area
              dataKey="desktop"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.15}
              stroke="var(--color-desktop)"
              strokeOpacity={0.35}
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.55}
              stroke="var(--color-desktop)"
              strokeWidth={2}
              clipPath="url(#clipActive)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

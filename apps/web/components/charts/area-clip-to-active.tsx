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
  // Clip in pixels from the chart's own coordinate space. A percentage width
  // would resolve against the SVG viewport, which includes the margins, so the
  // edge would drift away from the plot area — worst at the first/last point.
  const [clipX, setClipX] = React.useState<number | null>(null)
  const clipId = React.useId()

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
              const x = state?.activeCoordinate?.x
              setClipX(typeof x === "number" ? x : null)
            }}
            onMouseLeave={() => setClipX(null)}
          >
            <defs>
              <clipPath id={clipId}>
                <rect
                  x="0"
                  y="0"
                  width={clipX ?? "100%"}
                  height="100%"
                  className="transition-[width] duration-200 ease-out motion-reduce:transition-none"
                />
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
              clipPath={`url(#${clipId})`}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

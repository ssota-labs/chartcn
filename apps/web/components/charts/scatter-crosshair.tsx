"use client"

import { CartesianGrid, ReferenceLine, Scatter, ScatterChart, XAxis, YAxis, ZAxis } from "recharts"
import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ScatterDot,
  SCATTER_HOVER_RADIUS,
} from "./scatter-dot"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { x: 12, y: 28 },
  { x: 28, y: 52 },
  { x: 44, y: 38 },
  { x: 58, y: 72 },
  { x: 72, y: 48 },
  { x: 88, y: 86 },
]

const chartConfig = {
  points: { label: "Points", color: "var(--chart-1)" },
} satisfies ChartConfig

type Point = { x: number; y: number }

export function ChartScatterCrosshair({
  hoverRadius = SCATTER_HOVER_RADIUS,
}: {
  hoverRadius?: number
} = {}) {
  const [active, setActive] = React.useState<Point | null>(null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scatter Chart — Crosshair</CardTitle>
        <CardDescription>Reference lines follow active point</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[240px] w-full">
          <ScatterChart
            accessibilityLayer
            margin={{ left: 12, right: 12, top: 8, bottom: 8 }}
            onMouseLeave={() => setActive(null)}
          >
            <CartesianGrid />
            <XAxis type="number" dataKey="x" name="X" tickLine={false} axisLine={false} />
            <YAxis type="number" dataKey="y" name="Y" tickLine={false} axisLine={false} />
            <ZAxis range={[90, 90]} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            {active && (
              <>
                <ReferenceLine x={active.x} stroke="var(--muted-foreground)" strokeDasharray="4 4" />
                <ReferenceLine y={active.y} stroke="var(--muted-foreground)" strokeDasharray="4 4" />
              </>
            )}
            <Scatter
              data={chartData}
              fill="var(--color-points)"
              name="points"
              isAnimationActive={false}
              shape={<ScatterDot hoverRadius={hoverRadius} />}
              activeShape={<ScatterDot hoverRadius={hoverRadius} halo active />}
              onMouseEnter={(_, index) => {
                const point = chartData[index]
                if (point) setActive(point)
              }}
              onMouseLeave={() => setActive(null)}
            />
          </ScatterChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

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

/** How close (px) the pointer has to get before a dot takes it. */
const HOVER_RADIUS = 28
const DOT_RADIUS = 4.5
const ACTIVE_DOT_RADIUS = 6.5
/** Radius of the card-coloured disc that breaks the crosshair behind the dot. */
const HALO_RADIUS = 10

type Point = { x: number; y: number }

type ScatterDotProps = {
  cx?: number
  cy?: number
  fill?: string
  payload?: Point
  hoverRadius?: number
  activePoint?: Point | null
}

function ScatterDot({
  cx,
  cy,
  fill,
  payload,
  hoverRadius = HOVER_RADIUS,
  activePoint,
}: ScatterDotProps) {
  if (cx == null || cy == null) return <g />

  const isActive =
    activePoint != null &&
    payload != null &&
    activePoint.x === payload.x &&
    activePoint.y === payload.y

  return (
    <g>
      {/*
        The gravity field. Nothing is drawn — it only widens what recharts
        counts as "on" this dot, so the pointer gets caught before it has to
        land on the 9px marker.
      */}
      <circle cx={cx} cy={cy} r={hoverRadius} fill="transparent" />
      {isActive && (
        <circle cx={cx} cy={cy} r={HALO_RADIUS} className="fill-card" />
      )}
      <circle
        cx={cx}
        cy={cy}
        r={isActive ? ACTIVE_DOT_RADIUS : DOT_RADIUS}
        fill={fill}
      />
    </g>
  )
}

export function ChartScatterCrosshair({
  hoverRadius = HOVER_RADIUS,
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
              shape={
                <ScatterDot hoverRadius={hoverRadius} activePoint={active} />
              }
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

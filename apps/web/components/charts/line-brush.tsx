"use client"

import { Brush, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

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

const chartData = Array.from({ length: 24 }, (_, i) => ({
  month: `M${i + 1}`,
  revenue: Math.round(150 + Math.sin(i / 2) * 80 + i * 4 + (i % 3) * 12),
}))

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
} satisfies ChartConfig

/**
 * Recharts' default traveller is a bare 5px rect, which is hard to see as a
 * grabbable control and hard to hit. This one reads as a handle (rounded, grip
 * lines) and pads its hit area well past the visible bar.
 */
function BrushTraveller({
  x,
  y,
  width,
  height,
}: {
  x: number
  y: number
  width: number
  height: number
}) {
  const cx = x + width / 2
  return (
    <g className="cursor-col-resize">
      <rect
        x={cx - 14}
        y={y - 6}
        width={28}
        height={height + 12}
        fill="transparent"
      />
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={3}
        className="fill-background stroke-border"
      />
      {[-2, 2].map((offset) => (
        <line
          key={offset}
          x1={cx + offset}
          x2={cx + offset}
          y1={y + 9}
          y2={y + height - 9}
          strokeWidth={1}
          strokeLinecap="round"
          className="stroke-muted-foreground"
        />
      ))}
    </g>
  )
}

export function ChartLineBrush() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Line Chart — Brush / Zoom</CardTitle>
        <CardDescription>
          Drag the handles to resize the range, or the shaded band to pan it
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[280px] w-full">
          <LineChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            {/*
              Brush drags change the window continuously. Recharts' default
              1500ms path animation can't keep up, so the curve trails behind
              the selection — most visible at the right edge.
            */}
            <Line
              dataKey="revenue"
              type="monotone"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Brush
              dataKey="month"
              height={40}
              travellerWidth={10}
              startIndex={6}
              endIndex={17}
              alwaysShowText
              // stroke also tints the selected band (at 20%), so keep it the
              // series colour — that band is the only cue for what's selected.
              stroke="var(--color-revenue)"
              fill="var(--muted)"
              traveller={BrushTraveller}
            >
              {/* Panorama: the whole series, so the selection reads as a window onto it. */}
              <LineChart>
                <Line
                  dataKey="revenue"
                  type="monotone"
                  stroke="var(--color-revenue)"
                  strokeWidth={1}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </Brush>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

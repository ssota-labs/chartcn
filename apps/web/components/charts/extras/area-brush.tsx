"use client"

import { Area, AreaChart, Brush, CartesianGrid, XAxis, YAxis } from "recharts"

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
import { BrushTraveller } from "../brush-traveller"

const chartData = [
  { month: "Jan", visitors: 186 },
  { month: "Feb", visitors: 305 },
  { month: "Mar", visitors: 237 },
  { month: "Apr", visitors: 173 },
  { month: "May", visitors: 209 },
  { month: "Jun", visitors: 214 },
  { month: "Jul", visitors: 278 },
  { month: "Aug", visitors: 312 },
  { month: "Sep", visitors: 265 },
  { month: "Oct", visitors: 298 },
  { month: "Nov", visitors: 341 },
  { month: "Dec", visitors: 390 },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartAreaBrush() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Area Chart — Brush Zoom</CardTitle>
        <CardDescription>
          Drag the handles to resize the range, or the shaded band to pan it
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[260px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis hide domain={["dataMin - 20", "dataMax + 20"]} />
            <ChartTooltip
              content={<ChartTooltipContent indicator="line" />}
            />
            {/*
              Brush drags change the window continuously. Recharts' default
              1500ms path animation can't keep up, so the shape trails behind
              the selection — most visible at the right edge.
            */}
            <Area
              dataKey="visitors"
              type="monotone"
              fill="var(--color-visitors)"
              fillOpacity={0.35}
              stroke="var(--color-visitors)"
              isAnimationActive={false}
            />
            <Brush
              dataKey="month"
              height={40}
              travellerWidth={10}
              startIndex={2}
              endIndex={8}
              alwaysShowText
              // stroke also tints the selected band (at 20%), so keep it the
              // series colour — that band is the only cue for what's selected.
              stroke="var(--color-visitors)"
              fill="var(--muted)"
              traveller={BrushTraveller}
            >
              {/* Panorama: the whole series, so the selection reads as a window onto it. */}
              <AreaChart>
                <Area
                  dataKey="visitors"
                  type="monotone"
                  // Kept light: the selected band is tinted with this same
                  // colour, and a heavy panorama fill would swallow it.
                  fill="var(--color-visitors)"
                  fillOpacity={0.08}
                  stroke="var(--color-visitors)"
                  strokeWidth={1}
                  isAnimationActive={false}
                />
              </AreaChart>
            </Brush>
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

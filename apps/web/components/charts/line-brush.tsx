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
import { BrushTraveller } from "./brush-traveller"

const chartData = Array.from({ length: 24 }, (_, i) => ({
  month: `M${i + 1}`,
  revenue: Math.round(150 + Math.sin(i / 2) * 80 + i * 4 + (i % 3) * 12),
}))

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
} satisfies ChartConfig

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

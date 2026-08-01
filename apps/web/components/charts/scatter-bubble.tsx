"use client"

import { CartesianGrid, Scatter, ScatterChart, XAxis, YAxis, ZAxis } from "recharts"

import { ScatterDot } from "./scatter-dot"

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
  { x: 20, y: 40, z: 120, name: "Alpha" },
  { x: 35, y: 60, z: 200, name: "Beta" },
  { x: 50, y: 35, z: 80, name: "Gamma" },
  { x: 65, y: 75, z: 260, name: "Delta" },
  { x: 80, y: 55, z: 150, name: "Epsilon" },
  { x: 42, y: 82, z: 180, name: "Zeta" },
]

const chartConfig = {
  bubble: { label: "Bubble", color: "var(--chart-1)" },
} satisfies ChartConfig

export function ChartScatterBubble() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scatter Chart — Bubble</CardTitle>
        <CardDescription>Size encodes Z value</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[260px] w-full">
          <ScatterChart accessibilityLayer margin={{ left: 12, right: 12 }}>
            <CartesianGrid />
            <XAxis type="number" dataKey="x" name="X" tickLine={false} axisLine={false} />
            <YAxis type="number" dataKey="y" name="Y" tickLine={false} axisLine={false} />
            <ZAxis type="number" dataKey="z" range={[60, 400]} name="Size" />
            <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
            <Scatter
              data={chartData}
              fill="var(--color-bubble)"
              fillOpacity={0.7}
              name="bubble"
              shape={<ScatterDot />}
              activeShape={<ScatterDot active />}
            />
          </ScatterChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

"use client"

import {
  Label,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

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

const score = 78
const remaining = 100 - score

const chartData = [{ name: "score", score, remaining }]

const chartConfig = {
  score: { label: "Score", color: "var(--chart-1)" },
  remaining: { label: "Remaining", color: "var(--chart-2)" },
} satisfies ChartConfig

export function ChartRadialGauge() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Radial Chart — Gauge</CardTitle>
        <CardDescription>Semi-circle score gauge</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={180}
            endAngle={0}
            innerRadius={80}
            outerRadius={110}
          >
            <RadialBar
              dataKey="score"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-score)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="remaining"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-remaining)"
              className="stroke-transparent stroke-2 opacity-30"
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 8}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {score}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 14}
                          className="fill-muted-foreground"
                        >
                          / 100
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

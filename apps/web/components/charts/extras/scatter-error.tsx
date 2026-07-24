"use client"

import {
  CartesianGrid,
  ErrorBar,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
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

const chartData = [
  { x: 12, y: 28, errorX: 2, errorY: 3 },
  { x: 22, y: 36, errorX: 3, errorY: 4 },
  { x: 34, y: 31, errorX: 2.5, errorY: 3.5 },
  { x: 48, y: 44, errorX: 3, errorY: 5 },
  { x: 58, y: 39, errorX: 2, errorY: 3 },
  { x: 70, y: 52, errorX: 4, errorY: 4 },
]

const chartConfig = {
  samples: {
    label: "Samples",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

export function ChartScatterError() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scatter Chart — ErrorBar</CardTitle>
        <CardDescription>
          Bidirectional x/y error whiskers on points
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[260px] w-full">
          <ScatterChart
            accessibilityLayer
            margin={{ left: 12, right: 12, top: 8 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              type="number"
              dataKey="x"
              name="x"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="y"
              tickLine={false}
              axisLine={false}
              width={32}
            />
            <ChartTooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={<ChartTooltipContent hideLabel />}
            />
            <Scatter
              name="samples"
              data={chartData}
              fill="var(--color-samples)"
            >
              <ErrorBar
                dataKey="errorX"
                direction="x"
                width={4}
                strokeWidth={1.5}
                stroke="var(--muted-foreground)"
              />
              <ErrorBar
                dataKey="errorY"
                direction="y"
                width={4}
                strokeWidth={1.5}
                stroke="var(--muted-foreground)"
              />
            </Scatter>
          </ScatterChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

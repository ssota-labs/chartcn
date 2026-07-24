"use client"

import { Bar, BarChart, CartesianGrid, ErrorBar, XAxis, YAxis } from "recharts"

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
  { cohort: "A", conversion: 42, error: 4 },
  { cohort: "B", conversion: 55, error: 6 },
  { cohort: "C", conversion: 38, error: 5 },
  { cohort: "D", conversion: 61, error: 7 },
  { cohort: "E", conversion: 47, error: [3, 8] },
]

const chartConfig = {
  conversion: {
    label: "Conversion %",
    color: "var(--chart-1)",
  },
  error: {
    label: "Error",
    color: "var(--muted-foreground)",
  },
} satisfies ChartConfig

export function ChartBarError() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart — ErrorBar</CardTitle>
        <CardDescription>
          Symmetric and asymmetric error whiskers on bars
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[240px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="cohort"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis hide domain={[0, 80]} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="conversion"
              fill="var(--color-conversion)"
              radius={4}
            >
              <ErrorBar
                dataKey="error"
                width={4}
                strokeWidth={1.5}
                stroke="var(--muted-foreground)"
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

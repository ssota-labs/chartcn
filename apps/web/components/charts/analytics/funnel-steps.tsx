"use client"

import { Cell, Funnel, FunnelChart, LabelList } from "recharts"

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
  { step: "Visit", value: 12400, fill: "var(--color-visit)" },
  { step: "Signup", value: 6200, fill: "var(--color-signup)" },
  { step: "Activate", value: 3100, fill: "var(--color-activate)" },
  { step: "Subscribe", value: 1550, fill: "var(--color-subscribe)" },
  { step: "Retain", value: 980, fill: "var(--color-retain)" },
]

const chartConfig = {
  value: { label: "Users" },
  visit: { label: "Visit", color: "var(--chart-1)" },
  signup: { label: "Signup", color: "var(--chart-2)" },
  activate: { label: "Activate", color: "var(--chart-3)" },
  subscribe: { label: "Subscribe", color: "var(--chart-4)" },
  retain: { label: "Retain", color: "var(--chart-5)" },
} satisfies ChartConfig

export function ChartFunnelSteps() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Funnel Steps</CardTitle>
        <CardDescription>Conversion and drop-off by stage</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[280px] w-full">
          <FunnelChart accessibilityLayer>
            <ChartTooltip
              content={<ChartTooltipContent hideLabel nameKey="step" />}
            />
            <Funnel
              dataKey="value"
              data={chartData}
              nameKey="step"
              isAnimationActive
            >
              <LabelList
                position="right"
                fill="var(--foreground)"
                stroke="none"
                dataKey="step"
              />
              {chartData.map((entry) => (
                <Cell key={entry.step} fill={entry.fill} />
              ))}
            </Funnel>
          </FunnelChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

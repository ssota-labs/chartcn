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
  { step: "Visitors", value: 4800, fill: "var(--color-visitors)" },
  { step: "Signups", value: 2100, fill: "var(--color-signups)" },
  { step: "Activated", value: 1260, fill: "var(--color-activated)" },
  { step: "Paid", value: 540, fill: "var(--color-paid)" },
]

const chartConfig = {
  value: { label: "Users" },
  visitors: { label: "Visitors", color: "var(--chart-1)" },
  signups: { label: "Signups", color: "var(--chart-2)" },
  activated: { label: "Activated", color: "var(--chart-3)" },
  paid: { label: "Paid", color: "var(--chart-4)" },
} satisfies ChartConfig

export function ChartFunnelTemplate() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Funnel Chart — Template</CardTitle>
        <CardDescription>
          Polished FunnelChart leftover (distinct from analytics funnel steps)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[280px] w-full">
          <FunnelChart accessibilityLayer>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="step" />}
            />
            <Funnel
              data={chartData}
              dataKey="value"
              nameKey="step"
              isAnimationActive
              lastShapeType="rectangle"
            >
              <LabelList
                dataKey="step"
                position="right"
                fill="var(--foreground)"
                stroke="none"
                className="text-xs"
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

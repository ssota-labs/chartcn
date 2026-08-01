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

const steps = [
  { step: "Visit", value: 12400 },
  { step: "Signup", value: 6200 },
  { step: "Activate", value: 3100 },
  { step: "Subscribe", value: 1550 },
  { step: "Retain", value: 980 },
]

/**
 * One hue stepping down in weight, rather than five unrelated hues. The stages
 * are an ordered sequence, so colour should carry that order — five categorical
 * colours read as five unrelated things.
 */
const chartData = steps.map((s, i) => ({
  ...s,
  fill: `color-mix(in oklch, var(--chart-1) ${100 - i * 14}%, var(--muted))`,
  conversion: i === 0 ? null : Math.round((s.value / steps[i - 1].value) * 100),
}))

const chartConfig = {
  value: { label: "Users" },
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
          {/* Room on the right for the stage name and its count. */}
          <FunnelChart accessibilityLayer margin={{ right: 108 }}>
            <ChartTooltip
              content={<ChartTooltipContent hideLabel nameKey="step" />}
            />
            <Funnel
              dataKey="value"
              data={chartData}
              nameKey="step"
              isAnimationActive
              animationDuration={700}
              animationEasing="ease-out"
              // Recharts strokes segments white by default, which cuts the
              // funnel into slabs. A card-coloured seam separates them without
              // drawing a hard outline.
              stroke="var(--card)"
              strokeWidth={2}
            >
              <LabelList
                position="right"
                fill="var(--foreground)"
                stroke="none"
                dataKey="step"
                className="text-xs font-medium"
              />
              <LabelList
                position="right"
                dataKey="value"
                offset={64}
                fill="var(--muted-foreground)"
                stroke="none"
                className="text-[11px] tabular-nums"
                formatter={(v) => Number(v).toLocaleString()}
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

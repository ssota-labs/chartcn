"use client"

import {
  Bar,
  BarChart,
  ReferenceArea,
  ReferenceLine,
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

type BulletRow = {
  metric: string
  poor: number
  ok: number
  actual: number
  target: number
}

const chartData: BulletRow[] = [
  { metric: "Revenue", poor: 60, ok: 85, actual: 78, target: 90 },
  { metric: "NPS", poor: 40, ok: 70, actual: 62, target: 75 },
  { metric: "Uptime", poor: 95, ok: 99, actual: 99.4, target: 99.9 },
]

const chartConfig = {
  actual: { label: "Actual", color: "var(--chart-1)" },
  target: { label: "Target", color: "var(--chart-2)" },
  poor: { label: "Poor", color: "var(--muted)" },
  ok: { label: "OK", color: "color-mix(in oklch, var(--chart-3) 40%, var(--muted))" },
  good: { label: "Good", color: "color-mix(in oklch, var(--chart-2) 30%, var(--muted))" },
} satisfies ChartConfig

/**
 * Bullet charts approximated with ReferenceArea ranges + Bar + ReferenceLine.
 * Recharts has no dedicated bullet mark.
 */
export function ChartBullet() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bullet Chart</CardTitle>
        <CardDescription>KPI vs qualitative ranges + target</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {chartData.map((row) => (
          <div key={row.metric} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium">{row.metric}</span>
              <span className="text-muted-foreground tabular-nums">
                {row.actual} / target {row.target}
              </span>
            </div>
            <ChartContainer
              config={chartConfig}
              className="h-10 w-full aspect-auto"
            >
              <BarChart
                accessibilityLayer
                layout="vertical"
                data={[row]}
                margin={{ left: 0, right: 8, top: 8, bottom: 8 }}
              >
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis type="category" dataKey="metric" hide />
                <ReferenceArea
                  x1={0}
                  x2={row.poor}
                  fill="var(--color-poor)"
                  fillOpacity={1}
                  ifOverflow="visible"
                />
                <ReferenceArea
                  x1={row.poor}
                  x2={row.ok}
                  fill="var(--color-ok)"
                  fillOpacity={1}
                  ifOverflow="visible"
                />
                <ReferenceArea
                  x1={row.ok}
                  x2={100}
                  fill="var(--color-good)"
                  fillOpacity={1}
                  ifOverflow="visible"
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey="actual"
                  barSize={8}
                  fill="var(--color-actual)"
                  radius={2}
                  isAnimationActive={false}
                />
                <ReferenceLine
                  x={row.target}
                  stroke="var(--color-target)"
                  strokeWidth={2}
                />
              </BarChart>
            </ChartContainer>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

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
  { month: "January", revenue: 1860, growth: 4.2 },
  { month: "February", revenue: 3050, growth: 12.1 },
  { month: "March", revenue: 2370, growth: -8.4 },
  { month: "April", revenue: 2030, growth: -2.1 },
  { month: "May", revenue: 2090, growth: 3.0 },
  { month: "June", revenue: 2640, growth: 9.5 },
]

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
} satisfies ChartConfig

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value?: number; payload?: { growth?: number } }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  const growth = payload[0].payload?.growth ?? 0
  return (
    <div className="rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl">
      <div className="mb-1 font-medium">{label}</div>
      <div>
        Revenue: <span className="font-mono">${(payload[0].value ?? 0).toLocaleString()}</span>
      </div>
      <div className={growth >= 0 ? "text-emerald-600" : "text-rose-600"}>
        MoM: {growth >= 0 ? "+" : ""}
        {growth}%
      </div>
    </div>
  )
}

export function ChartLineCustomTooltip() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Line Chart — Custom Tooltip</CardTitle>
        <CardDescription>Revenue with MoM growth</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[220px] w-full">
          <LineChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => v.slice(0, 3)} />
            <ChartTooltip content={<CustomTooltip />} />
            <Line dataKey="revenue" type="monotone" stroke="var(--color-revenue)" strokeWidth={2} dot />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
  { channel: "Organic", leads: 420 },
  { channel: "Paid", leads: 310 },
  { channel: "Referral", leads: 186 },
  { channel: "Partner", leads: 142 },
  { channel: "Direct", leads: 98 },
]

const chartConfig = {
  leads: {
    label: "Leads",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartBarHorizontal() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart — Horizontal</CardTitle>
        <CardDescription>Category ranking with vertical layout</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[260px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 8, right: 12 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="channel"
              type="category"
              tickLine={false}
              axisLine={false}
              width={72}
            />
            <XAxis type="number" hide />
            <ChartTooltip
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="leads"
              fill="var(--color-leads)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

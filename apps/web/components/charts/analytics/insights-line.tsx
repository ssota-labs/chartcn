"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { date: "Mon", sessions: 420, signups: 48, purchases: 18 },
  { date: "Tue", sessions: 510, signups: 62, purchases: 22 },
  { date: "Wed", sessions: 470, signups: 55, purchases: 19 },
  { date: "Thu", sessions: 580, signups: 71, purchases: 28 },
  { date: "Fri", sessions: 640, signups: 84, purchases: 31 },
  { date: "Sat", sessions: 390, signups: 41, purchases: 14 },
  { date: "Sun", sessions: 360, signups: 38, purchases: 12 },
]

const stackedData = [
  { date: "Mon", organic: 220, paid: 120, referral: 80 },
  { date: "Tue", organic: 260, paid: 150, referral: 100 },
  { date: "Wed", organic: 240, paid: 140, referral: 90 },
  { date: "Thu", organic: 300, paid: 170, referral: 110 },
  { date: "Fri", organic: 330, paid: 190, referral: 120 },
  { date: "Sat", organic: 200, paid: 110, referral: 80 },
  { date: "Sun", organic: 180, paid: 100, referral: 80 },
]

const lineConfig = {
  sessions: { label: "Sessions", color: "var(--chart-1)" },
  signups: { label: "Signups", color: "var(--chart-2)" },
  purchases: { label: "Purchases", color: "var(--chart-3)" },
} satisfies ChartConfig

const stackedConfig = {
  organic: { label: "Organic", color: "var(--chart-1)" },
  paid: { label: "Paid", color: "var(--chart-2)" },
  referral: { label: "Referral", color: "var(--chart-3)" },
} satisfies ChartConfig

export function ChartInsightsLine() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Insights Line</CardTitle>
          <CardDescription>Multi-metric event trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={lineConfig} className="min-h-[220px] w-full">
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                dataKey="sessions"
                type="monotone"
                stroke="var(--color-sessions)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="signups"
                type="monotone"
                stroke="var(--color-signups)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="purchases"
                type="monotone"
                stroke="var(--color-purchases)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Insights Stacked Line</CardTitle>
          <CardDescription>Channel contribution over the week</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={stackedConfig}
            className="min-h-[220px] w-full"
          >
            <AreaChart
              accessibilityLayer
              data={stackedData}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                dataKey="referral"
                type="monotone"
                fill="var(--color-referral)"
                fillOpacity={0.35}
                stroke="var(--color-referral)"
                strokeWidth={2}
                stackId="channels"
              />
              <Area
                dataKey="paid"
                type="monotone"
                fill="var(--color-paid)"
                fillOpacity={0.35}
                stroke="var(--color-paid)"
                strokeWidth={2}
                stackId="channels"
              />
              <Area
                dataKey="organic"
                type="monotone"
                fill="var(--color-organic)"
                fillOpacity={0.35}
                stroke="var(--color-organic)"
                strokeWidth={2}
                stackId="channels"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

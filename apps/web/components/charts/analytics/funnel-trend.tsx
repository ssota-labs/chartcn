"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

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
  { week: "W1", visitToSignup: 48, signupToActivate: 52, activateToPay: 41 },
  { week: "W2", visitToSignup: 51, signupToActivate: 54, activateToPay: 43 },
  { week: "W3", visitToSignup: 49, signupToActivate: 57, activateToPay: 46 },
  { week: "W4", visitToSignup: 53, signupToActivate: 55, activateToPay: 44 },
  { week: "W5", visitToSignup: 56, signupToActivate: 58, activateToPay: 47 },
  { week: "W6", visitToSignup: 54, signupToActivate: 60, activateToPay: 49 },
]

const chartConfig = {
  visitToSignup: { label: "Visit → Signup", color: "var(--chart-1)" },
  signupToActivate: { label: "Signup → Activate", color: "var(--chart-2)" },
  activateToPay: { label: "Activate → Pay", color: "var(--chart-3)" },
} satisfies ChartConfig

export function ChartFunnelTrend() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Funnel Trend</CardTitle>
        <CardDescription>Step conversion rate over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[220px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent formatter={(value) => `${value}%`} />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              dataKey="visitToSignup"
              type="monotone"
              stroke="var(--color-visitToSignup)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="signupToActivate"
              type="monotone"
              stroke="var(--color-signupToActivate)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="activateToPay"
              type="monotone"
              stroke="var(--color-activateToPay)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

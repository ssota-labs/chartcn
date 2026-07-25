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
  { bucket: "1", users: 4200 },
  { bucket: "2–3", users: 3100 },
  { bucket: "4–7", users: 2400 },
  { bucket: "8–14", users: 1600 },
  { bucket: "15–30", users: 980 },
  { bucket: "31+", users: 540 },
]

const chartConfig = {
  users: { label: "Users", color: "var(--chart-1)" },
} satisfies ChartConfig

export function ChartEventFrequency() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Frequency</CardTitle>
        <CardDescription>
          Histogram of events per user in the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[220px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="bucket"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="users" fill="var(--color-users)" radius={3} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

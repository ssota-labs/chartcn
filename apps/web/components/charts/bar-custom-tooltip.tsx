"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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
  { month: "January", sales: 1860, orders: 42 },
  { month: "February", sales: 3050, orders: 68 },
  { month: "March", sales: 2370, orders: 51 },
  { month: "April", sales: 1730, orders: 39 },
  { month: "May", sales: 2090, orders: 47 },
  { month: "June", sales: 2740, orders: 61 },
]

const chartConfig = {
  sales: { label: "Sales", color: "var(--chart-1)" },
} satisfies ChartConfig

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value?: number; payload?: { orders?: number } }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl">
      <div className="mb-1 font-medium">{label}</div>
      <div className="text-muted-foreground">
        Revenue: <span className="font-mono text-foreground">${(item.value ?? 0).toLocaleString()}</span>
      </div>
      <div className="text-muted-foreground">
        Orders: <span className="font-mono text-foreground">{item.payload?.orders ?? 0}</span>
      </div>
      <div className="mt-1 text-muted-foreground">
        AOV:{" "}
        <span className="font-mono text-foreground">
          ${item.payload?.orders ? Math.round((item.value ?? 0) / item.payload.orders) : 0}
        </span>
      </div>
    </div>
  )
}

export function ChartBarCustomTooltip() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart — Custom Tooltip</CardTitle>
        <CardDescription>Revenue, orders, and AOV</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[220px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => v.slice(0, 3)} />
            <ChartTooltip content={<CustomTooltip />} />
            <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

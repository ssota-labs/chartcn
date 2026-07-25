"use client"

import { Sankey, Tooltip } from "recharts"

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

const data = {
  nodes: [
    { name: "Visit" },
    { name: "Sign up" },
    { name: "Activate" },
    { name: "Paid" },
    { name: "Churn" },
  ],
  links: [
    { source: 0, target: 1, value: 420 },
    { source: 0, target: 4, value: 180 },
    { source: 1, target: 2, value: 310 },
    { source: 1, target: 4, value: 110 },
    { source: 2, target: 3, value: 210 },
    { source: 2, target: 4, value: 100 },
  ],
}

const chartConfig = {
  value: { label: "Flow", color: "var(--chart-4)" },
} satisfies ChartConfig

export function ChartSankeyCustomStroke() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sankey — Custom Stroke</CardTitle>
        <CardDescription>Thicker dashed node stroke</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[280px] w-full aspect-auto">
          <Sankey
            data={data}
            nodePadding={28}
            nodeWidth={16}
            linkCurvature={0.4}
            margin={{ left: 16, right: 16, top: 12, bottom: 12 }}
            node={{
              fill: "var(--chart-4)",
              stroke: "var(--foreground)",
              strokeWidth: 1.5,
              strokeDasharray: "3 2",
            }}
            link={{ stroke: "var(--chart-4)", strokeOpacity: 0.35, strokeWidth: 1 }}
          >
            <Tooltip />
          </Sankey>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

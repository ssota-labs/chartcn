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
  value: { label: "Flow", color: "var(--chart-1)" },
} satisfies ChartConfig

export function ChartSankeyBasic() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sankey — Basic</CardTitle>
        <CardDescription>Funnel flow from visit to paid</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[280px] w-full aspect-auto">
          <Sankey
            data={data}
            nodePadding={24}
            nodeWidth={12}
            linkCurvature={0.5}
            margin={{ left: 16, right: 16, top: 12, bottom: 12 }}
            node={{ fill: "var(--chart-1)", stroke: "var(--chart-1)" }}
            link={{ stroke: "var(--chart-1)", strokeOpacity: 0.3 }}
          >
            <Tooltip />
          </Sankey>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

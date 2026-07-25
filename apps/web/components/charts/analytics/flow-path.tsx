"use client"

import { Sankey, Tooltip as RechartsTooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"

const chartData = {
  nodes: [
    { name: "Homepage" },
    { name: "Pricing" },
    { name: "Docs" },
    { name: "Signup" },
    { name: "Checkout" },
    { name: "Churn" },
  ],
  links: [
    { source: 0, target: 1, value: 4200 },
    { source: 0, target: 2, value: 3100 },
    { source: 1, target: 3, value: 2400 },
    { source: 2, target: 3, value: 1800 },
    { source: 3, target: 4, value: 2100 },
    { source: 3, target: 5, value: 2100 },
    { source: 1, target: 5, value: 900 },
  ],
}

const chartConfig = {
  flow: { label: "Users", color: "var(--chart-1)" },
} satisfies ChartConfig

export function ChartFlowPath() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Flow / Path</CardTitle>
        <CardDescription>User journey Sankey (Sankey reuse)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto min-h-[320px] w-full"
        >
          <Sankey
            data={chartData}
            nodeWidth={12}
            nodePadding={28}
            linkCurvature={0.5}
            iterations={32}
            margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
            node={{ fill: "var(--chart-1)", stroke: "var(--chart-1)" }}
            link={{ stroke: "var(--chart-2)", strokeOpacity: 0.35 }}
          >
            <RechartsTooltip />
          </Sankey>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

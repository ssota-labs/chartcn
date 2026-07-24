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
    { name: "A" },
    { name: "B" },
    { name: "C" },
    { name: "D" },
  ],
  links: [
    { source: 0, target: 1, value: 80 },
    { source: 0, target: 2, value: 40 },
    { source: 1, target: 3, value: 60 },
    { source: 2, target: 3, value: 35 },
  ],
}

const chartConfig = {
  value: { label: "Flow", color: "var(--chart-5)" },
} satisfies ChartConfig

export function ChartSankeyCompact() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sankey — Compact</CardTitle>
        <CardDescription>Tight padding for dense layouts</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[180px] w-full aspect-auto">
          <Sankey
            data={data}
            nodePadding={8}
            nodeWidth={8}
            linkCurvature={0.6}
            iterations={24}
            margin={{ left: 4, right: 4, top: 4, bottom: 4 }}
            node={{ fill: "var(--chart-5)" }}
            link={{ stroke: "var(--chart-5)", strokeOpacity: 0.35 }}
          >
            <Tooltip />
          </Sankey>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

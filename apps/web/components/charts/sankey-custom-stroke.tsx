"use client"

import * as React from "react"
import { Sankey } from "recharts"

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
import { SankeyLinkShape, SankeyNodeShape } from "./sankey-parts"

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
  const [activeNode, setActiveNode] = React.useState<string | null>(null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sankey — Custom Stroke</CardTitle>
        <CardDescription>Thicker dashed node stroke</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[280px] w-full aspect-auto">
          <Sankey
            data={data}
            nodePadding={28}
            nodeWidth={16}
            linkCurvature={0.4}
            margin={{ left: 16, right: 104, top: 16, bottom: 16 }}
            node={
              <SankeyNodeShape
                activeNode={activeNode}
                onActivate={setActiveNode} nodeStroke="var(--card)"
              />
            }
            link={<SankeyLinkShape activeNode={activeNode} />}
          >
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          </Sankey>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

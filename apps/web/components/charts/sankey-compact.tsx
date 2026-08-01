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
  const [activeNode, setActiveNode] = React.useState<string | null>(null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sankey — Compact</CardTitle>
        <CardDescription>Tight padding for dense layouts</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[180px] w-full aspect-auto">
          <Sankey
            data={data}
            nodePadding={8}
            nodeWidth={8}
            linkCurvature={0.6}
            iterations={24}
            margin={{ left: 16, right: 96, top: 12, bottom: 12 }}
            node={
              <SankeyNodeShape
                activeNode={activeNode}
                onActivate={setActiveNode} showValue={false}
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

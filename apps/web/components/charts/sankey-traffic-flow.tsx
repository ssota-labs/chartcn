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
    { name: "Organic" },
    { name: "Paid" },
    { name: "Referral" },
    { name: "Landing" },
    { name: "Product" },
    { name: "Checkout" },
    { name: "Purchase" },
    { name: "Bounce" },
  ],
  links: [
    { source: 0, target: 3, value: 520 },
    { source: 1, target: 3, value: 340 },
    { source: 2, target: 3, value: 180 },
    { source: 3, target: 4, value: 610 },
    { source: 3, target: 7, value: 430 },
    { source: 4, target: 5, value: 390 },
    { source: 4, target: 7, value: 220 },
    { source: 5, target: 6, value: 260 },
    { source: 5, target: 7, value: 130 },
  ],
}

const chartConfig = {
  value: { label: "Sessions", color: "var(--chart-2)" },
} satisfies ChartConfig

export function ChartSankeyTrafficFlow() {
  const [activeNode, setActiveNode] = React.useState<string | null>(null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sankey — Traffic Flow</CardTitle>
        <CardDescription>Acquisition → landing → purchase</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full aspect-auto">
          <Sankey
            data={data}
            nodePadding={18}
            nodeWidth={14}
            margin={{ left: 16, right: 104, top: 16, bottom: 16 }}
            node={
              <SankeyNodeShape
                activeNode={activeNode}
                onActivate={setActiveNode}
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

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
import { SankeyLinkShape, SankeyNodeShape } from "../sankey-parts"

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
  const [activeNode, setActiveNode] = React.useState<string | null>(null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Flow / Path</CardTitle>
        <CardDescription>User journey Sankey (Sankey reuse)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[320px] w-full"
        >
          <Sankey
            data={chartData}
            nodeWidth={12}
            nodePadding={28}
            linkCurvature={0.5}
            iterations={32}
            // Room for the stage labels sitting outside the node bars.
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

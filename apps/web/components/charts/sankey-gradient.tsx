"use client"

import { Sankey, Tooltip } from "recharts"
import type { LinkProps } from "recharts/types/chart/Sankey"

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

function GradientLink(props: LinkProps) {
  const {
    sourceX,
    targetX,
    sourceY,
    targetY,
    sourceControlX,
    targetControlX,
    linkWidth,
    index,
  } = props
  const id = `sankey-grad-${index}`
  return (
    <g>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={sourceX} x2={targetX}>
          <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.55} />
          <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0.35} />
        </linearGradient>
      </defs>
      <path
        d={`M${sourceX},${sourceY} C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}`}
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth={linkWidth}
        strokeOpacity={0.9}
      />
    </g>
  )
}

export function ChartSankeyGradient() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sankey — Gradient Links</CardTitle>
        <CardDescription>Links fade between chart colors</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[280px] w-full aspect-auto">
          <Sankey
            data={data}
            nodePadding={24}
            nodeWidth={12}
            margin={{ left: 16, right: 16, top: 12, bottom: 12 }}
            node={{ fill: "var(--chart-1)" }}
            link={GradientLink}
          >
            <Tooltip />
          </Sankey>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

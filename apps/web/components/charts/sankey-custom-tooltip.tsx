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
  value: { label: "Users", color: "var(--chart-1)" },
} satisfies ChartConfig

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{
    name?: string
    value?: number
    payload?: {
      source?: { name?: string }
      target?: { name?: string }
      value?: number
      name?: string
    }
  }>
}) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  const p = item.payload
  const isLink = p?.source && p?.target
  return (
    <div className="rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl">
      {isLink ? (
        <>
          <div className="font-medium">
            {p?.source?.name} → {p?.target?.name}
          </div>
          <div className="text-muted-foreground">
            Users: <span className="font-mono text-foreground">{p?.value?.toLocaleString()}</span>
          </div>
        </>
      ) : (
        <>
          <div className="font-medium">{p?.name ?? item.name}</div>
          <div className="text-muted-foreground">Node</div>
        </>
      )}
    </div>
  )
}

export function ChartSankeyCustomTooltip() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sankey — Custom Tooltip</CardTitle>
        <CardDescription>Source → target flow details</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[280px] w-full aspect-auto">
          <Sankey
            data={data}
            nodePadding={24}
            nodeWidth={12}
            margin={{ left: 16, right: 16, top: 12, bottom: 12 }}
            node={{ fill: "var(--chart-1)" }}
            link={{ stroke: "var(--chart-1)", strokeOpacity: 0.3 }}
          >
            <Tooltip content={<CustomTooltip />} />
          </Sankey>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

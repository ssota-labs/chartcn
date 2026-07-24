"use client"

import { Tooltip, Treemap } from "recharts"

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

const chartData = [
  {
    name: "root",
    children: [
      { name: "Enterprise", size: 980, share: 0.34 },
      { name: "Mid-market", size: 720, share: 0.25 },
      { name: "SMB", size: 640, share: 0.22 },
      { name: "Self-serve", size: 540, share: 0.19 },
    ],
  },
]

const chartConfig = {
  size: { label: "ARR", color: "var(--chart-1)" },
} satisfies ChartConfig

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload?: { name?: string; value?: number; share?: number } }>
}) {
  if (!active || !payload?.length) return null
  const node = payload[0]?.payload
  if (!node?.name || node.name === "root") return null
  return (
    <div className="rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl">
      <div className="font-medium">{node.name}</div>
      <div className="text-muted-foreground">
        ARR: <span className="font-mono text-foreground">${(node.value ?? 0).toLocaleString()}k</span>
      </div>
      <div className="text-muted-foreground">
        Share: <span className="font-mono text-foreground">{Math.round((node.share ?? 0) * 100)}%</span>
      </div>
    </div>
  )
}

function Content(props: {
  x?: number
  y?: number
  width?: number
  height?: number
  name?: string
  depth?: number
}) {
  const { x = 0, y = 0, width = 0, height = 0, name, depth = 0 } = props
  if (depth < 1 || width < 2 || height < 2) return null
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill="var(--chart-1)" fillOpacity={0.8} stroke="var(--background)" strokeWidth={2} />
      {width > 48 && height > 22 ? (
        <text x={x + 8} y={y + 18} className="fill-foreground text-[11px]">
          {name}
        </text>
      ) : null}
    </g>
  )
}

export function ChartTreemapCustomTooltip() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Treemap — Custom Tooltip</CardTitle>
        <CardDescription>ARR and share on hover</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[260px] w-full aspect-auto">
          <Treemap data={chartData} dataKey="size" nameKey="name" content={<Content />} isAnimationActive={false}>
            <Tooltip content={<CustomTooltip />} />
          </Treemap>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

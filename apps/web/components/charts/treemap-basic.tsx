"use client"

import { Treemap } from "recharts"

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
    name: "Product",
    children: [
      { name: "Electronics", size: 1200, fill: "var(--chart-1)" },
      { name: "Apparel", size: 800, fill: "var(--chart-2)" },
      { name: "Home", size: 600, fill: "var(--chart-3)" },
      { name: "Beauty", size: 400, fill: "var(--chart-4)" },
    ],
  },
]

const chartConfig = {
  size: { label: "Size", color: "var(--chart-1)" },
} satisfies ChartConfig

/** Below this a tile can't hold a label without clipping it. */
const MIN_LABEL_WIDTH = 56
const MIN_LABEL_HEIGHT = 34
/** Tiles cascade in rather than all landing at once. */
const STAGGER_MS = 45

type TreemapNodeProps = {
  x?: number
  y?: number
  width?: number
  height?: number
  index?: number
  name?: string
  size?: number
  fill?: string
  children?: readonly unknown[] | null
}

function TreemapNode({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  index = 0,
  name,
  size,
  fill,
  children,
}: TreemapNodeProps) {
  // Branch nodes cover the whole area their leaves sit in, so painting them
  // would hide the tiles underneath.
  const isLeaf = children == null || children.length === 0
  if (!isLeaf || width <= 0 || height <= 0) return <g />

  const showLabel = width >= MIN_LABEL_WIDTH && height >= MIN_LABEL_HEIGHT

  return (
    // Entry and hover own separate layers — one element cannot run an
    // animation and a transition on transform at the same time.
    <g
      className="[transform-box:fill-box] [transform-origin:center] animate-in fade-in zoom-in-95 fill-mode-backwards duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:animate-none"
      style={{ animationDelay: `${index * STAGGER_MS}ms` }}
    >
      <g
        // fill-box scales the tile from its own centre, not the chart origin,
        // so hover reads as "this tile lifted".
        // Tailwind's scale-* sets the CSS `scale` property, not `transform`,
        // so `scale` is what has to be transitioned here.
        className="[transform-box:fill-box] [transform-origin:center] transition-[scale,filter] duration-150 ease-out hover:brightness-110 motion-safe:hover:scale-[1.015] motion-reduce:transition-none"
      >
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={6}
          fill={fill}
          // A card-coloured seam reads as a gap between tiles.
          stroke="var(--card)"
          strokeWidth={3}
        />
        {showLabel && (
          <text
            x={x + 12}
            y={y + 24}
            className="pointer-events-none fill-white text-[13px] font-medium [paint-order:stroke]"
            // Outlines the glyphs so the label survives any tile colour.
            stroke="oklch(0 0 0 / 0.35)"
            strokeWidth={3}
          >
            {name}
          </text>
        )}
        {showLabel && height >= MIN_LABEL_HEIGHT + 18 && (
          <text
            x={x + 12}
            y={y + 42}
            className="pointer-events-none fill-white/80 text-[12px] tabular-nums [paint-order:stroke]"
            stroke="oklch(0 0 0 / 0.35)"
            strokeWidth={3}
          >
            {size?.toLocaleString()}
          </text>
        )}
      </g>
    </g>
  )
}

export function ChartTreemapBasic() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Treemap — Basic</CardTitle>
        <CardDescription>Category size by rectangle area</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="h-[260px] w-full aspect-auto"
        >
          <Treemap
            data={chartData}
            dataKey="size"
            nameKey="name"
            // Recharts' own tween animates width/height, which lays out and
            // paints every frame. The node does its own transform/opacity one.
            isAnimationActive={false}
            content={<TreemapNode />}
          >
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          </Treemap>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

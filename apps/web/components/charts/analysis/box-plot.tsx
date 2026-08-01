"use client"

import * as React from "react"
import {
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  useXAxisScale,
  useYAxisScale,
} from "recharts"

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

type BoxStats = {
  category: string
  min: number
  q1: number
  median: number
  q3: number
  max: number
}

const chartData: BoxStats[] = [
  { category: "Frontend", min: 12, q1: 28, median: 41, q3: 55, max: 78 },
  { category: "Backend", min: 18, q1: 35, median: 48, q3: 62, max: 90 },
  { category: "Mobile", min: 8, q1: 22, median: 33, q3: 47, max: 70 },
  { category: "Data", min: 20, q1: 40, median: 58, q3: 72, max: 95 },
]

const chartConfig = {
  box: {
    label: "IQR",
    color: "var(--chart-1)",
  },
  median: {
    label: "Median",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

/** Boxes open from the median, one category after the next. */
const STAGGER_MS = 70

/**
 * Recharts has no built-in box plot. Whiskers, IQR box and median are drawn
 * in a custom layer via useXAxisScale / useYAxisScale (Recharts 3.8+).
 */
function BoxPlotShapes({
  data,
  active,
  onActivate,
}: {
  data: BoxStats[]
  active: string | null
  onActivate: (category: string | null) => void
}) {
  const xScale = useXAxisScale()
  const yScale = useYAxisScale()

  if (!xScale || !yScale) return null

  const bandWidth = 40

  return (
    <g>
      {data.map((d, index) => {
        const cx = xScale(d.category, { position: "middle" })
        const yMin = yScale(d.min)
        const yQ1 = yScale(d.q1)
        const yMed = yScale(d.median)
        const yQ3 = yScale(d.q3)
        const yMax = yScale(d.max)

        if (
          cx == null ||
          yMin == null ||
          yQ1 == null ||
          yMed == null ||
          yQ3 == null ||
          yMax == null
        ) {
          return null
        }

        const boxLeft = cx - bandWidth / 2
        const boxHeight = Math.abs(yQ1 - yQ3)
        const capHalf = bandWidth / 4
        const faded = active != null && active !== d.category
        const isActive = active === d.category

        return (
          <g
            key={d.category}
            // Anchored on the median so the box opens outward from it,
            // which is the value the reader is looking for first.
            style={{
              transformOrigin: `${cx}px ${yMed}px`,
              animationDelay: `${index * STAGGER_MS}ms`,
            }}
            className="animate-in fade-in zoom-in-50 fill-mode-backwards duration-[500ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:animate-none"
          >
            <g
              onMouseEnter={() => onActivate(d.category)}
              onMouseLeave={() => onActivate(null)}
              className="cursor-pointer transition-opacity duration-150 ease-out motion-reduce:transition-none"
              opacity={faded ? 0.35 : 1}
            >
              {/* Whole-column hit area, so the thin whiskers are still reachable. */}
              <rect
                x={boxLeft}
                y={Math.min(yMax, yMin)}
                width={bandWidth}
                height={Math.abs(yMin - yMax) || 1}
                fill="transparent"
              />
              <line
                x1={cx}
                x2={cx}
                y1={yMax}
                y2={yMin}
                stroke="var(--color-box)"
                strokeWidth={1.5}
                strokeLinecap="round"
              />
              {[yMax, yMin].map((cap) => (
                <line
                  key={cap}
                  x1={cx - capHalf}
                  x2={cx + capHalf}
                  y1={cap}
                  y2={cap}
                  stroke="var(--color-box)"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                />
              ))}
              <rect
                x={boxLeft}
                y={Math.min(yQ1, yQ3)}
                width={bandWidth}
                height={boxHeight || 1}
                fill="var(--color-box)"
                fillOpacity={isActive ? 0.45 : 0.28}
                stroke="var(--color-box)"
                strokeWidth={1.5}
                rx={3}
                className="transition-[fill-opacity] duration-150 ease-out motion-reduce:transition-none"
              />
              {/* Median sits above the box fill and overhangs it, so it stays
                  legible against the IQR band. */}
              <line
                x1={boxLeft - 2}
                x2={boxLeft + bandWidth + 2}
                y1={yMed}
                y2={yMed}
                stroke="var(--color-median)"
                strokeWidth={2.5}
                strokeLinecap="round"
              />
              {isActive && (
                <text
                  x={cx + bandWidth / 2 + 8}
                  y={yMed}
                  dominantBaseline="middle"
                  stroke="var(--card)"
                  strokeWidth={3}
                  className="pointer-events-none fill-foreground text-[11px] font-medium tabular-nums [paint-order:stroke]"
                >
                  {d.median}
                </text>
              )}
            </g>
          </g>
        )
      })}
    </g>
  )
}

export function ChartBoxPlot() {
  const [active, setActive] = React.useState<string | null>(null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Box Plot</CardTitle>
        <CardDescription>Cycle time by team (hours)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[260px] w-full">
          <ComposedChart
            accessibilityLayer
            data={chartData}
            // Boxes are 40 wide; without room the outer two crowd the axes.
            margin={{ left: 12, right: 32, top: 12, bottom: 8 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="category"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              // Band centres otherwise land on the plot edges, cutting the
              // first and last box in half.
              padding={{ left: 28, right: 28 }}
            />
            <YAxis
              type="number"
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(_value, _name, item) => {
                    const p = item?.payload as BoxStats | undefined
                    if (!p) return null
                    return (
                      <div className="space-y-0.5 text-xs">
                        <div>min {p.min}</div>
                        <div>q1 {p.q1}</div>
                        <div>median {p.median}</div>
                        <div>q3 {p.q3}</div>
                        <div>max {p.max}</div>
                      </div>
                    )
                  }}
                />
              }
            />
            {/* Invisible binder series for tooltip / category domain */}
            <Line
              dataKey="median"
              stroke="transparent"
              dot={false}
              legendType="none"
              isAnimationActive={false}
            />
            <BoxPlotShapes
              data={chartData}
              active={active}
              onActivate={setActive}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

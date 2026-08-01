"use client"

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

/**
 * Recharts has no built-in box plot. We draw whiskers + IQR box + median
 * with a custom layer using useXAxisScale / useYAxisScale (Recharts 3.8+).
 */
function BoxPlotShapes({ data }: { data: BoxStats[] }) {
  const xScale = useXAxisScale()
  const yScale = useYAxisScale()

  if (!xScale || !yScale) return null

  const bandWidth = 40

  return (
    <g>
      {data.map((d) => {
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

        return (
          <g key={d.category}>
            <line
              x1={cx}
              x2={cx}
              y1={yMax}
              y2={yMin}
              stroke="var(--color-box)"
              strokeWidth={1.5}
            />
            <line
              x1={cx - bandWidth / 4}
              x2={cx + bandWidth / 4}
              y1={yMax}
              y2={yMax}
              stroke="var(--color-box)"
              strokeWidth={1.5}
            />
            <line
              x1={cx - bandWidth / 4}
              x2={cx + bandWidth / 4}
              y1={yMin}
              y2={yMin}
              stroke="var(--color-box)"
              strokeWidth={1.5}
            />
            <rect
              x={boxLeft}
              y={Math.min(yQ1, yQ3)}
              width={bandWidth}
              height={boxHeight || 1}
              fill="var(--color-box)"
              fillOpacity={0.35}
              stroke="var(--color-box)"
              strokeWidth={1.5}
              rx={2}
            />
            <line
              x1={boxLeft}
              x2={boxLeft + bandWidth}
              y1={yMed}
              y2={yMed}
              stroke="var(--color-median)"
              strokeWidth={2}
            />
          </g>
        )
      })}
    </g>
  )
}

export function ChartBoxPlot() {
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
            margin={{ left: 12, right: 12, top: 8, bottom: 8 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="category"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
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
            <BoxPlotShapes data={chartData} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

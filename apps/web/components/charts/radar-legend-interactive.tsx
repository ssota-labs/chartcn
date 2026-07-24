"use client"

import * as React from "react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import { Button } from "@/components/ui/button"
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
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
} satisfies ChartConfig

type SeriesKey = keyof typeof chartConfig

export function ChartRadarLegendInteractive() {
  const [visible, setVisible] = React.useState<Record<SeriesKey, boolean>>({
    desktop: true,
    mobile: true,
  })

  const toggle = (key: SeriesKey) => {
    setVisible((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      if (!next.desktop && !next.mobile) return prev
      return next
    })
  }

  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle>Radar Chart — Interactive Legend</CardTitle>
        <CardDescription>Toggle series from the legend</CardDescription>
        <div className="flex gap-2 pt-2">
          {(Object.keys(chartConfig) as SeriesKey[]).map((key) => (
            <Button
              key={key}
              size="xs"
              variant={visible[key] ? "default" : "outline"}
              onClick={() => toggle(key)}
              aria-pressed={visible[key]}
            >
              <span
                className="size-2 rounded-sm"
                style={{ backgroundColor: `var(--color-${key})` }}
              />
              {chartConfig[key].label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <PolarAngleAxis dataKey="month" />
            <PolarGrid />
            {visible.desktop ? (
              <Radar
                dataKey="desktop"
                fill="var(--color-desktop)"
                fillOpacity={0.6}
              />
            ) : null}
            {visible.mobile ? (
              <Radar
                dataKey="mobile"
                fill="var(--color-mobile)"
                fillOpacity={0.4}
              />
            ) : null}
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

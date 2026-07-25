"use client"

import type { CSSProperties } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { type ChartConfig } from "@/components/ui/chart"
import { cn } from "@/lib/utils"

const periods = ["Week 0", "Week 1", "Week 2", "Week 3", "Week 4", "Week 5"] as const

const cohortData = [
  { cohort: "Jan 6", size: 1240, retention: [100, 42, 31, 24, 19, 16] },
  { cohort: "Jan 13", size: 1380, retention: [100, 45, 33, 26, 21, 17] },
  { cohort: "Jan 20", size: 1510, retention: [100, 48, 36, 28, 22, null] },
  { cohort: "Jan 27", size: 1620, retention: [100, 44, 32, 25, null, null] },
  { cohort: "Feb 3", size: 1490, retention: [100, 46, 34, null, null, null] },
  { cohort: "Feb 10", size: 1710, retention: [100, 49, null, null, null, null] },
]

const chartConfig = {
  retention: { label: "Retention %", color: "var(--chart-1)" },
} satisfies ChartConfig

function retentionColor(value: number | null) {
  if (value == null) return "transparent"
  const t = Math.min(1, Math.max(0, value / 100))
  return `color-mix(in oklab, var(--chart-1) ${Math.round(t * 100)}%, transparent)`
}

export function ChartCohortHeatmap() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cohort Heatmap</CardTitle>
        <CardDescription>Signup cohort × weekly retention</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          data-slot="chart"
          className="w-full overflow-x-auto text-xs"
          style={
            {
              "--color-retention": "var(--chart-1)",
            } as CSSProperties
          }
        >
          <div
            className="grid min-w-[520px] gap-1"
            style={{
              gridTemplateColumns: `7rem repeat(${periods.length}, minmax(3.5rem, 1fr))`,
            }}
          >
            <div className="text-muted-foreground flex items-end pb-1 font-medium">
              Cohort
            </div>
            {periods.map((period) => (
              <div
                key={period}
                className="text-muted-foreground flex items-end justify-center pb-1 font-medium"
              >
                {period}
              </div>
            ))}
            {cohortData.map((row) => (
              <div key={row.cohort} className="contents">
                <div className="flex flex-col justify-center pr-2">
                  <span className="font-medium">{row.cohort}</span>
                  <span className="text-muted-foreground">{row.size} users</span>
                </div>
                {row.retention.map((value, index) => (
                  <div
                    key={`${row.cohort}-${periods[index]}`}
                    className={cn(
                      "flex h-12 items-center justify-center rounded-md border border-transparent",
                      value == null && "bg-muted/30 text-muted-foreground/40"
                    )}
                    style={{ backgroundColor: retentionColor(value) }}
                    title={
                      value == null
                        ? "Not yet matured"
                        : `${row.cohort} · ${periods[index]}: ${value}%`
                    }
                  >
                    <span
                      className={cn(
                        "font-medium tabular-nums",
                        value != null && value >= 50
                          ? "text-primary-foreground"
                          : "text-foreground"
                      )}
                    >
                      {value == null ? "—" : `${value}%`}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <p className="text-muted-foreground mt-3 sr-only">
            {chartConfig.retention.label}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

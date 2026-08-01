"use client"

import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { type ChartConfig } from "@/components/ui/chart"
import { cn } from "@/lib/utils"

const weeks = 12
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const

function seeded(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

const cells = Array.from({ length: weeks * 7 }, (_, i) => {
  const week = Math.floor(i / 7)
  const day = i % 7
  const value = Math.floor(seeded(i + 3) * 8)
  return { week, day, value, label: `${days[day]} W${week + 1}` }
})

const chartConfig = {
  activity: {
    label: "Commits",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

function cellColor(value: number) {
  if (value === 0) return "color-mix(in oklch, var(--muted) 80%, transparent)"
  const opacity = 0.2 + (value / 7) * 0.8
  return `color-mix(in oklch, var(--chart-1) ${Math.round(opacity * 100)}%, transparent)`
}

/**
 * Calendar heatmaps are not a Recharts primitive. This demo uses a CSS grid
 * styled with chart tokens so it matches ChartContainer theming.
 */
export function ChartHeatmapCalendar() {
  void chartConfig
  const [hovered, setHovered] = React.useState<(typeof cells)[number] | null>(
    null
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Heatmap — Calendar</CardTitle>
        <CardDescription>Commit activity (last 12 weeks)</CardDescription>
      </CardHeader>
      <CardContent>
        {/* A readout beats a floating tooltip on a grid this dense — it never
            covers neighbouring cells, and it holds a slot so the layout does
            not shift when it fills. */}
        <div className="mb-3 h-5 text-xs">
          {hovered ? (
            <span className="text-foreground">
              <span className="font-medium">{hovered.label}</span>
              <span className="text-muted-foreground">
                {" · "}
                {hovered.value} {hovered.value === 1 ? "commit" : "commits"}
              </span>
            </span>
          ) : (
            <span className="text-muted-foreground">
              Hover a day for its count
            </span>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto">
          <div className="flex flex-col justify-between py-1 text-[10px] text-muted-foreground">
            {days.map((d) => (
              <span key={d}>{d.slice(0, 1)}</span>
            ))}
          </div>
          <div
            className="grid grid-flow-col gap-1"
            style={{
              gridTemplateRows: `repeat(7, minmax(0, 1fr))`,
              gridAutoColumns: "12px",
            }}
            onMouseLeave={() => setHovered(null)}
          >
            {cells.map((c) => (
              <button
                key={`${c.week}-${c.day}`}
                type="button"
                aria-label={`${c.label}: ${c.value} commits`}
                onMouseEnter={() => setHovered(c)}
                onFocus={() => setHovered(c)}
                onBlur={() => setHovered(null)}
                // Diagonal delay, so the grid fills from the top-left corner
                // outward instead of every cell landing at once.
                style={{
                  background: cellColor(c.value),
                  animationDelay: `${(c.week + c.day) * 18}ms`,
                }}
                className={cn(
                  "size-3 rounded-[2px] outline-none",
                  "animate-in fade-in zoom-in-50 fill-mode-backwards duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:animate-none",
                  "transition-[scale,box-shadow] duration-100 ease-out motion-reduce:transition-none",
                  "hover:scale-125 focus-visible:scale-125",
                  "hover:ring-1 hover:ring-foreground/40 focus-visible:ring-1 focus-visible:ring-ring"
                )}
              />
            ))}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1 text-[10px] text-muted-foreground">
          <span>Less</span>
          {[0, 2, 4, 6, 7].map((v) => (
            <span
              key={v}
              className="size-3 rounded-[2px]"
              style={{ background: cellColor(v) }}
            />
          ))}
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CanvasChart, drawdown } from "./canvas-chart"
import { MARKET_BAR_MS, useMarketSeries } from "./market-series"

/** Equity on the price scale, with the underwater curve in its own pane. */
export function ChartDrawdown() {
  const { bars, closes } = useMarketSeries()
  const price = React.useMemo(
    () => ({ kind: "line" as const, token: "--chart-1", values: closes }),
    [closes]
  )
  const panes = React.useMemo(
    () => [
      {
        id: "dd",
        label: "Drawdown %",
        share: 0.32,
        guides: [0],
        items: [
          {
            kind: "area" as const,
            token: "--chart-5",
            values: drawdown(closes),
            baseline: 0,
          },
        ],
      },
    ],
    [closes]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Drawdown</CardTitle>
        <CardDescription>
          Underwater equity from the running peak
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CanvasChart
          bars={bars}
          barMs={MARKET_BAR_MS}
          price={price}
          panes={panes}
        />
      </CardContent>
    </Card>
  )
}

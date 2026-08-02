"use client"

import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CanvasChart, sma } from "./canvas-chart"
import { MARKET_BAR_MS, useMarketSeries } from "./market-series"

/** Moving averages ride the price scale, so the extent has to include them. */
export function ChartMovingAverage() {
  const { bars, closes } = useMarketSeries()
  const overlays = React.useMemo(
    () => [
      {
        kind: "line" as const,
        label: "MA 20",
        token: "--chart-1",
        values: sma(closes, 20),
      },
      {
        kind: "line" as const,
        label: "MA 50",
        token: "--chart-4",
        values: sma(closes, 50),
      },
    ],
    [closes]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Moving average overlay</CardTitle>
        <CardDescription>SMA 20 and 50 on the price scale</CardDescription>
      </CardHeader>
      <CardContent>
        <CanvasChart bars={bars} barMs={MARKET_BAR_MS} overlays={overlays} />
      </CardContent>
    </Card>
  )
}

"use client"

import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CanvasChart, supertrend } from "./canvas-chart"
import { MARKET_BAR_MS, useMarketSeries } from "./market-series"

/** One line, two colours: the run breaks and flips where the trend does. */
export function ChartSupertrend() {
  const { bars } = useMarketSeries()
  const overlays = React.useMemo(() => {
    const { line, dir } = supertrend(bars, 10, 3)
    return [
      {
        kind: "line" as const,
        label: "Supertrend",
        token: "--chart-2",
        tokenDown: "--chart-5",
        values: line,
        sign: dir,
      },
    ]
  }, [bars])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supertrend</CardTitle>
        <CardDescription>ATR envelope that flips side with trend</CardDescription>
      </CardHeader>
      <CardContent>
        <CanvasChart bars={bars} barMs={MARKET_BAR_MS} overlays={overlays} />
      </CardContent>
    </Card>
  )
}

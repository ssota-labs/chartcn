"use client"

import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CanvasChart, sma, stddev } from "./canvas-chart"
import { MARKET_BAR_MS, useMarketSeries } from "./market-series"

/**
 * The clearest case for widening the price extent with overlay values: the
 * bands routinely sit outside the visible high and low.
 */
export function ChartBollinger() {
  const { bars, closes } = useMarketSeries()
  const overlays = React.useMemo(() => {
    const mid = sma(closes, 20)
    const sd = stddev(closes, 20)
    const upper = mid.map((m, i) =>
      m == null || sd[i] == null ? null : m + 2 * sd[i]!
    )
    const lower = mid.map((m, i) =>
      m == null || sd[i] == null ? null : m - 2 * sd[i]!
    )
    return [
      { kind: "band" as const, label: "BB 20", token: "--chart-1", upper, lower },
      { kind: "line" as const, label: "SMA 20", token: "--chart-4", values: mid },
    ]
  }, [closes])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bollinger bands</CardTitle>
        <CardDescription>SMA 20 with a ±2σ envelope</CardDescription>
      </CardHeader>
      <CardContent>
        <CanvasChart bars={bars} barMs={MARKET_BAR_MS} overlays={overlays} />
      </CardContent>
    </Card>
  )
}

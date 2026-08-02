"use client"

import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CanvasChart, ichimoku } from "./canvas-chart"
import { MARKET_BAR_MS, useMarketSeries } from "./market-series"

/**
 * The cloud is the reason the band mark grew a second colour: span A and B
 * cross, and which one is on top is the signal.
 */
export function ChartIchimoku() {
  const { bars } = useMarketSeries()
  const overlays = React.useMemo(() => {
    const { tenkan, kijun, spanA, spanB } = ichimoku(bars)
    return [
      {
        kind: "band" as const,
        label: "Cloud",
        token: "--chart-2",
        tokenDown: "--chart-5",
        upper: spanA,
        lower: spanB,
      },
      {
        kind: "line" as const,
        label: "Tenkan",
        token: "--chart-1",
        values: tenkan,
      },
      {
        kind: "line" as const,
        label: "Kijun",
        token: "--chart-4",
        values: kijun,
      },
    ]
  }, [bars])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ichimoku cloud</CardTitle>
        <CardDescription>
          Cloud colour follows which span is on top
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CanvasChart bars={bars} barMs={MARKET_BAR_MS} overlays={overlays} />
      </CardContent>
    </Card>
  )
}

"use client"

import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CanvasChart, vwap } from "./canvas-chart"
import { MARKET_BAR_MS, useMarketSeries } from "./market-series"

/** VWAP rides the price scale, so the extent scan has to include it. */
export function ChartVwap() {
  const { bars } = useMarketSeries()
  const overlays = React.useMemo(
    () => [
      {
        kind: "line" as const,
        label: "VWAP",
        token: "--chart-4",
        values: vwap(bars),
      },
    ],
    [bars]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>VWAP</CardTitle>
        <CardDescription>
          Volume-weighted average price, re-anchored each session
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CanvasChart bars={bars} barMs={MARKET_BAR_MS} overlays={overlays} />
      </CardContent>
    </Card>
  )
}

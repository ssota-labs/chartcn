"use client"

import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CanvasChart, psar } from "./canvas-chart"
import { MARKET_BAR_MS, useMarketSeries } from "./market-series"

/** Dots rather than a line — the stop is a level per bar, not a curve. */
export function ChartPsar() {
  const { bars } = useMarketSeries()
  const overlays = React.useMemo(() => {
    const { values, dir } = psar(bars)
    return [
      {
        kind: "points" as const,
        label: "SAR",
        token: "--chart-2",
        tokenDown: "--chart-5",
        values,
        sign: dir,
      },
    ]
  }, [bars])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parabolic SAR</CardTitle>
        <CardDescription>
          Stop-and-reverse dots, accelerating toward price
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CanvasChart bars={bars} barMs={MARKET_BAR_MS} overlays={overlays} />
      </CardContent>
    </Card>
  )
}

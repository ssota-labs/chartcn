"use client"

import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CanvasChart } from "./canvas-chart"
import { MARKET_BAR_MS, useMarketSeries } from "./market-series"

/**
 * Range bars rather than candles: the high–low span with a close tick, which
 * reads better than a body when open and close matter less than the range.
 */
export function ChartHighLow() {
  const { bars } = useMarketSeries()
  const price = React.useMemo(() => ({ kind: "range" as const }), [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>High–low range</CardTitle>
        <CardDescription>Daily range with a close marker</CardDescription>
      </CardHeader>
      <CardContent>
        <CanvasChart bars={bars} barMs={MARKET_BAR_MS} price={price} />
      </CardContent>
    </Card>
  )
}

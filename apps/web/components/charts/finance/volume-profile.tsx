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
 * The one chart whose mark is recomputed every frame — the profile describes
 * the visible window, so panning changes the answer.
 */
export function ChartVolumeProfile() {
  const { bars } = useMarketSeries()
  const profile = React.useMemo(
    () => ({ token: "--chart-3", buckets: 48, widthPct: 0.24 }),
    []
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Volume profile</CardTitle>
        <CardDescription>
          Volume by price level across whatever is on screen
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CanvasChart bars={bars} barMs={MARKET_BAR_MS} profile={profile} />
      </CardContent>
    </Card>
  )
}

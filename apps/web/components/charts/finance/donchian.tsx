"use client"

import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CanvasChart, donchian } from "./canvas-chart"
import { MARKET_BAR_MS, useMarketSeries } from "./market-series"

/** A channel drawn straight from the data: the window's own high and low. */
export function ChartDonchian() {
  const { bars } = useMarketSeries()
  const overlays = React.useMemo(() => {
    const { upper, lower } = donchian(bars, 20)
    return [
      {
        kind: "band" as const,
        label: "Donchian 20",
        token: "--chart-2",
        upper,
        lower,
      },
    ]
  }, [bars])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Donchian channel</CardTitle>
        <CardDescription>Rolling 20-bar high and low</CardDescription>
      </CardHeader>
      <CardContent>
        <CanvasChart bars={bars} barMs={MARKET_BAR_MS} overlays={overlays} />
      </CardContent>
    </Card>
  )
}

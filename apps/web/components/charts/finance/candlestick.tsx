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
 * The reference market chart: candles plus a volume pane, over a series long
 * enough that the viewport matters.
 */
export function ChartCandlestick() {
  const { bars } = useMarketSeries()
  const panes = React.useMemo(
    () => [
      {
        id: "vol",
        label: "Volume",
        share: 0.22,
        items: [
          {
            kind: "hist" as const,
            values: bars.map((b) => b.v),
            color: "updown" as const,
          },
        ],
      },
    ],
    [bars]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>OHLC / Candlestick</CardTitle>
        <CardDescription>
          {bars.length.toLocaleString()} 1-minute bars · drag to pan, wheel to
          zoom
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CanvasChart bars={bars} barMs={MARKET_BAR_MS} panes={panes} />
      </CardContent>
    </Card>
  )
}

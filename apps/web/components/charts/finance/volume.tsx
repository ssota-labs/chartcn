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

/** Volume gets the emphasis here: a taller pane under a compact price area. */
export function ChartVolumeUnderPrice() {
  const { bars } = useMarketSeries()
  const panes = React.useMemo(
    () => [
      {
        id: "vol",
        label: "Volume",
        share: 0.4,
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
        <CardTitle>Volume under price</CardTitle>
        <CardDescription>
          Volume keeps its own scale — it shares nothing with the price axis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CanvasChart bars={bars} barMs={MARKET_BAR_MS} panes={panes} />
      </CardContent>
    </Card>
  )
}

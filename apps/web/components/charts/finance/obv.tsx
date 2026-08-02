"use client"

import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CanvasChart, obv } from "./canvas-chart"
import { MARKET_BAR_MS, useMarketSeries } from "./market-series"

/**
 * The level is arbitrary — OBV is read by its slope — so the pane derives its
 * extent from whatever is in view rather than anchoring at zero.
 */
export function ChartObv() {
  const { bars } = useMarketSeries()
  const panes = React.useMemo(
    () => [
      {
        id: "obv",
        label: "OBV",
        share: 0.3,
        items: [
          {
            kind: "area" as const,
            token: "--chart-2",
            values: obv(bars),
            baseline: 0,
          },
        ],
      },
    ],
    [bars]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>On-balance volume</CardTitle>
        <CardDescription>
          Volume accumulated with the sign of each bar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CanvasChart bars={bars} barMs={MARKET_BAR_MS} panes={panes} />
      </CardContent>
    </Card>
  )
}

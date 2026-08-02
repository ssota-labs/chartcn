"use client"

import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CanvasChart, atr } from "./canvas-chart"
import { MARKET_BAR_MS, useMarketSeries } from "./market-series"

/** Volatility in price units, so it needs its own scale rather than a domain. */
export function ChartAtr() {
  const { bars } = useMarketSeries()
  const panes = React.useMemo(
    () => [
      {
        id: "atr",
        label: "ATR 14",
        share: 0.28,
        items: [
          { kind: "line" as const, token: "--chart-3", values: atr(bars, 14) },
        ],
      },
    ],
    [bars]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Average true range</CardTitle>
        <CardDescription>
          Wilder-smoothed volatility, including gaps from the prior close
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CanvasChart bars={bars} barMs={MARKET_BAR_MS} panes={panes} />
      </CardContent>
    </Card>
  )
}

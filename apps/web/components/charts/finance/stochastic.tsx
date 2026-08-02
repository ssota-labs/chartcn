"use client"

import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CanvasChart, stochastic } from "./canvas-chart"
import { MARKET_BAR_MS, useMarketSeries } from "./market-series"

/** Bounded 0–100 like RSI, so the pane pins its domain and the guides hold. */
export function ChartStochastic() {
  const { bars } = useMarketSeries()
  const panes = React.useMemo(() => {
    const { k, d } = stochastic(bars, 14, 3)
    return [
      {
        id: "stoch",
        label: "Stochastic 14/3",
        share: 0.32,
        domain: [0, 100] as [number, number],
        guides: [20, 80],
        items: [
          { kind: "line" as const, token: "--chart-1", values: k },
          { kind: "line" as const, token: "--chart-4", values: d },
        ],
      },
    ]
  }, [bars])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stochastic oscillator</CardTitle>
        <CardDescription>
          %K against its own %D average, with 20/80 bands
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CanvasChart bars={bars} barMs={MARKET_BAR_MS} panes={panes} />
      </CardContent>
    </Card>
  )
}

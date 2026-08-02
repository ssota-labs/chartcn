"use client"

import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CanvasChart, macd, rsi } from "./canvas-chart"
import { MARKET_BAR_MS, useMarketSeries } from "./market-series"

/**
 * Two indicators that cannot share the price axis: RSI is bounded 0–100 and
 * MACD is centred on zero. Each gets its own pane and its own scale.
 */
export function ChartMacdRsi() {
  const { bars, closes } = useMarketSeries()
  const panes = React.useMemo(() => {
    const m = macd(closes)
    return [
      {
        id: "macd",
        label: "MACD 12/26/9",
        share: 0.24,
        guides: [0],
        items: [
          { kind: "hist" as const, values: m.hist, color: "sign" as const },
          { kind: "line" as const, token: "--chart-1", values: m.line },
          { kind: "line" as const, token: "--chart-4", values: m.signal },
        ],
      },
      {
        id: "rsi",
        label: "RSI 14",
        share: 0.24,
        domain: [0, 100] as [number, number],
        guides: [30, 70],
        items: [
          { kind: "line" as const, token: "--chart-3", values: rsi(closes) },
        ],
      },
    ]
  }, [closes])

  return (
    <Card>
      <CardHeader>
        <CardTitle>MACD / RSI panels</CardTitle>
        <CardDescription>
          Bounded and zero-centred indicators, each on its own scale
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CanvasChart
          bars={bars}
          barMs={MARKET_BAR_MS}
          panes={panes}
          height={460}
        />
      </CardContent>
    </Card>
  )
}

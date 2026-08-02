"use client"

import * as React from "react"

import type { Bar } from "./canvas-chart"

/**
 * Deterministic OHLCV series shared by the market charts, long enough that
 * panning and zooming have somewhere to go.
 */

export const MARKET_BAR_COUNT = 20_000
export const MARKET_BAR_MS = 60_000

function seeded(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

export function buildMarketSeries(): Bar[] {
  const out: Bar[] = new Array(MARKET_BAR_COUNT)
  const start = Date.UTC(2026, 0, 1)
  let close = 42_000
  for (let i = 0; i < MARKET_BAR_COUNT; i++) {
    const trend = Math.sin(i / 900) * 60 + Math.sin(i / 130) * 18
    // An occasional shock keeps the series from looking like pure noise.
    const shock = seeded(i) > 0.997 ? (seeded(i * 3) - 0.5) * 900 : 0
    const open = close
    close = open + trend * 0.03 + (seeded(i * 7) - 0.5) * 26 + shock
    const wick = 6 + seeded(i * 11) * 30
    out[i] = {
      t: start + i * MARKET_BAR_MS,
      o: open,
      c: close,
      h: Math.max(open, close) + wick * seeded(i * 13),
      l: Math.min(open, close) - wick * seeded(i * 17),
      v: 40 + seeded(i * 19) * 260 + Math.abs(close - open) * 4,
    }
  }
  return out
}

/** Built once per mount; every market chart derives its indicators from this. */
export function useMarketSeries() {
  return React.useState(() => {
    const bars = buildMarketSeries()
    return { bars, closes: bars.map((b) => b.c) }
  })[0]
}

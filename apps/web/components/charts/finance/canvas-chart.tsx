"use client"

import * as React from "react"

/**
 * Canvas chart engine for the market charts.
 *
 * Recharts is a poor fit for these: one DOM node per mark, and no notion of a
 * viewport you can pan or zoom. Here the series can be tens of thousands of
 * bars and only the visible slice is drawn, so cost tracks the window rather
 * than the dataset.
 *
 * Everything — grid, axes, marks, crosshair readouts — is painted onto one
 * canvas, so panning and zooming cause no React renders at all.
 */

export type Bar = {
  /** Epoch ms. */
  t: number
  o: number
  h: number
  l: number
  c: number
  v: number
}

/** A series drawn against the price scale. */
export type PriceSpec =
  | { kind: "candles" }
  | { kind: "line"; token: string; values: (number | null)[] }
  | { kind: "range" }

/** Drawn in the price pane, sharing the price scale. */
export type Overlay =
  | {
      kind: "line"
      label: string
      token: string
      values: (number | null)[]
      dash?: number[]
    }
  | {
      kind: "band"
      label: string
      token: string
      upper: (number | null)[]
      lower: (number | null)[]
    }

export type PaneItem =
  | {
      kind: "hist"
      values: (number | null)[]
      /** `sign` colours by value, `updown` by the bar's direction. */
      color: "sign" | "updown" | string
    }
  | { kind: "line"; token: string; values: (number | null)[] }
  | { kind: "area"; token: string; values: (number | null)[]; baseline?: number }

export type Pane = {
  id: string
  label?: string
  /** Fraction of the plot height. */
  share: number
  /** Fixed scale, for bounded indicators like RSI. */
  domain?: [number, number]
  /** Horizontal reference lines, e.g. 0 for MACD or 30/70 for RSI. */
  guides?: number[]
  items: PaneItem[]
}

export type CanvasChartProps = {
  bars: Bar[]
  /** Spacing between bars, used for the time axis. */
  barMs: number
  price?: PriceSpec
  overlays?: Overlay[]
  panes?: Pane[]
  defaultBars?: number
  height?: number
  format?: (n: number) => string
}

/* ------------------------------------------------------------ indicators */

/**
 * These run once over the whole series, never per frame. SMA(20) at the left
 * edge of the viewport needs the 19 bars before it, so deriving an indicator
 * from the visible slice alone would give a different line at every scroll
 * position.
 */

/** Rolling sum keeps this O(n) rather than O(n·period). */
export function sma(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = new Array(values.length).fill(null)
  let sum = 0
  for (let i = 0; i < values.length; i++) {
    sum += values[i]
    if (i >= period) sum -= values[i - period]
    if (i >= period - 1) out[i] = sum / period
  }
  return out
}

export function ema(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = new Array(values.length).fill(null)
  const k = 2 / (period + 1)
  let prev = 0
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) {
      prev += values[i]
      continue
    }
    if (i === period - 1) {
      prev = (prev + values[i]) / period
    } else {
      prev = values[i] * k + prev * (1 - k)
    }
    out[i] = prev
  }
  return out
}

/** Rolling standard deviation over the same window as the SMA. */
export function stddev(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = new Array(values.length).fill(null)
  const mean = sma(values, period)
  for (let i = period - 1; i < values.length; i++) {
    const m = mean[i]!
    let acc = 0
    for (let k = i - period + 1; k <= i; k++) acc += (values[k] - m) ** 2
    out[i] = Math.sqrt(acc / period)
  }
  return out
}

/** Wilder's smoothing, which is what makes this RSI and not a plain average. */
export function rsi(values: number[], period = 14): (number | null)[] {
  const out: (number | null)[] = new Array(values.length).fill(null)
  let gain = 0
  let loss = 0
  for (let i = 1; i < values.length; i++) {
    const d = values[i] - values[i - 1]
    const g = Math.max(0, d)
    const l = Math.max(0, -d)
    if (i <= period) {
      gain += g
      loss += l
      if (i === period) {
        gain /= period
        loss /= period
        out[i] = loss === 0 ? 100 : 100 - 100 / (1 + gain / loss)
      }
      continue
    }
    gain = (gain * (period - 1) + g) / period
    loss = (loss * (period - 1) + l) / period
    out[i] = loss === 0 ? 100 : 100 - 100 / (1 + gain / loss)
  }
  return out
}

export function macd(values: number[], fast = 12, slow = 26, signal = 9) {
  const f = ema(values, fast)
  const s = ema(values, slow)
  const line = values.map((_, i) =>
    f[i] == null || s[i] == null ? null : f[i]! - s[i]!
  )
  const defined = line.map((v) => v ?? 0)
  const sig = ema(defined, signal).map((v, i) => (line[i] == null ? null : v))
  const hist = line.map((v, i) =>
    v == null || sig[i] == null ? null : v - sig[i]!
  )
  return { line, signal: sig, hist }
}

/** Percentage below the running peak. Always ≤ 0. */
export function drawdown(values: number[]): number[] {
  let peak = -Infinity
  return values.map((v) => {
    if (v > peak) peak = v
    return peak > 0 ? ((v - peak) / peak) * 100 : 0
  })
}

/* ------------------------------------------------------------ formatting */

/**
 * Tick steps a reader expects — 1, 2, 5 and their decades. Dividing a range
 * into equal parts gives values like 137.4, which nobody scans.
 */
function niceTicks(min: number, max: number, target: number): number[] {
  if (!(max > min)) return [min]
  const raw = (max - min) / target
  const mag = 10 ** Math.floor(Math.log10(raw))
  const norm = raw / mag
  const step = (norm >= 5 ? 10 : norm >= 2 ? 5 : norm >= 1 ? 2 : 1) * mag
  const out: number[] = []
  for (let v = Math.ceil(min / step) * step; v <= max; v += step) out.push(v)
  return out
}

const TIME_STEPS_MS = [
  60_000, 5 * 60_000, 15 * 60_000, 30 * 60_000, 60 * 60_000, 4 * 60 * 60_000,
  12 * 60 * 60_000, 24 * 60 * 60_000, 7 * 24 * 60 * 60_000,
  30 * 24 * 60 * 60_000,
]

const p2 = (n: number) => String(n).padStart(2, "0")

function fmtTime(ms: number, step: number) {
  const d = new Date(ms)
  if (step >= 24 * 60 * 60_000) return `${d.getUTCMonth() + 1}/${d.getUTCDate()}`
  return `${p2(d.getUTCHours())}:${p2(d.getUTCMinutes())}`
}

function fmtDateTime(ms: number, barMs: number) {
  const d = new Date(ms)
  const date = `${d.getUTCFullYear()}-${p2(d.getUTCMonth() + 1)}-${p2(d.getUTCDate())}`
  if (barMs >= 24 * 60 * 60_000) return date
  return `${date} ${p2(d.getUTCHours())}:${p2(d.getUTCMinutes())}`
}

const defaultFormat = (n: number) =>
  Math.abs(n) >= 1000
    ? n.toLocaleString(undefined, { maximumFractionDigits: 0 })
    : n.toLocaleString(undefined, { maximumFractionDigits: 2 })

/* ---------------------------------------------------------------- layout */

const PRICE_AXIS_W = 62
const TIME_AXIS_H = 22
const PAD_TOP = 14
const PANE_GAP = 8

const MIN_BARS = 24
const MAX_BARS = 4000

type Palette = Record<
  "up" | "down" | "text" | "muted" | "grid" | "card",
  string
>

/* ------------------------------------------------------------- component */

export function CanvasChart({
  bars,
  barMs,
  price = { kind: "candles" },
  overlays = [],
  panes = [],
  defaultBars = 180,
  height = 380,
  format = defaultFormat,
}: CanvasChartProps) {
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  // Interaction state lives in refs: none of it should trigger a re-render.
  const view = React.useRef({
    offset: Math.max(0, bars.length - defaultBars),
    bars: Math.min(defaultBars, bars.length),
  })
  const pointer = React.useRef({ x: 0, y: 0, inside: false })
  const drag = React.useRef<{ x: number; offset: number } | null>(null)
  const size = React.useRef({ w: 0, h: 0 })
  const palette = React.useRef<Palette | null>(null)
  const colorCache = React.useRef(new Map<string, string>())
  const themeKey = React.useRef("")
  const frame = React.useRef(0)

  React.useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const total = bars.length
    const clampView = () => {
      const v = view.current
      v.bars = Math.max(MIN_BARS, Math.min(MAX_BARS, Math.min(total, v.bars)))
      v.offset = Math.max(0, Math.min(total - v.bars, v.offset))
    }

    /** Canvas parses lab()/oklch() directly, so tokens go straight in. */
    const color = (token: string, fallback: string) => {
      const hit = colorCache.current.get(token)
      if (hit) return hit
      const v = getComputedStyle(wrap).getPropertyValue(token).trim() || fallback
      colorCache.current.set(token, v)
      return v
    }

    function draw() {
      frame.current = 0
      const { w, h } = size.current
      if (!ctx || !w || !h) return

      const key = document.documentElement.className
      if (key !== themeKey.current || !palette.current) {
        colorCache.current.clear()
        palette.current = {
          up: color("--chart-2", "#16a34a"),
          down: color("--chart-5", "#dc2626"),
          text: color("--foreground", "#e5e5e5"),
          muted: color("--muted-foreground", "#8a8a8a"),
          grid: color("--border", "#2a2a2a"),
          card: color("--card", "#0a0a0a"),
        }
        themeKey.current = key
      }
      const c = palette.current

      const plotW = w - PRICE_AXIS_W
      const plotH = h - TIME_AXIS_H
      const paneShare = panes.reduce((s, p) => s + p.share, 0)
      const priceH = plotH * (1 - paneShare) - PAD_TOP
      const priceTop = PAD_TOP

      ctx.clearRect(0, 0, w, h)
      ctx.font = "11px ui-sans-serif, system-ui, sans-serif"
      ctx.textBaseline = "middle"

      const { offset, bars: nBars } = view.current
      const barW = plotW / nBars
      const first = Math.max(0, Math.floor(offset))
      const last = Math.min(total - 1, Math.ceil(offset + nBars))
      const xOf = (i: number) => (i - offset) * barW + barW / 2

      /* ---- price extent over the visible slice only ---- */
      let lo = Infinity
      let hi = -Infinity
      const bump = (v: number | null | undefined) => {
        if (v == null || !Number.isFinite(v)) return
        if (v < lo) lo = v
        if (v > hi) hi = v
      }
      for (let i = first; i <= last; i++) {
        const b = bars[i]
        if (price.kind === "line") bump(price.values[i])
        else {
          bump(b.h)
          bump(b.l)
        }
      }
      // Overlays share this scale, so they widen it — a band can sit outside
      // the visible high and low and would otherwise be clipped.
      for (const o of overlays) {
        for (let i = first; i <= last; i++) {
          if (o.kind === "line") bump(o.values[i])
          else {
            bump(o.upper[i])
            bump(o.lower[i])
          }
        }
      }
      if (!Number.isFinite(lo)) {
        lo = 0
        hi = 1
      }
      const pad = (hi - lo) * 0.08 || 1
      lo -= pad
      hi += pad

      const yOf = (p: number) => priceTop + ((hi - p) / (hi - lo)) * priceH
      const priceAt = (y: number) => hi - ((y - priceTop) / priceH) * (hi - lo)

      /* ---- price grid + axis ---- */
      for (const p of niceTicks(lo, hi, 5)) {
        const y = yOf(p)
        ctx.strokeStyle = c.grid
        ctx.globalAlpha = 0.5
        ctx.beginPath()
        ctx.moveTo(0, Math.round(y) + 0.5)
        ctx.lineTo(plotW, Math.round(y) + 0.5)
        ctx.stroke()
        ctx.globalAlpha = 1
        ctx.fillStyle = c.muted
        ctx.textAlign = "left"
        ctx.fillText(format(p), plotW + 6, y)
      }

      /* ---- time grid + axis ---- */
      const spanMs = nBars * barMs
      const step =
        TIME_STEPS_MS.find((s) => s >= spanMs / 6) ?? TIME_STEPS_MS.at(-1)!
      ctx.textAlign = "center"
      for (
        let t = Math.ceil(bars[first].t / step) * step;
        t <= bars[first].t + spanMs;
        t += step
      ) {
        const x = xOf((t - bars[0].t) / barMs)
        if (x < 0 || x > plotW) continue
        ctx.strokeStyle = c.grid
        ctx.globalAlpha = 0.5
        ctx.beginPath()
        ctx.moveTo(Math.round(x) + 0.5, 0)
        ctx.lineTo(Math.round(x) + 0.5, plotH)
        ctx.stroke()
        ctx.globalAlpha = 1
        ctx.fillStyle = c.muted
        ctx.fillText(fmtTime(t, step), x, plotH + TIME_AXIS_H / 2)
      }

      /* ---- overlays: bands first, so lines and marks sit on top ---- */
      for (const o of overlays) {
        if (o.kind !== "band") continue
        const col = color(o.token, c.muted)
        ctx.fillStyle = col
        ctx.globalAlpha = 0.12
        ctx.beginPath()
        let started = false
        for (let i = first; i <= last; i++) {
          const v = o.upper[i]
          if (v == null) continue
          const x = xOf(i)
          if (started) ctx.lineTo(x, yOf(v))
          else {
            ctx.moveTo(x, yOf(v))
            started = true
          }
        }
        for (let i = last; i >= first; i--) {
          const v = o.lower[i]
          if (v == null) continue
          ctx.lineTo(xOf(i), yOf(v))
        }
        ctx.closePath()
        ctx.fill()
        ctx.globalAlpha = 1
      }

      /* ---- price marks ---- */
      const bodyW = Math.max(1, barW * 0.7)
      const thin = barW < 3

      if (price.kind === "line") {
        ctx.strokeStyle = color(price.token, c.up)
        ctx.lineWidth = 1.5
        ctx.beginPath()
        let started = false
        for (let i = first; i <= last; i++) {
          const v = price.values[i]
          if (v == null) {
            started = false
            continue
          }
          const x = xOf(i)
          const y = yOf(v)
          if (started) ctx.lineTo(x, y)
          else {
            ctx.moveTo(x, y)
            started = true
          }
        }
        ctx.stroke()
        ctx.lineWidth = 1
      } else if (price.kind === "range") {
        for (let i = first; i <= last; i++) {
          const b = bars[i]
          const x = xOf(i)
          ctx.fillStyle = b.c >= b.o ? c.up : c.down
          ctx.globalAlpha = 0.45
          ctx.fillRect(x - bodyW / 2, yOf(b.h), bodyW, yOf(b.l) - yOf(b.h))
          ctx.globalAlpha = 1
          ctx.fillRect(x - bodyW / 2, yOf(b.c) - 1, bodyW, 2)
        }
      } else {
        for (let i = first; i <= last; i++) {
          const b = bars[i]
          const x = xOf(i)
          ctx.fillStyle = ctx.strokeStyle = b.c >= b.o ? c.up : c.down
          ctx.beginPath()
          ctx.moveTo(Math.round(x) + 0.5, yOf(b.h))
          ctx.lineTo(Math.round(x) + 0.5, yOf(b.l))
          ctx.stroke()
          // Below ~3px a body is illegible; the wick alone reads better.
          if (thin) continue
          const yO = yOf(b.o)
          const yC = yOf(b.c)
          ctx.fillRect(
            x - bodyW / 2,
            Math.min(yO, yC),
            bodyW,
            Math.max(1, Math.abs(yC - yO))
          )
        }
      }

      /* ---- overlay lines ---- */
      ctx.lineWidth = 1.5
      for (const o of overlays) {
        const rows =
          o.kind === "line" ? [o.values] : [o.upper, o.lower]
        ctx.strokeStyle = color(o.token, c.muted)
        if (o.kind === "line" && o.dash) ctx.setLineDash(o.dash)
        for (const row of rows) {
          ctx.beginPath()
          let started = false
          for (let i = first; i <= last; i++) {
            const v = row[i]
            if (v == null) {
              // No value until the window fills; break instead of drawing
              // a segment across the gap.
              started = false
              continue
            }
            const x = xOf(i)
            const y = yOf(v)
            if (started) ctx.lineTo(x, y)
            else {
              ctx.moveTo(x, y)
              started = true
            }
          }
          ctx.globalAlpha = o.kind === "band" ? 0.55 : 1
          ctx.stroke()
          ctx.globalAlpha = 1
        }
        ctx.setLineDash([])
      }
      ctx.lineWidth = 1

      /* ---- panes, each with its own scale ---- */
      let paneTop = priceTop + priceH + PANE_GAP
      const paneRects: { pane: Pane; top: number; h: number; lo: number; hi: number }[] = []

      for (const pane of panes) {
        const ph = plotH * pane.share - PANE_GAP
        let plo = Infinity
        let phi = -Infinity
        if (pane.domain) {
          ;[plo, phi] = pane.domain
        } else {
          for (const item of pane.items) {
            for (let i = first; i <= last; i++) {
              const v = item.values[i]
              if (v == null || !Number.isFinite(v)) continue
              if (v < plo) plo = v
              if (v > phi) phi = v
            }
          }
          for (const g of pane.guides ?? []) {
            if (g < plo) plo = g
            if (g > phi) phi = g
          }
          if (!Number.isFinite(plo)) {
            plo = 0
            phi = 1
          }
          const p = (phi - plo) * 0.1 || 1
          plo -= p
          phi += p
        }
        const pyOf = (v: number) => paneTop + ((phi - v) / (phi - plo)) * ph
        paneRects.push({ pane, top: paneTop, h: ph, lo: plo, hi: phi })

        for (const g of pane.guides ?? []) {
          const y = pyOf(g)
          ctx.strokeStyle = c.grid
          ctx.globalAlpha = 0.7
          ctx.setLineDash([2, 3])
          ctx.beginPath()
          ctx.moveTo(0, Math.round(y) + 0.5)
          ctx.lineTo(plotW, Math.round(y) + 0.5)
          ctx.stroke()
          ctx.setLineDash([])
          ctx.globalAlpha = 1
        }

        for (const item of pane.items) {
          if (item.kind === "hist") {
            const zero = pyOf(Math.max(plo, Math.min(phi, 0)))
            for (let i = first; i <= last; i++) {
              const v = item.values[i]
              if (v == null) continue
              const x = xOf(i)
              const bw = Math.max(1, barW * 0.7)
              ctx.fillStyle =
                item.color === "sign"
                  ? v >= 0
                    ? c.up
                    : c.down
                  : item.color === "updown"
                    ? bars[i].c >= bars[i].o
                      ? c.up
                      : c.down
                    : color(item.color, c.muted)
              ctx.globalAlpha = 0.5
              const y = pyOf(v)
              ctx.fillRect(x - bw / 2, Math.min(y, zero), bw, Math.abs(y - zero) || 1)
              ctx.globalAlpha = 1
            }
          } else if (item.kind === "area") {
            const base = pyOf(
              Math.max(plo, Math.min(phi, item.baseline ?? 0))
            )
            const col = color(item.token, c.muted)
            ctx.fillStyle = col
            ctx.globalAlpha = 0.18
            ctx.beginPath()
            let started = false
            for (let i = first; i <= last; i++) {
              const v = item.values[i]
              if (v == null) continue
              const x = xOf(i)
              if (started) ctx.lineTo(x, pyOf(v))
              else {
                ctx.moveTo(x, base)
                ctx.lineTo(x, pyOf(v))
                started = true
              }
            }
            ctx.lineTo(xOf(last), base)
            ctx.closePath()
            ctx.fill()
            ctx.globalAlpha = 1
            ctx.strokeStyle = col
            ctx.beginPath()
            started = false
            for (let i = first; i <= last; i++) {
              const v = item.values[i]
              if (v == null) continue
              const x = xOf(i)
              if (started) ctx.lineTo(x, pyOf(v))
              else {
                ctx.moveTo(x, pyOf(v))
                started = true
              }
            }
            ctx.stroke()
          } else {
            ctx.strokeStyle = color(item.token, c.muted)
            ctx.lineWidth = 1.4
            ctx.beginPath()
            let started = false
            for (let i = first; i <= last; i++) {
              const v = item.values[i]
              if (v == null) {
                started = false
                continue
              }
              const x = xOf(i)
              if (started) ctx.lineTo(x, pyOf(v))
              else {
                ctx.moveTo(x, pyOf(v))
                started = true
              }
            }
            ctx.stroke()
            ctx.lineWidth = 1
          }
        }

        if (pane.label) {
          ctx.fillStyle = c.muted
          ctx.textAlign = "left"
          ctx.fillText(pane.label, 8, paneTop + 8)
        }
        paneTop += ph + PANE_GAP
      }

      /* ---- crosshair ---- */
      const pt = pointer.current
      if (!pt.inside || pt.x >= plotW) return

      const idx = Math.max(
        0,
        Math.min(total - 1, Math.round(offset + pt.x / barW - 0.5))
      )
      const b = bars[idx]
      const snapX = xOf(idx)

      ctx.save()
      ctx.setLineDash([3, 3])
      ctx.strokeStyle = c.muted
      ctx.globalAlpha = 0.6
      ctx.beginPath()
      ctx.moveTo(Math.round(snapX) + 0.5, 0)
      ctx.lineTo(Math.round(snapX) + 0.5, plotH)
      ctx.moveTo(0, Math.round(pt.y) + 0.5)
      ctx.lineTo(plotW, Math.round(pt.y) + 0.5)
      ctx.stroke()
      ctx.restore()

      const tagH = 16
      // The value tag follows whichever scale the cursor is sitting in.
      const inPane = paneRects.find(
        (r) => pt.y >= r.top && pt.y <= r.top + r.h
      )
      const tagValue = inPane
        ? inPane.hi - ((pt.y - inPane.top) / inPane.h) * (inPane.hi - inPane.lo)
        : priceAt(pt.y)
      ctx.fillStyle = c.text
      ctx.fillRect(plotW, pt.y - tagH / 2, PRICE_AXIS_W, tagH)
      ctx.fillStyle = c.card
      ctx.textAlign = "left"
      ctx.fillText(format(tagValue), plotW + 6, pt.y)

      const label = fmtDateTime(b.t, barMs)
      const tw = ctx.measureText(label).width + 10
      const tx = Math.max(0, Math.min(plotW - tw, snapX - tw / 2))
      ctx.fillStyle = c.text
      ctx.fillRect(tx, plotH + 2, tw, tagH)
      ctx.fillStyle = c.card
      ctx.textAlign = "center"
      ctx.fillText(label, tx + tw / 2, plotH + 2 + tagH / 2)

      /* ---- readout ---- */
      ctx.textAlign = "left"
      let rx = 8
      const put = (k: string, v: string, col: string) => {
        ctx.fillStyle = c.muted
        ctx.fillText(k, rx, 8)
        rx += ctx.measureText(k).width + 3
        ctx.fillStyle = col
        ctx.fillText(v, rx, 8)
        rx += ctx.measureText(v).width + 9
      }
      const dir = b.c >= b.o ? c.up : c.down
      if (price.kind === "line") {
        const v = price.values[idx]
        if (v != null) put("", format(v), color(price.token, c.up))
      } else {
        put("O", format(b.o), dir)
        put("H", format(b.h), dir)
        put("L", format(b.l), dir)
        put("C", format(b.c), dir)
      }
      for (const o of overlays) {
        const col = color(o.token, c.muted)
        if (o.kind === "line") {
          const v = o.values[idx]
          if (v != null) put(o.label, format(v), col)
        } else {
          const u = o.upper[idx]
          const l = o.lower[idx]
          if (u != null && l != null) {
            put(o.label, `${format(l)} – ${format(u)}`, col)
          }
        }
      }
    }

    const schedule = () => {
      if (!frame.current) frame.current = requestAnimationFrame(draw)
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = wrap.clientWidth
      const h = wrap.clientHeight
      if (!w || !h) return
      size.current = { w, h }
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      // Draw in CSS pixels; the transform handles the device ratio.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      schedule()
    }
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)
    resize()

    const onDown = (e: PointerEvent) => {
      canvas.setPointerCapture(e.pointerId)
      drag.current = { x: e.clientX, offset: view.current.offset }
    }
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      pointer.current = {
        x: e.clientX - r.left,
        y: e.clientY - r.top,
        inside: true,
      }
      if (drag.current) {
        const barW = (size.current.w - PRICE_AXIS_W) / view.current.bars
        view.current.offset =
          drag.current.offset - (e.clientX - drag.current.x) / barW
        clampView()
      }
      schedule()
    }
    const onUp = (e: PointerEvent) => {
      drag.current = null
      canvas.releasePointerCapture?.(e.pointerId)
    }
    const onLeave = () => {
      pointer.current.inside = false
      schedule()
    }
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const r = canvas.getBoundingClientRect()
      const px = e.clientX - r.left
      const plotW = size.current.w - PRICE_AXIS_W
      const v = view.current
      // Anchor on the bar under the cursor so it keeps its position.
      const anchor = v.offset + (px / plotW) * v.bars
      v.bars *= Math.exp(e.deltaY * 0.0015)
      clampView()
      v.offset = anchor - (px / plotW) * v.bars
      clampView()
      schedule()
    }

    canvas.addEventListener("pointerdown", onDown)
    canvas.addEventListener("pointermove", onMove)
    canvas.addEventListener("pointerup", onUp)
    canvas.addEventListener("pointercancel", onUp)
    canvas.addEventListener("pointerleave", onLeave)
    // Not passive: the page must not scroll while zooming the chart.
    canvas.addEventListener("wheel", onWheel, { passive: false })

    return () => {
      ro.disconnect()
      cancelAnimationFrame(frame.current)
      canvas.removeEventListener("pointerdown", onDown)
      canvas.removeEventListener("pointermove", onMove)
      canvas.removeEventListener("pointerup", onUp)
      canvas.removeEventListener("pointercancel", onUp)
      canvas.removeEventListener("pointerleave", onLeave)
      canvas.removeEventListener("wheel", onWheel)
    }
  }, [bars, barMs, price, overlays, panes, format])

  return (
    <div
      ref={wrapRef}
      className="w-full touch-none select-none"
      style={{ height, cursor: "crosshair" }}
    >
      <canvas ref={canvasRef} className="block" />
    </div>
  )
}

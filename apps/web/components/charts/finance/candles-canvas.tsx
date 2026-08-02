"use client"

import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export type Bar = {
  /** Epoch ms. */
  t: number
  o: number
  h: number
  l: number
  c: number
  v: number
}

const BAR_COUNT = 20_000
const BAR_MS = 60_000

/** Deterministic, so the series is identical on every load. */
function seeded(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

function buildSeries(): Bar[] {
  const out: Bar[] = new Array(BAR_COUNT)
  const start = Date.UTC(2026, 0, 1)
  let close = 42_000
  for (let i = 0; i < BAR_COUNT; i++) {
    const trend = Math.sin(i / 900) * 60 + Math.sin(i / 130) * 18
    const shock = seeded(i) > 0.997 ? (seeded(i * 3) - 0.5) * 900 : 0
    const open = close
    close = open + trend * 0.03 + (seeded(i * 7) - 0.5) * 26 + shock
    const wick = 6 + seeded(i * 11) * 30
    out[i] = {
      t: start + i * BAR_MS,
      o: open,
      c: close,
      h: Math.max(open, close) + wick * seeded(i * 13),
      l: Math.min(open, close) - wick * seeded(i * 17),
      v: 40 + seeded(i * 19) * 260 + Math.abs(close - open) * 4,
    }
  }
  return out
}

/* ---------------------------------------------------------------- layout */

const PRICE_AXIS_W = 64
const TIME_AXIS_H = 22
/** Share of the plot given to the volume pane. */
const VOLUME_SHARE = 0.2
const PAD_TOP = 10

const MIN_BARS = 24
const MAX_BARS = 3000
const DEFAULT_BARS = 180

/* ------------------------------------------------------------ formatting */

/**
 * Tick steps a reader expects to see — 1, 2, 5 and their decades. Dividing a
 * range into equal parts gives values like 137.4, which nobody scans.
 */
function niceTicks(min: number, max: number, target: number): number[] {
  if (!(max > min)) return [min]
  const raw = (max - min) / target
  const mag = 10 ** Math.floor(Math.log10(raw))
  const norm = raw / mag
  const step = (norm >= 5 ? 10 : norm >= 2 ? 5 : norm >= 1 ? 2 : 1) * mag
  const first = Math.ceil(min / step) * step
  const out: number[] = []
  for (let v = first; v <= max; v += step) out.push(v)
  return out
}

const TIME_STEPS_MS = [
  60_000, 5 * 60_000, 15 * 60_000, 30 * 60_000, 60 * 60_000,
  4 * 60 * 60_000, 12 * 60 * 60_000, 24 * 60 * 60_000, 7 * 24 * 60 * 60_000,
]

function pickTimeStep(spanMs: number, target: number) {
  const ideal = spanMs / target
  return TIME_STEPS_MS.find((s) => s >= ideal) ?? TIME_STEPS_MS.at(-1)!
}

const p2 = (n: number) => String(n).padStart(2, "0")

function fmtTime(ms: number, step: number) {
  const d = new Date(ms)
  if (step >= 24 * 60 * 60_000) {
    return `${d.getUTCMonth() + 1}/${d.getUTCDate()}`
  }
  return `${p2(d.getUTCHours())}:${p2(d.getUTCMinutes())}`
}

function fmtDateTime(ms: number) {
  const d = new Date(ms)
  return `${d.getUTCFullYear()}-${p2(d.getUTCMonth() + 1)}-${p2(
    d.getUTCDate()
  )} ${p2(d.getUTCHours())}:${p2(d.getUTCMinutes())}`
}

const fmtPrice = (n: number) =>
  n.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

/* ------------------------------------------------------------ indicators */

/**
 * Simple moving average, aligned to the input and null until the window fills.
 *
 * Computed once over the whole series rather than per frame: SMA(20) at the
 * left edge of the viewport needs the 19 bars before it, so deriving it from
 * the visible slice alone would give a different line at every scroll position.
 */
function sma(bars: Bar[], period: number): (number | null)[] {
  const out: (number | null)[] = new Array(bars.length).fill(null)
  let sum = 0
  for (let i = 0; i < bars.length; i++) {
    sum += bars[i].c
    if (i >= period) sum -= bars[i - period].c
    if (i >= period - 1) out[i] = sum / period
  }
  return out
}

/** Drawn in the price pane, so it shares the candles' y-scale. */
type Overlay = {
  label: string
  /** CSS custom property, resolved with the rest of the palette. */
  token: string
  values: (number | null)[]
}

/* ---------------------------------------------------------------- colors */

type Palette = {
  up: string
  down: string
  text: string
  muted: string
  grid: string
  card: string
  crosshair: string
}

function readPalette(el: HTMLElement): Palette {
  const cs = getComputedStyle(el)
  const v = (name: string, fallback: string) =>
    cs.getPropertyValue(name).trim() || fallback
  return {
    // Canvas parses lab()/oklch() directly, so the tokens go straight in —
    // unlike Pixi, which needs numeric colours.
    up: v("--chart-2", "#16a34a"),
    down: v("--chart-5", "#dc2626"),
    text: v("--foreground", "#e5e5e5"),
    muted: v("--muted-foreground", "#8a8a8a"),
    grid: v("--border", "#2a2a2a"),
    card: v("--card", "#0a0a0a"),
    crosshair: v("--muted-foreground", "#8a8a8a"),
  }
}

/* ------------------------------------------------------------- component */

/**
 * Candlestick chart drawn straight onto a canvas.
 *
 * Recharts is a poor fit past a few hundred points — one DOM node per mark,
 * and no notion of a viewport you can pan or zoom. Here the series is 20,000
 * bars and only the visible slice is ever drawn, so cost tracks the window
 * rather than the dataset.
 *
 * Everything including the crosshair readouts is painted on the canvas, so
 * dragging and zooming cause no React renders at all.
 */
export function ChartCandlesCanvas() {
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [{ series, overlays }] = React.useState(() => {
    const series = buildSeries()
    const overlays: Overlay[] = [
      { label: "MA 20", token: "--chart-1", values: sma(series, 20) },
      { label: "MA 50", token: "--chart-4", values: sma(series, 50) },
    ]
    return { series, overlays }
  })

  // Interaction state lives in refs: none of it should trigger a re-render.
  const view = React.useRef({ offset: BAR_COUNT - DEFAULT_BARS, bars: DEFAULT_BARS })
  const pointer = React.useRef<{ x: number; y: number; inside: boolean }>({
    x: 0,
    y: 0,
    inside: false,
  })
  const drag = React.useRef<{ x: number; offset: number } | null>(null)
  const size = React.useRef({ w: 0, h: 0 })
  const palette = React.useRef<Palette | null>(null)
  const overlayColors = React.useRef<string[]>([])
  const themeKey = React.useRef("")
  const frame = React.useRef(0)

  React.useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const clampView = () => {
      const v = view.current
      v.bars = Math.max(MIN_BARS, Math.min(MAX_BARS, v.bars))
      v.offset = Math.max(0, Math.min(BAR_COUNT - v.bars, v.offset))
    }

    function draw() {
      frame.current = 0
      const { w, h } = size.current
      if (!ctx || w === 0 || h === 0) return

      const key = document.documentElement.className
      if (key !== themeKey.current || !palette.current) {
        palette.current = readPalette(wrap!)
        const cs = getComputedStyle(wrap!)
        overlayColors.current = overlays.map(
          (o) => cs.getPropertyValue(o.token).trim() || "#888"
        )
        themeKey.current = key
      }
      const c = palette.current

      const plotW = w - PRICE_AXIS_W
      const plotH = h - TIME_AXIS_H
      const volH = plotH * VOLUME_SHARE
      const priceH = plotH - volH - PAD_TOP

      ctx.clearRect(0, 0, w, h)

      const { offset, bars } = view.current
      const barW = plotW / bars
      const first = Math.max(0, Math.floor(offset))
      const last = Math.min(BAR_COUNT - 1, Math.ceil(offset + bars))

      // Extent over the visible slice only — this is what makes the cost
      // track the window instead of the dataset.
      let lo = Infinity
      let hi = -Infinity
      let maxV = 0
      for (let i = first; i <= last; i++) {
        const b = series[i]
        if (b.l < lo) lo = b.l
        if (b.h > hi) hi = b.h
        if (b.v > maxV) maxV = b.v
      }
      // Overlays share this scale, so they have to widen it — a moving average
      // can sit outside the visible high/low and would otherwise be clipped.
      for (const o of overlays) {
        for (let i = first; i <= last; i++) {
          const v = o.values[i]
          if (v == null) continue
          if (v < lo) lo = v
          if (v > hi) hi = v
        }
      }

      const pad = (hi - lo) * 0.08 || 1
      lo -= pad
      hi += pad

      const xOf = (i: number) => (i - offset) * barW + barW / 2
      const yOf = (p: number) => PAD_TOP + ((hi - p) / (hi - lo)) * priceH
      const priceAt = (y: number) => hi - ((y - PAD_TOP) / priceH) * (hi - lo)

      /* grid + price axis */
      ctx.font = "11px ui-sans-serif, system-ui, sans-serif"
      ctx.textBaseline = "middle"
      for (const p of niceTicks(lo, hi, 6)) {
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
        ctx.fillText(fmtPrice(p), plotW + 6, y)
      }

      /* time axis */
      const spanMs = bars * BAR_MS
      const step = pickTimeStep(spanMs, 6)
      const startMs = series[first].t
      const firstTick = Math.ceil(startMs / step) * step
      ctx.textAlign = "center"
      for (let t = firstTick; t <= startMs + spanMs; t += step) {
        const i = (t - series[0].t) / BAR_MS
        const x = xOf(i)
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

      /* volume */
      const volTop = PAD_TOP + priceH
      for (let i = first; i <= last; i++) {
        const b = series[i]
        const x = xOf(i)
        const bw = Math.max(1, barW * 0.7)
        const bh = (b.v / maxV) * volH
        ctx.fillStyle = b.c >= b.o ? c.up : c.down
        ctx.globalAlpha = 0.25
        ctx.fillRect(x - bw / 2, volTop + volH - bh, bw, bh)
      }
      ctx.globalAlpha = 1

      /* candles */
      const bodyW = Math.max(1, barW * 0.7)
      const thin = barW < 3
      for (let i = first; i <= last; i++) {
        const b = series[i]
        const x = xOf(i)
        const up = b.c >= b.o
        ctx.fillStyle = ctx.strokeStyle = up ? c.up : c.down

        if (thin) {
          // Below ~3px a body is illegible; a single wick line reads better.
          ctx.beginPath()
          ctx.moveTo(Math.round(x) + 0.5, yOf(b.h))
          ctx.lineTo(Math.round(x) + 0.5, yOf(b.l))
          ctx.stroke()
          continue
        }

        ctx.beginPath()
        ctx.moveTo(Math.round(x) + 0.5, yOf(b.h))
        ctx.lineTo(Math.round(x) + 0.5, yOf(b.l))
        ctx.stroke()

        const yO = yOf(b.o)
        const yC = yOf(b.c)
        // A doji has no body height, so give it a visible line.
        const top = Math.min(yO, yC)
        const bh = Math.max(1, Math.abs(yC - yO))
        ctx.fillRect(x - bodyW / 2, top, bodyW, bh)
      }

      /* overlays — after the candles so the lines sit on top */
      ctx.lineWidth = 1.5
      overlays.forEach((o, oi) => {
        ctx.strokeStyle = overlayColors.current[oi] ?? c.muted
        ctx.beginPath()
        let open = false
        for (let i = first; i <= last; i++) {
          const v = o.values[i]
          if (v == null) {
            // The line has no value until its window fills; break rather than
            // drawing a segment across the gap.
            open = false
            continue
          }
          const x = xOf(i)
          const y = yOf(v)
          if (open) ctx.lineTo(x, y)
          else {
            ctx.moveTo(x, y)
            open = true
          }
        }
        ctx.stroke()
      })
      ctx.lineWidth = 1

      /* crosshair */
      const pt = pointer.current
      if (pt.inside && pt.x < plotW) {
        // Snap to the nearest bar, the way a reader expects.
        const idx = Math.round(offset + pt.x / barW - 0.5)
        const b = series[Math.max(0, Math.min(BAR_COUNT - 1, idx))]
        const snapX = xOf(idx)

        ctx.save()
        ctx.setLineDash([3, 3])
        ctx.strokeStyle = c.crosshair
        ctx.globalAlpha = 0.6
        ctx.beginPath()
        ctx.moveTo(Math.round(snapX) + 0.5, 0)
        ctx.lineTo(Math.round(snapX) + 0.5, plotH)
        ctx.moveTo(0, Math.round(pt.y) + 0.5)
        ctx.lineTo(plotW, Math.round(pt.y) + 0.5)
        ctx.stroke()
        ctx.restore()

        /* price tag on the right gutter */
        const tagH = 16
        ctx.fillStyle = c.text
        ctx.fillRect(plotW, pt.y - tagH / 2, PRICE_AXIS_W, tagH)
        ctx.fillStyle = c.card
        ctx.textAlign = "left"
        ctx.fillText(fmtPrice(priceAt(pt.y)), plotW + 6, pt.y)

        /* time tag under the axis */
        const label = fmtDateTime(b.t)
        const tw = ctx.measureText(label).width + 10
        const tx = Math.max(0, Math.min(plotW - tw, snapX - tw / 2))
        ctx.fillStyle = c.text
        ctx.fillRect(tx, plotH + 2, tw, tagH)
        ctx.fillStyle = c.card
        ctx.textAlign = "center"
        ctx.fillText(label, tx + tw / 2, plotH + 2 + tagH / 2)

        /* OHLC readout */
        ctx.textAlign = "left"
        const up = b.c >= b.o
        const parts: [string, string][] = [
          ["O", fmtPrice(b.o)],
          ["H", fmtPrice(b.h)],
          ["L", fmtPrice(b.l)],
          ["C", fmtPrice(b.c)],
        ]
        let rx = 8
        for (const [k, val] of parts) {
          ctx.fillStyle = c.muted
          ctx.fillText(k, rx, 12)
          rx += ctx.measureText(k).width + 3
          ctx.fillStyle = up ? c.up : c.down
          ctx.fillText(val, rx, 12)
          rx += ctx.measureText(val).width + 10
        }

        // Each overlay's value at the same bar, in its own colour, so the
        // legend names the lines instead of leaving them to be guessed.
        const bi = Math.max(0, Math.min(BAR_COUNT - 1, idx))
        overlays.forEach((o, oi) => {
          const v = o.values[bi]
          if (v == null) return
          const color = overlayColors.current[oi] ?? c.muted
          ctx.fillStyle = c.muted
          ctx.fillText(o.label, rx, 12)
          rx += ctx.measureText(o.label).width + 3
          ctx.fillStyle = color
          ctx.fillText(fmtPrice(v), rx, 12)
          rx += ctx.measureText(fmtPrice(v)).width + 10
        })
      }
    }

    const schedule = () => {
      if (!frame.current) frame.current = requestAnimationFrame(draw)
    }

    /* sizing */
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

    /* pan */
    const onPointerDown = (e: PointerEvent) => {
      canvas.setPointerCapture(e.pointerId)
      drag.current = { x: e.clientX, offset: view.current.offset }
    }
    const onPointerMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      pointer.current = {
        x: e.clientX - r.left,
        y: e.clientY - r.top,
        inside: true,
      }
      if (drag.current) {
        const plotW = size.current.w - PRICE_AXIS_W
        const barW = plotW / view.current.bars
        view.current.offset =
          drag.current.offset - (e.clientX - drag.current.x) / barW
        clampView()
      }
      schedule()
    }
    const endDrag = (e: PointerEvent) => {
      drag.current = null
      canvas.releasePointerCapture?.(e.pointerId)
    }
    const onLeave = () => {
      pointer.current.inside = false
      schedule()
    }

    /* zoom, anchored so the bar under the cursor stays put */
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const r = canvas.getBoundingClientRect()
      const px = e.clientX - r.left
      const plotW = size.current.w - PRICE_AXIS_W
      const v = view.current
      const anchor = v.offset + (px / plotW) * v.bars
      const factor = Math.exp(e.deltaY * 0.0015)
      v.bars = v.bars * factor
      clampView()
      v.offset = anchor - (px / plotW) * v.bars
      clampView()
      schedule()
    }

    canvas.addEventListener("pointerdown", onPointerDown)
    canvas.addEventListener("pointermove", onPointerMove)
    canvas.addEventListener("pointerup", endDrag)
    canvas.addEventListener("pointercancel", endDrag)
    canvas.addEventListener("pointerleave", onLeave)
    // Not passive: the page must not scroll while zooming the chart.
    canvas.addEventListener("wheel", onWheel, { passive: false })

    return () => {
      ro.disconnect()
      cancelAnimationFrame(frame.current)
      canvas.removeEventListener("pointerdown", onPointerDown)
      canvas.removeEventListener("pointermove", onPointerMove)
      canvas.removeEventListener("pointerup", endDrag)
      canvas.removeEventListener("pointercancel", endDrag)
      canvas.removeEventListener("pointerleave", onLeave)
      canvas.removeEventListener("wheel", onWheel)
    }
  }, [series, overlays])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Candles — Canvas</CardTitle>
        <CardDescription>
          {BAR_COUNT.toLocaleString()} 1-minute bars · drag to pan, wheel to
          zoom
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          ref={wrapRef}
          className="h-[380px] w-full touch-none select-none"
          style={{ cursor: "crosshair" }}
        >
          <canvas ref={canvasRef} className="block" />
        </div>
      </CardContent>
    </Card>
  )
}

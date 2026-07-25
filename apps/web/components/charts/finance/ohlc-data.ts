export type OhlcPoint = {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

/** Deterministic synthetic OHLC series for finance demos. */
export const ohlcData: OhlcPoint[] = (() => {
  const out: OhlcPoint[] = []
  let close = 100
  for (let i = 0; i < 40; i++) {
    const drift = Math.sin(i / 5) * 2 + (i % 7 === 0 ? -3 : 1.2)
    const open = close
    close = Math.round((open + drift + Math.cos(i / 3) * 1.5) * 100) / 100
    const high =
      Math.round((Math.max(open, close) + 1.2 + (i % 4) * 0.4) * 100) / 100
    const low =
      Math.round((Math.min(open, close) - 1.1 - (i % 3) * 0.3) * 100) / 100
    const volume = Math.round(800_000 + Math.abs(Math.sin(i / 2)) * 1_200_000)
    const month = ((i % 12) + 1).toString().padStart(2, "0")
    const day = ((i % 28) + 1).toString().padStart(2, "0")
    out.push({
      date: `2025-${month}-${day}`,
      open,
      high,
      low,
      close,
      volume,
    })
  }
  return out
})()

export function sma(values: number[], period: number): (number | null)[] {
  return values.map((_, i) => {
    if (i < period - 1) return null
    const slice = values.slice(i - period + 1, i + 1)
    return Math.round((slice.reduce((a, b) => a + b, 0) / period) * 100) / 100
  })
}

export function bollinger(values: number[], period = 20, mult = 2) {
  const mid = sma(values, period)
  return mid.map((m, i) => {
    if (m == null) return { mid: null, upper: null, lower: null }
    const slice = values.slice(i - period + 1, i + 1)
    const variance =
      slice.reduce((acc, v) => acc + (v - m) ** 2, 0) / period
    const std = Math.sqrt(variance)
    return {
      mid: m,
      upper: Math.round((m + mult * std) * 100) / 100,
      lower: Math.round((m - mult * std) * 100) / 100,
    }
  })
}

export function ema(values: number[], period: number): (number | null)[] {
  const k = 2 / (period + 1)
  const out: (number | null)[] = []
  let prev: number | null = null
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) {
      out.push(null)
      continue
    }
    if (prev == null) {
      const seed = values.slice(0, period).reduce((a, b) => a + b, 0) / period
      prev = seed
      out.push(Math.round(seed * 100) / 100)
      continue
    }
    prev = values[i] * k + prev * (1 - k)
    out.push(Math.round(prev * 100) / 100)
  }
  return out
}

export function macdSeries(closes: number[]) {
  const ema12 = ema(closes, 12)
  const ema26 = ema(closes, 26)
  const macd = closes.map((_, i) => {
    if (ema12[i] == null || ema26[i] == null) return null
    return Math.round((ema12[i]! - ema26[i]!) * 100) / 100
  })
  const signal = ema(
    macd.map((v) => v ?? 0),
    9
  ).map((v, i) => (macd[i] == null ? null : v))
  const hist = macd.map((m, i) => {
    if (m == null || signal[i] == null) return null
    return Math.round((m - signal[i]!) * 100) / 100
  })
  return { macd, signal, hist }
}

export function rsiSeries(closes: number[], period = 14): (number | null)[] {
  const out: (number | null)[] = []
  let avgGain = 0
  let avgLoss = 0
  for (let i = 0; i < closes.length; i++) {
    if (i === 0) {
      out.push(null)
      continue
    }
    const change = closes[i] - closes[i - 1]
    const gain = Math.max(change, 0)
    const loss = Math.max(-change, 0)
    if (i < period) {
      avgGain += gain
      avgLoss += loss
      out.push(null)
      continue
    }
    if (i === period) {
      avgGain /= period
      avgLoss /= period
    } else {
      avgGain = (avgGain * (period - 1) + gain) / period
      avgLoss = (avgLoss * (period - 1) + loss) / period
    }
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss
    out.push(Math.round((100 - 100 / (1 + rs)) * 10) / 10)
  }
  return out
}

export function drawdownSeries(closes: number[]) {
  let peak = closes[0]
  return closes.map((c) => {
    peak = Math.max(peak, c)
    return Math.round(((c - peak) / peak) * 1000) / 10
  })
}

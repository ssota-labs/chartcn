---
name: chartcn
description: Choose, install, and embed chartcn registry charts. Use when picking a chart variant, searching the registry, installing via shadcn add, or inserting charts into MDX/RSC or json-render trees.
---

# chartcn agent skill

chartcn ships chart **variants as shadcn registry items** — 127 of them, all
`status: ready`. Installing copies source into the project; there is no runtime
package to depend on.

Most items are `ChartContainer` + Recharts primitives. **Not all of them are** —
see [Renderers](#renderers). Never assume a chart is Recharts before reading it.

## Host

```
https://chartcn.vercel.app
```

Every install is an HTTP fetch against that host. A repo checkout serves the
same payloads from `http://localhost:3000` after `pnpm dev`; point at that
instead when working on the registry itself.

`CHARTCN_REGISTRY_URL` overrides the host in generated install commands. It is
only needed for a fork or a preview deployment — the default is the public host
above.

## Workflow

1. **Find a candidate.** Inside the repo: `pnpm chartcn-search <query> --json`.
   Outside it, that CLI does not work — it reads the local registry file. Fetch
   `https://chartcn.vercel.app/r/registry.json` instead and filter it.
2. **Check the item** at `https://chartcn.vercel.app/r/<name>.json` for its
   `dataShape`, `dependencies` and `files`.
3. **Install**: `npx shadcn@latest add https://chartcn.vercel.app/r/<name>.json`
4. **Embed** via MDX/RSC (server) or a json-render component map (client).

Naming is `chart-<family>-<variant>`, e.g. `chart-area-stacked`.

## Choose a variant

Families, by size. Each has more variants than listed — search within a family
rather than assuming the example below is the only option.

| Need | Family | Start with |
| --- | --- | --- |
| Trend over time | `line`, `area` | `chart-line-basic`, `chart-area-stacked` |
| Compare categories | `bar` | `chart-bar-basic`, `chart-bar-grouped` |
| Part-to-whole | `pie`, `radial` | `chart-pie-donut`, `chart-radial-gauge` |
| Correlation, distribution | `scatter` | `chart-scatter-basic`, `chart-scatter-bubble` |
| Multi-axis comparison | `radar` | `chart-radar-multi` |
| Hierarchy by area | `treemap` | `chart-treemap-basic` |
| Flow between stages | `sankey` | `chart-sankey-basic` |
| Arbitrary relationships | `graph` | `chart-graph-force` |
| Maps | `geo` | `chart-geo-choropleth` |
| Statistical summary | `analysis` | `chart-analysis-histogram`, `chart-analysis-box-plot` |
| Product funnels, retention | `analytics` | `chart-analytics-funnel-steps`, `chart-analytics-cohort-heatmap` |
| Market / OHLC data | `finance` | `chart-finance-candlestick` |
| Cross-cutting composition | `extras` | `chart-extras-bar-diverging` |

### Picking between close neighbours

- **Sankey vs graph.** Sankey needs a layered, acyclic graph with a fixed column
  per stage. Cycles, hubs and disconnected clusters need `graph` instead.
- **`chart-graph-force` vs `chart-graph-force-gl`.** SVG up to roughly one or
  two thousand marks; it labels nodes, isolates a neighbourhood on hover and
  supports drag. The WebGL one handles far more but has none of that. Switch on
  node count, not preference.
- **Finance vs everything else.** The `finance` family is a viewport: long
  series, pan and zoom, crosshair. Every other family renders a fixed dataset.

## Renderers

Do not assume Recharts. Three groups behave differently:

| Group | Renders with | Notes |
| --- | --- | --- |
| Most families | `ChartContainer` + Recharts | Declares `recharts` |
| `finance` (16 items) | Hand-drawn 2D canvas | **No dependency at all.** Ships `canvas-chart.tsx` + `market-series.tsx` alongside |
| `graph` (2 items) | `d3-force` + SVG, or Pixi | `chart-graph-force-gl` pulls `pixi.js` |
| `geo` (3) | `d3-geo` paths | Own SVG, plus `d3-geo` |
| Heatmaps, cohort | CSS grid / HTML table | No charting library |

**Some items ship more than one file.** Shared engines and data helpers
(`canvas-chart.tsx`, `sankey-parts.tsx`, `scatter-dot.tsx`, `treemap-tile.tsx`,
`brush-traveller.tsx`, `geo-data.ts`) come with the items that need them. Do not
delete the extra files — the chart will not compile without them.

## Working with finance charts

The canvas engine is configuration, not markup. A chart declares a price mark,
overlays that share the price scale, and panes that need their own:

```tsx
<CanvasChart
  bars={bars}
  barMs={60_000}
  price={{ kind: "candles" }}                       // or "line" | "range"
  overlays={[{ kind: "line", label: "MA 20", token: "--chart-1", values }]}
  panes={[{ id: "rsi", share: 0.24, domain: [0, 100], guides: [30, 70],
            items: [{ kind: "line", token: "--chart-3", values }] }]}
/>
```

Indicator helpers are exported from `canvas-chart.tsx`: `sma`, `ema`, `stddev`,
`rsi`, `macd`, `atr`, `vwap`, `donchian`, `stochastic`, `obv`, `supertrend`,
`psar`, `ichimoku`, `drawdown`.

Two rules that are easy to get wrong:

- **Compute indicators over the whole series, never the visible slice.** SMA(20)
  at the left edge of the viewport needs the 19 bars before it, so a
  slice-derived value changes at every scroll position.
- **Overlays widen the price extent.** They share the candles' scale, and a
  Bollinger envelope routinely sits outside the visible high and low.

## Rules of thumb

- Match the item's documented `dataShape`. Do not reshape data into arbitrary
  nested trees.
- Keep theme tokens — `var(--chart-1)` … `var(--chart-5)`. Never hardcode hex.
- Do not invent a Mark API (`LineMark`, `encode`, …). There is no Mark layer.
- Chart files are `"use client"`. In RSC, import them into a client boundary.
- Read `dependencies` on the item before assuming what gets installed. It ranges
  from nothing to `pixi.js`.

## Server: MDX / RSC

```tsx
// components/mdx.tsx
import { ChartAreaStacked } from "@/components/charts"

export function getMDXComponents(components) {
  return { ...defaultMdxComponents, ChartAreaStacked, ...components }
}
```

```mdx
## Revenue mix

<ChartAreaStacked />
```

## Client: json-render

Map registry item names to components; agents emit JSON nodes and the runtime
renders them.

```tsx
"use client"

import { ChartAreaStacked, ChartBarGrouped, ChartLineMulti } from "@/components/charts"

/** registry item name → component */
export const chartcnComponentMap = {
  "chart-area-stacked": ChartAreaStacked,
  "chart-bar-grouped": ChartBarGrouped,
  "chart-line-multi": ChartLineMulti,
} as const

export function renderChartNode(node: {
  type: keyof typeof chartcnComponentMap
  props?: Record<string, unknown>
}) {
  const Comp = chartcnComponentMap[node.type]
  return Comp ? <Comp {...(node.props ?? {})} /> : null
}
```

Prompt hint: *“Emit a json-render tree using only chartcn registry item names as
`type`.”*

## Anti-patterns

- Installing from a host that is not reachable — verify before recommending
- Assuming every chart is Recharts — the finance and graph families are not
- Dropping the shared engine files an item ships alongside its chart
- Running `pnpm chartcn-search` outside the repo (it reads a local file)
- Hardcoding colours instead of `--chart-*` tokens
- Wrapping Recharts in a custom Mark/encode API

## Paths

- Registry index: `apps/web/registry/registry.json` · items: `registry/items/*.json`
- Served at: `GET /r/registry.json`, `GET /r/<name>.json`
- Search CLI: `packages/cli` (repo-local)
- Docs: `/docs/registry`

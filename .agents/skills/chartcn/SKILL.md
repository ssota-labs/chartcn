---
name: chartcn
description: Choose, install, and embed chartcn registry charts (shadcn ChartContainer + Recharts, no Mark layer). Use when picking chart variants, searching the registry, installing via shadcn add, or inserting charts into MDX/RSC or json-render trees.
---

# chartcn agent skill

chartcn ships chart **variants as shadcn registry items**. There is **no Mark layer** — every chart is `ChartContainer` + Recharts primitives.

## Quick workflow

1. Search: `pnpm chartcn-search <query> --json`
2. Pick a variant (see decision guide below)
3. Install: `npx shadcn@latest add https://<CHARTCN_REGISTRY_HOST>/r/<name>.json`
4. Embed via **MDX/RSC** (server) or **json-render** component map (client)

`CHARTCN_REGISTRY_URL` / `<CHARTCN_REGISTRY_HOST>` is a placeholder until the public host is set. Locally: `http://localhost:3000/r/<name>.json`.

## Naming

`chart-<family>-<variant>` — e.g. `chart-area-stacked`, `chart-bar-grouped`.

## Choose a chart variant

| Need | Prefer | Registry examples |
| --- | --- | --- |
| Trend over time (1 series) | line or area basic | `chart-line-basic`, `chart-area-basic` |
| Trend + magnitude fill | area | `chart-area-basic` |
| Composition over time | stacked area | `chart-area-stacked` |
| Compare categories | bar | `chart-bar-basic` |
| Compare series side-by-side | grouped bar | `chart-bar-grouped` |
| Multiple trends | multi line | `chart-line-multi` |
| Correlation (x/y) | scatter *(stub)* | `chart-scatter-basic` |
| Part-to-whole | pie/donut *(stub)* | `chart-pie-basic` |
| Retention / cohort | analytics *(stub)* | `chart-analytics-cohort-heatmap` |
| Conversion steps | funnel *(stub)* | `chart-analytics-funnel` |
| OHLC / markets | finance *(stub)* | `chart-finance-candlestick` |
| Incremental changes | waterfall *(stub)* | `chart-extras-waterfall` |

**Rules of thumb**

- Prefer **ready** items (`status: ready`) over stubs.
- Do not invent a Mark API (`LineMark`, etc.).
- Match the documented `dataShape` — do not reshape into arbitrary nested trees.
- Keep theme tokens: `var(--chart-1)` … `var(--chart-5)`.

## Data shapes (foundation)

```ts
// chart-area-basic / chart-line-basic / chart-bar-basic
type Point = { month: string; desktop: number }

// chart-area-stacked
type Stacked = { month: string; organic: number; paid: number; referral: number }

// chart-bar-grouped
type Grouped = { quarter: string; productA: number; productB: number; productC: number }

// chart-line-multi
type Multi = { month: string; desktop: number; mobile: number; tablet: number }
```

## Install via registry

```bash
# Base chart primitives (official shadcn)
npx shadcn@latest add chart card

# chartcn variant (host TBD — use env or local demo)
npx shadcn@latest add https://<CHARTCN_REGISTRY_HOST>/r/chart-area-stacked.json

# Local demo app
npx shadcn@latest add http://localhost:3000/r/chart-area-stacked.json
```

Search CLI:

```bash
pnpm chartcn-search stacked
pnpm chartcn-search --category analytics --json
pnpm chartcn-search funnel --status stub --json
```

## Server: MDX / RSC insertion

After install (or when using the demo app's exports), register the chart in MDX components and drop it into content:

```tsx
// components/mdx.tsx
import { ChartAreaStacked } from "@/components/charts"

export function getMDXComponents(components) {
  return {
    ...defaultMdxComponents,
    ChartAreaStacked,
    ...components,
  }
}
```

```mdx
---
title: Revenue mix
---

## Organic vs paid

<ChartAreaStacked />
```

For RSC without MDX, import the client chart component into a Server Component page — the chart file is `"use client"` because Recharts needs the browser.

## Client: json-render (Vercel Labs style)

Map registry item names → React components. Agents emit JSON nodes; the runtime renders them.

```tsx
"use client"

import {
  ChartAreaBasic,
  ChartAreaStacked,
  ChartBarBasic,
  ChartBarGrouped,
  ChartLineBasic,
  ChartLineMulti,
} from "@/components/charts"

/** registry item name → component */
export const chartcnComponentMap = {
  "chart-area-basic": ChartAreaBasic,
  "chart-area-stacked": ChartAreaStacked,
  "chart-bar-basic": ChartBarBasic,
  "chart-bar-grouped": ChartBarGrouped,
  "chart-line-basic": ChartLineBasic,
  "chart-line-multi": ChartLineMulti,
} as const

type ChartNode = {
  type: keyof typeof chartcnComponentMap
  props?: Record<string, unknown>
  children?: ChartNode[]
}

export function renderChartNode(node: ChartNode) {
  const Comp = chartcnComponentMap[node.type]
  if (!Comp) return null
  return <Comp {...(node.props ?? {})} />
}
```

### Example JSON schema nodes

```json
{
  "type": "Stack",
  "children": [
    {
      "type": "chart-area-stacked",
      "props": {}
    },
    {
      "type": "chart-bar-grouped",
      "props": {}
    }
  ]
}
```

Agent prompt hint: *“Emit a json-render tree using only ready chartcn registry item names as `type`. Prefer `chart-line-multi` for comparing desktop/mobile/tablet trends.”*

## Anti-patterns

- Wrapping Recharts in a custom Mark/encode API
- Installing stub items expecting source files (they are placeholders)
- Hard-coding colors instead of `--chart-*` tokens
- Putting heavy interactive chart state in Server Components without a client child

## Related paths

- Registry index: `apps/web/registry/registry.json`
- Items: `apps/web/registry/items/*.json`
- Serve: `GET /r/<name>.json`
- CLI: `packages/cli`
- Docs: `/docs/registry`

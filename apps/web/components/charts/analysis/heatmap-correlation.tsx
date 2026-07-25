"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const labels = ["Revenue", "Users", "Sessions", "Churn", "NPS"] as const

/** Symmetric correlation matrix (−1…1). */
const matrix: number[][] = [
  [1, 0.72, 0.65, -0.41, 0.38],
  [0.72, 1, 0.88, -0.52, 0.45],
  [0.65, 0.88, 1, -0.48, 0.4],
  [-0.41, -0.52, -0.48, 1, -0.61],
  [0.38, 0.45, 0.4, -0.61, 1],
]

function corrColor(v: number) {
  if (v >= 0) {
    const t = Math.round(v * 100)
    return `color-mix(in oklch, var(--chart-1) ${t}%, var(--muted))`
  }
  const t = Math.round(Math.abs(v) * 100)
  return `color-mix(in oklch, var(--chart-5) ${t}%, var(--muted))`
}

/**
 * Correlation matrices are cell grids, not cartesian series. Recharts Scatter
 * can approximate this, but a token-styled grid is clearer for docs demos.
 */
export function ChartHeatmapCorrelation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Heatmap — Correlation</CardTitle>
        <CardDescription>Metric correlation matrix</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="border-separate border-spacing-1 text-xs">
            <thead>
              <tr>
                <th className="w-16" />
                {labels.map((l) => (
                  <th
                    key={l}
                    className="px-1 pb-1 text-center font-medium text-muted-foreground"
                  >
                    {l.slice(0, 3)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, i) => (
                <tr key={labels[i]}>
                  <th className="pr-2 text-left font-medium text-muted-foreground">
                    {labels[i]}
                  </th>
                  {row.map((v, j) => (
                    <td key={`${i}-${j}`}>
                      <div
                        title={`${labels[i]} × ${labels[j]}: ${v.toFixed(2)}`}
                        className="flex size-10 items-center justify-center rounded-md text-[10px] font-medium text-foreground"
                        style={{ background: corrColor(v) }}
                      >
                        {v.toFixed(2)}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

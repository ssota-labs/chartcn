"use client"

import { ChartAreaStacked } from "@/components/charts"

/**
 * Server MDX / RSC pattern: MDX (or a Server Component page) imports a client
 * chart block that was installed from the registry (or lives in this demo app).
 */
export function MdxEmbedDemo() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        Same registry item as json-render: <code>chart-area-stacked</code>
      </p>
      <ChartAreaStacked />
    </div>
  )
}

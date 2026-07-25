"use client"

import * as React from "react"
import { geoIdentity, geoPath } from "d3-geo"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { regionsGeo, valueToColor } from "./geo-data"

const WIDTH = 520
const HEIGHT = 280

export function ChartGeoChoropleth() {
  const [hover, setHover] = React.useState<string | null>(null)

  const pathGen = React.useMemo(() => {
    const projection = geoIdentity().reflectY(true).fitSize([WIDTH, HEIGHT], regionsGeo)
    return geoPath(projection)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Geo — Choropleth Basic</CardTitle>
        <CardDescription>d3-geo path + value coloring</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="mx-auto h-auto w-full max-w-xl" role="img">
            {regionsGeo.features.map((feature) => {
              const id = feature.properties.id
              const active = hover === id
              return (
                <path
                  key={id}
                  d={pathGen(feature) ?? undefined}
                  fill={valueToColor(feature.properties.value)}
                  fillOpacity={hover == null || active ? 0.95 : 0.4}
                  stroke="var(--background)"
                  strokeWidth={1.5}
                  onMouseEnter={() => setHover(id)}
                  onMouseLeave={() => setHover(null)}
                >
                  <title>
                    {feature.properties.name}: {feature.properties.value}
                  </title>
                </path>
              )
            })}
          </svg>
        </div>
        {hover ? (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            {regionsGeo.features.find((f) => f.properties.id === hover)?.properties.name}:{" "}
            {regionsGeo.features.find((f) => f.properties.id === hover)?.properties.value}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}

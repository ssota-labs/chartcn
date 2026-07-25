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

import { geoPoints, regionsGeo } from "./geo-data"

const WIDTH = 520
const HEIGHT = 280

export function ChartGeoPoints() {
  const [active, setActive] = React.useState<string | null>(null)

  const { pathGen, project } = React.useMemo(() => {
    const projection = geoIdentity().reflectY(true).fitSize([WIDTH, HEIGHT], regionsGeo)
    return {
      pathGen: geoPath(projection),
      project: (lon: number, lat: number) => projection([lon, lat]),
    }
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Geo — Point Layer</CardTitle>
        <CardDescription>Facilities overlaid on choropleth base</CardDescription>
      </CardHeader>
      <CardContent>
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="mx-auto h-auto w-full max-w-xl" role="img">
          {regionsGeo.features.map((feature) => (
            <path
              key={feature.properties.id}
              d={pathGen(feature) ?? undefined}
              fill="var(--muted)"
              stroke="var(--border)"
              strokeWidth={1}
            />
          ))}
          {geoPoints.map((point) => {
            const coords = project(point.lon, point.lat)
            if (!coords) return null
            const [cx, cy] = coords
            const r = 4 + point.value / 40
            const isActive = active === point.id
            return (
              <g key={point.id} onMouseEnter={() => setActive(point.id)} onMouseLeave={() => setActive(null)}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="var(--chart-1)"
                  fillOpacity={isActive ? 1 : 0.85}
                  stroke="var(--background)"
                  strokeWidth={2}
                />
                {isActive ? (
                  <text x={cx + r + 4} y={cy + 4} className="fill-foreground text-[11px]">
                    {point.name} ({point.value})
                  </text>
                ) : null}
              </g>
            )
          })}
        </svg>
      </CardContent>
    </Card>
  )
}

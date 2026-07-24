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
import { Button } from "@/components/ui/button"

import { regionsGeo, subregions, valueToColor, type GeoCollection } from "./geo-data"

const WIDTH = 520
const HEIGHT = 280

export function ChartGeoDrilldown() {
  const [stack, setStack] = React.useState<{ id: string; name: string; data: GeoCollection }[]>([
    { id: "all", name: "All regions", data: regionsGeo },
  ])
  const current = stack[stack.length - 1]

  const pathGen = React.useMemo(() => {
    const projection = geoIdentity().reflectY(true).fitSize([WIDTH, HEIGHT], current.data)
    return geoPath(projection)
  }, [current])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Geo — Drill-down + Breadcrumb</CardTitle>
        <CardDescription>Click a region to zoom into subregions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-3 flex flex-wrap items-center gap-1 text-xs">
          {stack.map((item, index) => (
            <React.Fragment key={item.id}>
              {index > 0 ? <span className="text-muted-foreground">/</span> : null}
              <Button
                variant="link"
                size="sm"
                className="h-auto px-1 py-0 text-xs"
                onClick={() => setStack((s) => s.slice(0, index + 1))}
              >
                {item.name}
              </Button>
            </React.Fragment>
          ))}
        </div>
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="mx-auto h-auto w-full max-w-xl" role="img">
          {current.data.features.map((feature) => {
            const id = feature.properties.id
            const canDrill = stack.length === 1 && id in subregions
            return (
              <path
                key={id}
                d={pathGen(feature) ?? undefined}
                fill={valueToColor(feature.properties.value)}
                stroke="var(--background)"
                strokeWidth={1.5}
                className={canDrill ? "cursor-pointer" : undefined}
                onClick={() => {
                  if (!canDrill) return
                  setStack((s) => [
                    ...s,
                    { id, name: feature.properties.name, data: subregions[id] },
                  ])
                }}
              >
                <title>
                  {feature.properties.name}: {feature.properties.value}
                </title>
              </path>
            )
          })}
        </svg>
      </CardContent>
    </Card>
  )
}

export type GeoFeatureProps = {
  id: string
  name: string
  value: number
  parent?: string
}

export type GeoFeature = {
  type: "Feature"
  properties: GeoFeatureProps
  geometry: {
    type: "Polygon"
    coordinates: number[][][]
  }
}

export type GeoCollection = {
  type: "FeatureCollection"
  features: GeoFeature[]
}

/** Schematic regions for demo choropleth (not real geography). */
export const regionsGeo: GeoCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { id: "north", name: "North", value: 82 },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [0, 60],
            [100, 60],
            [100, 100],
            [0, 100],
            [0, 60],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { id: "west", name: "West", value: 64 },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [0, 20],
            [45, 20],
            [45, 60],
            [0, 60],
            [0, 20],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { id: "east", name: "East", value: 71 },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [55, 20],
            [100, 20],
            [100, 60],
            [55, 60],
            [55, 20],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { id: "south", name: "South", value: 48 },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [0, 0],
            [100, 0],
            [100, 20],
            [0, 20],
            [0, 0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { id: "central", name: "Central", value: 93 },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [45, 20],
            [55, 20],
            [55, 60],
            [45, 60],
            [45, 20],
          ],
        ],
      },
    },
  ],
}

export const subregions: Record<string, GeoCollection> = {
  north: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { id: "n1", name: "North-West", value: 70, parent: "north" },
        geometry: {
          type: "Polygon",
          coordinates: [[[0, 60], [50, 60], [50, 100], [0, 100], [0, 60]]],
        },
      },
      {
        type: "Feature",
        properties: { id: "n2", name: "North-East", value: 94, parent: "north" },
        geometry: {
          type: "Polygon",
          coordinates: [[[50, 60], [100, 60], [100, 100], [50, 100], [50, 60]]],
        },
      },
    ],
  },
  west: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { id: "w1", name: "Coast", value: 55, parent: "west" },
        geometry: {
          type: "Polygon",
          coordinates: [[[0, 20], [22, 20], [22, 60], [0, 60], [0, 20]]],
        },
      },
      {
        type: "Feature",
        properties: { id: "w2", name: "Inland", value: 73, parent: "west" },
        geometry: {
          type: "Polygon",
          coordinates: [[[22, 20], [45, 20], [45, 60], [22, 60], [22, 20]]],
        },
      },
    ],
  },
  east: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { id: "e1", name: "Harbor", value: 66, parent: "east" },
        geometry: {
          type: "Polygon",
          coordinates: [[[55, 20], [78, 20], [78, 60], [55, 60], [55, 20]]],
        },
      },
      {
        type: "Feature",
        properties: { id: "e2", name: "Highlands", value: 78, parent: "east" },
        geometry: {
          type: "Polygon",
          coordinates: [[[78, 20], [100, 20], [100, 60], [78, 60], [78, 20]]],
        },
      },
    ],
  },
  south: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { id: "s1", name: "Delta", value: 40, parent: "south" },
        geometry: {
          type: "Polygon",
          coordinates: [[[0, 0], [50, 0], [50, 20], [0, 20], [0, 0]]],
        },
      },
      {
        type: "Feature",
        properties: { id: "s2", name: "Plains", value: 56, parent: "south" },
        geometry: {
          type: "Polygon",
          coordinates: [[[50, 0], [100, 0], [100, 20], [50, 20], [50, 0]]],
        },
      },
    ],
  },
  central: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { id: "c1", name: "Core", value: 93, parent: "central" },
        geometry: {
          type: "Polygon",
          coordinates: [[[45, 20], [55, 20], [55, 60], [45, 60], [45, 20]]],
        },
      },
    ],
  },
}

export const geoPoints = [
  { id: "hq", name: "HQ", lon: 50, lat: 40, value: 120 },
  { id: "dc1", name: "DC North", lon: 30, lat: 80, value: 64 },
  { id: "dc2", name: "DC East", lon: 85, lat: 40, value: 88 },
  { id: "dc3", name: "DC South", lon: 55, lat: 10, value: 42 },
  { id: "dc4", name: "DC West", lon: 15, lat: 40, value: 51 },
]

export function valueToColor(value: number, min = 40, max = 100) {
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)))
  // interpolate between chart-5-ish muted and chart-1
  const r = Math.round(40 + t * 40)
  const g = Math.round(80 + t * 60)
  const b = Math.round(160 - t * 40)
  return `rgb(${r} ${g} ${b})`
}

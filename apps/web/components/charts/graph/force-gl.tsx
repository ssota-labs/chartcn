"use client"

import * as React from "react"
import {
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from "d3-force"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const WIDTH = 900
const HEIGHT = 520

/** Clusters × members. Sized to be plainly past what SVG can carry. */
const CLUSTERS = 14
const PER_CLUSTER = 160
const NODE_COUNT = CLUSTERS * PER_CLUSTER

type GLNode = SimulationNodeDatum & { id: number; cluster: number; r: number }
type GLLink = SimulationLinkDatum<GLNode> & {
  source: number | GLNode
  target: number | GLNode
}

/** Deterministic, so the layout is identical on every load and in snapshots. */
function seeded(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

function buildGraph() {
  const nodes: GLNode[] = Array.from({ length: NODE_COUNT }, (_, i) => ({
    id: i,
    cluster: Math.floor(i / PER_CLUSTER),
    r: 1.6 + seeded(i) * 2.6,
  }))

  const links: GLLink[] = []
  for (let i = 0; i < NODE_COUNT; i++) {
    const cluster = Math.floor(i / PER_CLUSTER)
    const base = cluster * PER_CLUSTER
    // Two intra-cluster edges keep each cluster cohesive.
    for (let k = 0; k < 2; k++) {
      const t = base + Math.floor(seeded(i * 7 + k) * PER_CLUSTER)
      if (t !== i) links.push({ source: i, target: t })
    }
    // A sparse bridge every so often is what separates the clusters visually.
    if (seeded(i * 31) > 0.93) {
      links.push({ source: i, target: Math.floor(seeded(i * 17) * NODE_COUNT) })
    }
  }
  return { nodes, links }
}

/**
 * Resolves a CSS custom property to a 0xRRGGBB int for Pixi.
 *
 * Goes through a canvas rather than getComputedStyle().color: the tokens are
 * authored in lab()/oklch(), and computed style hands those back in the same
 * space, so parsing the numbers out gives garbage. Canvas always resolves to
 * sRGB, whatever the source space.
 */
function tokenToHex(el: HTMLElement, token: string, fallback: number) {
  const raw = getComputedStyle(el).getPropertyValue(token).trim()
  if (!raw) return fallback
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = 1
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if (!ctx) return fallback
  ctx.fillStyle = "#000"
  ctx.fillStyle = raw
  // An unparseable value leaves fillStyle at the previous colour.
  if (ctx.fillStyle === "#000000" && raw !== "#000000") return fallback
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return (r << 16) | (g << 8) | b
}

/**
 * WebGL force graph.
 *
 * Same layout as `chart-graph-force`, different renderer. The SVG version puts
 * one DOM node per mark, which caps it around one to two thousand; this draws
 * every node and edge through Pixi into a single canvas, so the cost is GPU
 * batches rather than DOM.
 *
 * The simulation is stepped on rAF rather than settled up front — at this size
 * a synchronous solve would block the main thread for seconds, and clusters
 * pulling apart is the one case where watching a solver actually reads as
 * information. The loop stops once the layout cools.
 */
export function ChartGraphForceGL() {
  const hostRef = React.useRef<HTMLDivElement>(null)
  const [ready, setReady] = React.useState(false)
  const [failed, setFailed] = React.useState<string | null>(null)
  const graph = React.useMemo(() => buildGraph(), [])

  React.useEffect(() => {
    const host = hostRef.current
    if (!host) return

    let disposed = false
    // Held so cleanup can tear these down whatever stage init reached.
    let cleanup: (() => void) | null = null

    // Imported here rather than at module scope: it keeps Pixi out of the
    // server bundle and off the initial client chunk.
    import("pixi.js")
      .then(async (PIXI) => {
        if (disposed) return

        const app = new PIXI.Application()
        await app.init({
          width: WIDTH,
          height: HEIGHT,
          antialias: true,
          backgroundAlpha: 0,
          resolution: Math.min(window.devicePixelRatio || 1, 2),
          autoDensity: true,
          preference: "webgl",
        })
        if (disposed) {
          app.destroy(true)
          return
        }

        app.canvas.style.width = "100%"
        app.canvas.style.height = "auto"
        host.appendChild(app.canvas)

        const palette = [1, 2, 3, 4, 5].map((i) =>
          tokenToHex(host, `--chart-${i}`, 0x6366f1)
        )
        const edgeColor = tokenToHex(host, "--muted-foreground", 0x8a8a8a)

        const edges = new PIXI.Graphics()
        app.stage.addChild(edges)

        // One texture, reused by every node sprite, so the GPU batches them
        // into a handful of draw calls instead of thousands.
        const dot = new PIXI.Graphics().circle(0, 0, 16).fill(0xffffff)
        const dotTexture = app.renderer.generateTexture(dot)
        dot.destroy()

        const nodeLayer = new PIXI.Container()
        app.stage.addChild(nodeLayer)

        const sprites = graph.nodes.map((n) => {
          const s = new PIXI.Sprite(dotTexture)
          s.anchor.set(0.5)
          s.tint = palette[n.cluster % palette.length]
          s.width = s.height = n.r * 2
          nodeLayer.addChild(s)
          return s
        })

        const sim = forceSimulation(graph.nodes)
          .force(
            "link",
            forceLink<GLNode, GLLink>(graph.links)
              .id((d) => d.id)
              .distance(18)
              .strength(0.7)
          )
          .force("charge", forceManyBody().strength(-14).distanceMax(220))
          .force("center", forceCenter(WIDTH / 2, HEIGHT / 2))
          .stop()

        const reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches

        function draw() {
          edges.clear()
          for (const l of graph.links) {
            const s = l.source as GLNode
            const t = l.target as GLNode
            if (s.x == null || s.y == null || t.x == null || t.y == null)
              continue
            edges.moveTo(s.x, s.y).lineTo(t.x, t.y)
          }
          edges.stroke({ color: edgeColor, width: 0.6, alpha: 0.3 })

          for (let i = 0; i < sprites.length; i++) {
            const n = graph.nodes[i]
            sprites[i].position.set(n.x ?? 0, n.y ?? 0)
          }
        }

        let raf = 0
        if (reduceMotion) {
          sim.tick(200)
          draw()
          setReady(true)
        } else {
          const step = () => {
            if (disposed) return
            // A few ticks per frame settles quickly without stalling input.
            sim.tick(3)
            draw()
            if (sim.alpha() > 0.02) {
              raf = requestAnimationFrame(step)
            }
          }
          raf = requestAnimationFrame(step)
          setReady(true)
        }

        cleanup = () => {
          cancelAnimationFrame(raf)
          sim.stop()
          app.destroy(true, { children: true, texture: true })
        }
      })
      .catch((err: unknown) => {
        if (!disposed) {
          setFailed(err instanceof Error ? err.message : "WebGL unavailable")
        }
      })

    return () => {
      disposed = true
      cleanup?.()
    }
  }, [graph])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Graph — Force Directed (WebGL)</CardTitle>
        <CardDescription>
          {NODE_COUNT.toLocaleString()} nodes ·{" "}
          {graph.links.length.toLocaleString()} edges, rendered through Pixi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          ref={hostRef}
          className="relative w-full overflow-hidden rounded-md"
          style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
        >
          {!ready && !failed && (
            <div className="absolute inset-0 grid place-items-center text-xs text-muted-foreground">
              Building layout…
            </div>
          )}
          {failed && (
            <div className="absolute inset-0 grid place-items-center px-4 text-center text-xs text-muted-foreground">
              Could not start WebGL ({failed}). Use{" "}
              <code className="mx-1">chart-graph-force</code> for the SVG
              renderer.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

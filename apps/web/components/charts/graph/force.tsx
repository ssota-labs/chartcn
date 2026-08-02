"use client"

import * as React from "react"
import {
  forceCenter,
  forceCollide,
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

const WIDTH = 640
const HEIGHT = 360

type GraphNode = SimulationNodeDatum & {
  id: string
  group: number
  /** Drives the node radius — traffic, weight, degree, whatever the data is. */
  value: number
}

type GraphLink = SimulationLinkDatum<GraphNode> & {
  source: string | GraphNode
  target: string | GraphNode
  value: number
}

const nodes: GraphNode[] = [
  { id: "Gateway", group: 0, value: 90 },
  { id: "Auth", group: 1, value: 52 },
  { id: "Orders", group: 1, value: 74 },
  { id: "Payments", group: 2, value: 61 },
  { id: "Ledger", group: 2, value: 48 },
  { id: "Wallet", group: 2, value: 44 },
  { id: "Market data", group: 3, value: 68 },
  { id: "Matching", group: 3, value: 80 },
  { id: "Notifications", group: 4, value: 30 },
  { id: "Audit", group: 4, value: 26 },
]

const links: GraphLink[] = [
  { source: "Gateway", target: "Auth", value: 6 },
  { source: "Gateway", target: "Orders", value: 9 },
  { source: "Gateway", target: "Market data", value: 7 },
  { source: "Orders", target: "Matching", value: 8 },
  { source: "Orders", target: "Payments", value: 5 },
  { source: "Payments", target: "Ledger", value: 6 },
  { source: "Payments", target: "Wallet", value: 4 },
  { source: "Ledger", target: "Audit", value: 3 },
  { source: "Matching", target: "Market data", value: 7 },
  { source: "Matching", target: "Ledger", value: 5 },
  { source: "Auth", target: "Notifications", value: 2 },
  { source: "Orders", target: "Notifications", value: 3 },
]

const GROUP_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

const nodeRadius = (value: number) => 6 + Math.sqrt(value) * 0.9

/** Nodes arrive in waves rather than all at once. */
const STAGGER_MS = 35

function endpointId(end: string | GraphNode) {
  return typeof end === "string" ? end : end.id
}

/**
 * Force-directed graph. Unlike Sankey — which needs a layered, acyclic graph —
 * this takes arbitrary topology: cycles, hubs, disconnected clusters.
 *
 * d3-force computes positions; the SVG is ours. That caps it at roughly a
 * couple of thousand nodes, since every mark is a DOM node. Past that the
 * layout is still fine but the renderer has to change (canvas or WebGL).
 */
export function ChartGraphForce() {
  const [, setTick] = React.useState(0)
  const [active, setActive] = React.useState<string | null>(null)
  const [dragging, setDragging] = React.useState<string | null>(null)
  const svgRef = React.useRef<SVGSVGElement>(null)

  // Built once via a lazy initialiser, so positions exist before the first
  // paint and no ref is read during render. The simulation mutates its nodes
  // in place, so the component re-renders off a tick counter.
  const [{ sim, simNodes, simLinks }] = React.useState(() => {
    const simNodes = nodes.map((n) => ({ ...n }))
    const simLinks = links.map((l) => ({ ...l }))
    const sim = forceSimulation(simNodes)
      .force(
        "link",
        forceLink<GraphNode, GraphLink>(simLinks)
          .id((d) => d.id)
          .distance(90)
          .strength(0.35)
      )
      .force("charge", forceManyBody().strength(-320))
      .force("center", forceCenter(WIDTH / 2, HEIGHT / 2))
      .force(
        "collide",
        forceCollide<GraphNode>().radius((d) => nodeRadius(d.value) + 10)
      )
      // stop() first: forceSimulation starts its own timer on construction.
      .stop()

    // Settle up front. Animating the solve would be motion that carries no
    // meaning, and it would pin the main thread while it ran.
    sim.tick(220)
    return { sim, simNodes, simLinks }
  })

  React.useEffect(() => {
    // Only needed while dragging — that is the one time positions change.
    sim.on("tick", () => setTick((t) => t + 1))
    return () => {
      sim.on("tick", null)
      sim.stop()
    }
  }, [sim])

  const neighbours = React.useMemo(() => {
    const map = new Map<string, Set<string>>()
    for (const l of simLinks) {
      const s = endpointId(l.source)
      const t = endpointId(l.target)
      if (!map.has(s)) map.set(s, new Set())
      if (!map.has(t)) map.set(t, new Set())
      map.get(s)!.add(t)
      map.get(t)!.add(s)
    }
    return map
  }, [simLinks])

  const isLit = (id: string) =>
    active == null || active === id || !!neighbours.get(active)?.has(id)

  /** Converts a pointer event to the SVG's own coordinate space. */
  function toSvgPoint(event: React.PointerEvent) {
    const svg = svgRef.current
    if (!svg) return null
    const rect = svg.getBoundingClientRect()
    return {
      x: ((event.clientX - rect.left) / rect.width) * WIDTH,
      y: ((event.clientY - rect.top) / rect.height) * HEIGHT,
    }
  }

  function onPointerDown(event: React.PointerEvent, node: GraphNode) {
    event.currentTarget.setPointerCapture(event.pointerId)
    setDragging(node.id)
    node.fx = node.x
    node.fy = node.y
    sim.alphaTarget(0.3).restart()
  }

  function onPointerMove(event: React.PointerEvent, node: GraphNode) {
    if (dragging !== node.id) return
    const p = toSvgPoint(event)
    if (!p) return
    node.fx = p.x
    node.fy = p.y
  }

  function onPointerUp(node: GraphNode) {
    if (dragging !== node.id) return
    setDragging(null)
    // Releasing the pin lets the layout relax back around the new position.
    node.fx = null
    node.fy = null
    sim.alphaTarget(0)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Graph — Force Directed</CardTitle>
        <CardDescription>
          Service dependencies · hover to isolate, drag to reposition
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="h-auto w-full touch-none"
            role="img"
            aria-label="Force directed graph of service dependencies"
            onPointerLeave={() => setActive(null)}
          >
            <g>
              {simLinks.map((l, i) => {
                const s = l.source as GraphNode
                const t = l.target as GraphNode
                if (s?.x == null || t?.x == null) return null
                const lit = isLit(s.id) && isLit(t.id)
                return (
                  <line
                    key={`${endpointId(l.source)}-${endpointId(l.target)}`}
                    x1={s.x}
                    y1={s.y}
                    x2={t.x}
                    y2={t.y}
                    stroke="var(--muted-foreground)"
                    strokeWidth={Math.max(1, l.value * 0.28)}
                    strokeOpacity={active == null ? 0.28 : lit ? 0.55 : 0.06}
                    strokeLinecap="round"
                    className="animate-in fade-in fill-mode-backwards duration-500 ease-out transition-[stroke-opacity] motion-reduce:animate-none"
                    style={{ animationDelay: `${i * STAGGER_MS}ms` }}
                  />
                )
              })}
            </g>
            <g>
              {simNodes.map((n, i) => {
                if (n.x == null || n.y == null) return null
                const r = nodeRadius(n.value)
                const lit = isLit(n.id)
                return (
                  <g
                    key={n.id}
                    className="animate-in fade-in zoom-in-50 fill-mode-backwards duration-[500ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:animate-none"
                    style={{
                      transformOrigin: `${n.x}px ${n.y}px`,
                      animationDelay: `${140 + i * STAGGER_MS}ms`,
                    }}
                  >
                    <g
                      className="cursor-grab transition-opacity duration-150 ease-out active:cursor-grabbing motion-reduce:transition-none"
                      opacity={lit ? 1 : 0.25}
                      onMouseEnter={() => setActive(n.id)}
                      onPointerDown={(e) => onPointerDown(e, n)}
                      onPointerMove={(e) => onPointerMove(e, n)}
                      onPointerUp={() => onPointerUp(n)}
                      onPointerCancel={() => onPointerUp(n)}
                    >
                      {/* Widens the grab area past the visible disc. */}
                      <circle cx={n.x} cy={n.y} r={r + 10} fill="transparent" />
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r={r}
                        fill={GROUP_COLORS[n.group % GROUP_COLORS.length]}
                        stroke="var(--card)"
                        strokeWidth={2}
                      />
                      <text
                        x={n.x}
                        y={n.y + r + 13}
                        textAnchor="middle"
                        stroke="var(--card)"
                        strokeWidth={3}
                        className="pointer-events-none fill-foreground text-[11px] font-medium [paint-order:stroke]"
                      >
                        {n.id}
                      </text>
                    </g>
                  </g>
                )
              })}
            </g>
          </svg>
        </div>
      </CardContent>
    </Card>
  )
}

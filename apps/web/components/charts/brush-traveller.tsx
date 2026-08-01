"use client"

/**
 * Shared brush handle.
 *
 * Recharts' default traveller is a bare 5px rect with hardcoded #fff grip
 * lines, which neither reads as a grabbable control nor gives the pointer much
 * to aim at. This one is rounded, uses theme tokens, and pads its hit area well
 * past the visible bar.
 *
 * Pass it to `<Brush traveller={BrushTraveller} />`.
 */
export function BrushTraveller({
  x,
  y,
  width,
  height,
}: {
  x: number
  y: number
  width: number
  height: number
}) {
  const cx = x + width / 2
  return (
    <g className="cursor-col-resize">
      <rect
        x={cx - 14}
        y={y - 6}
        width={28}
        height={height + 12}
        fill="transparent"
      />
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={3}
        className="fill-background stroke-border"
      />
      {[-2, 2].map((offset) => (
        <line
          key={offset}
          x1={cx + offset}
          x2={cx + offset}
          y1={y + 9}
          y2={y + height - 9}
          strokeWidth={1}
          strokeLinecap="round"
          className="stroke-muted-foreground"
        />
      ))}
    </g>
  )
}

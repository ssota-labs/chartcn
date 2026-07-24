import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

import {
  ChartAreaBasic,
  ChartAreaStacked,
  ChartBarBasic,
  ChartBarGrouped,
  ChartLineBasic,
  ChartLineMulti,
  ChartPieBasic,
  ChartPieDonut,
  ChartPieLabeled,
  ChartPieLegend,
  ChartPieNested,
  ChartPieInteractive,
  ChartPieCenterKpi,
  ChartPieTooltipPercent,
  ChartPieTooltipAbsolute,
  ChartRadialBasic,
  ChartRadialStacked,
  ChartRadialText,
  ChartRadialLabel,
  ChartRadialProgress,
  ChartRadialGauge,
  ChartRadialGrid,
  ChartRadialShape,
  ChartRadarBasic,
  ChartRadarMulti,
  ChartRadarDots,
  ChartRadarLinesOnly,
  ChartRadarFilled,
  ChartRadarStroke,
  ChartRadarGridCircle,
  ChartRadarGridPolygon,
  ChartRadarLegendInteractive,
} from '@/components/charts';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    ChartAreaBasic,
    ChartAreaStacked,
    ChartBarBasic,
    ChartBarGrouped,
    ChartLineBasic,
    ChartLineMulti,
    ChartPieBasic,
    ChartPieDonut,
    ChartPieLabeled,
    ChartPieLegend,
    ChartPieNested,
    ChartPieInteractive,
    ChartPieCenterKpi,
    ChartPieTooltipPercent,
    ChartPieTooltipAbsolute,
    ChartRadialBasic,
    ChartRadialStacked,
    ChartRadialText,
    ChartRadialLabel,
    ChartRadialProgress,
    ChartRadialGauge,
    ChartRadialGrid,
    ChartRadialShape,
    ChartRadarBasic,
    ChartRadarMulti,
    ChartRadarDots,
    ChartRadarLinesOnly,
    ChartRadarFilled,
    ChartRadarStroke,
    ChartRadarGridCircle,
    ChartRadarGridPolygon,
    ChartRadarLegendInteractive,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}

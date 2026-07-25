import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

import {
  ChartAreaBasic,
  ChartAreaStacked,
  ChartBarBasic,
  ChartBarGrouped,
  ChartLineBasic,
  ChartLineMulti,
  ChartHistogram,
  ChartBoxPlot,
  ChartHeatmapCalendar,
  ChartHeatmapCorrelation,
  ChartWaterfall,
  ChartPareto,
  ChartSlope,
  ChartSmallMultiples,
  ChartBullet,
  ChartCandlestick,
  ChartVolumeUnderPrice,
  ChartMovingAverage,
  ChartBollinger,
  ChartMacdRsi,
  ChartDrawdown,
  ChartHighLow,
  ChartFunnelTemplate,
  ChartAreaBrush,
  ChartLineBrush,
  ChartLineReference,
  ChartBarError,
  ChartBarDiverging,
  ChartBarHorizontal,
  ChartBarRange,
  ChartScatterError,
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
    ChartHistogram,
    ChartBoxPlot,
    ChartHeatmapCalendar,
    ChartHeatmapCorrelation,
    ChartWaterfall,
    ChartPareto,
    ChartSlope,
    ChartSmallMultiples,
    ChartBullet,
    ChartCandlestick,
    ChartVolumeUnderPrice,
    ChartMovingAverage,
    ChartBollinger,
    ChartMacdRsi,
    ChartDrawdown,
    ChartHighLow,
    ChartFunnelTemplate,
    ChartAreaBrush,
    ChartLineBrush,
    ChartLineReference,
    ChartBarError,
    ChartBarDiverging,
    ChartBarHorizontal,
    ChartBarRange,
    ChartScatterError,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}

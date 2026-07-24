import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

import {
  ChartAreaBasic,
  ChartAreaStacked,
  ChartBarBasic,
  ChartBarGrouped,
  ChartLineBasic,
  ChartLineMulti,
  ChartCohortHeatmap,
  ChartRetentionCurve,
  ChartFunnelSteps,
  ChartFunnelTrend,
  ChartFlowPath,
  ChartInsightsLine,
  ChartSegmentComparison,
  ChartMetricSparkline,
  ChartPeriodComparison,
  ChartConversionDualAxis,
  ChartStickiness,
  ChartEventFrequency,
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
    ChartCohortHeatmap,
    ChartRetentionCurve,
    ChartFunnelSteps,
    ChartFunnelTrend,
    ChartFlowPath,
    ChartInsightsLine,
    ChartSegmentComparison,
    ChartMetricSparkline,
    ChartPeriodComparison,
    ChartConversionDualAxis,
    ChartStickiness,
    ChartEventFrequency,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}

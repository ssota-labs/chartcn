import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

import {
  ChartAreaBasic,
  ChartAreaStacked,
  ChartBarBasic,
  ChartBarGrouped,
  ChartLineBasic,
  ChartLineMulti,
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
import { JsonRenderChartDemo } from '@/components/registry-demos/json-render-demo';
import { MdxEmbedDemo } from '@/components/registry-demos/mdx-embed-demo';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    ChartAreaBasic,
    ChartAreaStacked,
    ChartBarBasic,
    ChartBarGrouped,
    ChartLineBasic,
    ChartLineMulti,
    JsonRenderChartDemo,
    MdxEmbedDemo,
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

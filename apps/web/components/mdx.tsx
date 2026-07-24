import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

import {
  ChartAreaBasic,
  ChartAreaStacked,
  ChartBarBasic,
  ChartBarGrouped,
  ChartLineBasic,
  ChartLineMulti,
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
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}

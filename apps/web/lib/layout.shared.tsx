import type { BaseLayoutProps, LinkItemType } from 'fumadocs-ui/layouts/shared';
import { ChartColumn, Package } from 'lucide-react';
import { appName, gitConfig } from './shared';

// `on: 'nav'` scopes these to the top navbar only. Without it, fumadocs-ui
// renders link items in the docs sidebar too (as `menuItems`), which
// duplicates the "Charts" and "Registry" folders already in the page tree.
const links: LinkItemType[] = [
  {
    icon: <ChartColumn />,
    text: 'Charts',
    url: '/docs/charts',
    active: 'nested-url',
    on: 'nav',
  },
  {
    icon: <Package />,
    text: 'Registry',
    url: '/docs/registry',
    active: 'nested-url',
    on: 'nav',
  },
];

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // JSX supported
      title: appName,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links,
  };
}

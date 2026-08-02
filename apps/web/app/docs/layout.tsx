import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...baseOptions()}
      // Every category (charts, analysis, analytics, finance, graph, registry)
      // is now a real folder, so forcing all of them open (the previous
      // `defaultOpenLevel: 1`, back when the tree was a flat list of 60+
      // pages) would dump every leaf page into view at once.
      //
      // We don't need that as a hydration fallback either: fumadocs-ui's
      // `SidebarFolder` treats a folder as open whenever it sits on the path
      // to the active page (`active || defaultOpenLevel >= depth`), and
      // `active` is derived from the URL on every render — server and client
      // alike — so the folder containing whatever page you're on is already
      // expanded in the first paint, before any collapsible click handler
      // hydrates. Leaving `defaultOpenLevel` at its default (0) keeps every
      // other folder collapsed and the sidebar scannable.
      sidebar={{ defaultOpenLevel: 0 }}
    >
      {children}
    </DocsLayout>
  );
}

import { getPageImageUrl, getPageMarkdownUrl, source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { gitConfig } from '@/lib/shared';
import { ReadingProgress } from '@/components/docs/reading-progress';
import { TocBackToTop } from '@/components/docs/toc-back-to-top';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;

  // Card-grid index pages (charts/analysis/analytics/finance/graph) have no
  // `##` headings. We always pass a TOC footer below, which defeats fumadocs'
  // own "empty toc" placeholder (it only kicks in when footer is unset), so
  // without this the desktop rail would render a bordered "No headings" box.
  // Driving both the rail and the progress bar off this same flag is safe
  // here specifically: every headingless page in this repo is a short card
  // grid (2-16 cards, no long prose), so "no toc" and "nothing worth a
  // scroll indicator" happen to coincide for our content, not in general.
  const hasToc = page.data.toc.length > 0;

  return (
    <>
      {hasToc && <ReadingProgress />}
      <DocsPage
        toc={page.data.toc}
        full={page.data.full}
        breadcrumb={{ enabled: true }}
        footer={{ enabled: true }}
        tableOfContent={{
          enabled: hasToc,
          // 'normal' + thumbBox gives a moving marble that tracks scroll
          // position along the TOC rail, which reads better than 'clerk' for
          // a flat list of same-depth `##` headings (no step numbering, no
          // nested indentation to justify clerk's bracket style).
          style: 'normal',
          list: { thumbBox: true },
          footer: <TocBackToTop />,
        }}
      >
        <DocsTitle className="tracking-tight">{page.data.title}</DocsTitle>
        <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
        <div className="flex flex-row gap-2 items-center border-b pb-6">
          <MarkdownCopyButton markdownUrl={markdownUrl} />
          <ViewOptionsPopover
            markdownUrl={markdownUrl}
            githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${page.path}`}
          />
        </div>
        <DocsBody>
          <MDX
            components={getMDXComponents({
              // this allows you to link to other pages with relative file paths
              a: createRelativeLink(source, page),
            })}
          />
        </DocsBody>
      </DocsPage>
    </>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImageUrl(page).url,
    },
  };
}

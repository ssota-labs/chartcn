import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-6 px-6 py-16">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-fd-muted-foreground">chartcn</p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Chart demos for the shadcn registry
        </h1>
        <p className="text-lg text-fd-muted-foreground">
          Browse area, bar, line and upcoming chart variants built with shadcn
          charts and Recharts. Installable registry items and agent tooling come
          next.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/docs/charts"
          className="inline-flex h-10 items-center justify-center rounded-md bg-fd-primary px-4 text-sm font-medium text-fd-primary-foreground"
        >
          Browse charts
        </Link>
        <Link
          href="/docs"
          className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium"
        >
          Documentation
        </Link>
      </div>
    </div>
  );
}

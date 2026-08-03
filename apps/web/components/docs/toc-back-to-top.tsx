'use client';

import { ArrowUp } from 'lucide-react';

import { cn } from '@/lib/cn';

/**
 * "Back to top" control rendered in the TOC footer slot. Useful once a
 * chart doc page has scrolled through several ~600px sections and the
 * sidebar nav is long out of view.
 */
export function TocBackToTop({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={cn(
        'mt-2 inline-flex items-center gap-1.5 border-t pt-3 text-xs text-fd-muted-foreground transition-colors hover:text-fd-foreground',
        className,
      )}
    >
      <ArrowUp className="size-3.5" />
      Back to top
    </button>
  );
}

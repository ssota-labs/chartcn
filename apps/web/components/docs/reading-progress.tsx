'use client';

import { useEffect, useRef } from 'react';

/**
 * Thin, fixed reading-progress bar pinned to the very top of the viewport.
 *
 * The built-in TOC "thumb" only reflects which heading is active, which is a
 * poor signal on chart doc pages: each `##` section is ~600px of interactive
 * chart, so the thumb can sit still for a long scroll. This bar tracks raw
 * document scroll position instead, giving continuous feedback for how far
 * through the page the reader is.
 */
export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const scrollable = (doc.scrollHeight || document.body.scrollHeight) - doc.clientHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, scrollTop / scrollable)) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    // rAF is suspended while the tab is hidden/backgrounded, so scroll
    // events that fire while away (or just a stale layout) never repaint
    // the bar until the next scroll after returning. Re-sync immediately —
    // not via rAF, which wouldn't run until the next paint request — when
    // the page becomes visible again.
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') update();
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-50 h-[2px] bg-transparent">
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-fd-primary/70 transition-transform duration-150 ease-out motion-reduce:transition-none"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}

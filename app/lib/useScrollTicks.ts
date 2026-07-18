"use client";

import { useEffect } from "react";
import { playScroll } from "./sound";

/* ----------------------------------------------------------------------------
 * Scroll "detent" ticks — like clicking down the notches of a ruler.
 * The full page scroll range is split into `detents` equal steps; a single
 * subtle tick fires each time the scroll position crosses into a new step.
 * Pass the number of ruler lines in the nav so ticks map 1:1 to the lines.
 * --------------------------------------------------------------------------*/
export function useScrollTicks(detents: number) {
  useEffect(() => {
    if (detents < 1) return;

    const indexOf = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      return Math.min(detents - 1, Math.max(0, Math.floor(progress * detents)));
    };

    let last = indexOf();
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const idx = indexOf();
        if (idx !== last) {
          last = idx; // one tick per detent crossing (no machine-gun on fast scroll)
          playScroll();
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [detents]);
}

/** Total ruler lines for a nav: one per item + two minor ticks between each. */
export function rulerLines(itemCount: number) {
  return itemCount + Math.max(0, itemCount - 1) * 2;
}

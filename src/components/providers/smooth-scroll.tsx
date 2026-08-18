"use client";

/**
 * Lenis smooth scrolling.
 *
 * Runs on rAF, drives only scroll position, and is skipped entirely for readers who ask
 * for reduced motion. Disabling native `scroll-behavior: smooth` while Lenis is active
 * avoids the two easing curves fighting over anchor jumps.
 *
 * `prevent` matters: Lenis captures the wheel on the whole document, which otherwise
 * kills scrolling inside overlays (Radix select menus, the calendar popover, any
 * `overflow` container). Anything inside a Radix portal, a listbox, or an element marked
 * `data-lenis-prevent` keeps native wheel behaviour.
 */

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

const NATIVE_SCROLL_SELECTOR = [
  "[data-lenis-prevent]",
  "[data-radix-popper-content-wrapper]",
  "[data-radix-select-viewport]",
  "[role='listbox']",
  "[role='dialog']",
].join(",");

export function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (query.matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      touchMultiplier: 1.6,
      prevent: (node) => Boolean(node.closest?.(NATIVE_SCROLL_SELECTOR)),
    });

    // Programmatic scrolls (router restores, tests, widgets) must go through Lenis or
    // it animates back to its own target. Expose the instance for those callers.
    (window as unknown as { lenis?: Lenis }).lenis = lenis;
    lenisRef.current = lenis;

    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // In-page anchors go through Lenis so they use the same easing as the wheel.
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -96 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      delete (window as unknown as { lenis?: Lenis }).lenis;
      lenisRef.current = null;
      lenis.destroy();
      root.style.scrollBehavior = previousBehavior;
    };
  }, []);

  /*
    Route changes are where Lenis "sticks": Next resets the native scroll position, but
    Lenis keeps its previous internal target, so the next wheel event fights a stale
    value and the page refuses to move. On every navigation, re-measure the new page and
    adopt the browser's actual scroll position as the target. A second pass catches
    late-loading images changing the page height.
  */
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    const sync = () => {
      lenis.resize();
      lenis.scrollTo(window.scrollY, { immediate: true, force: true });
    };

    const raf = requestAnimationFrame(sync);
    const late = setTimeout(sync, 600);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(late);
    };
  }, [pathname]);

  return null;
}

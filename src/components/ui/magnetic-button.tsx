"use client";

/**
 * Magnetic button, in the Aceternity idiom.
 *
 * Pointer position drives motion values directly, never React state, so the tree does not
 * re-render on every mousemove. Under reduced motion the magnetism is disabled and the
 * button behaves like any other link.
 *
 * Motion justification: this is the last call to action on the page. The pull is hover
 * feedback that makes the target feel easier to hit.
 */

import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

const SPRING = { stiffness: 220, damping: 18, mass: 0.4 };

export function MagneticButton({
  href,
  children,
  className,
  strength = 0.35,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), SPRING);
  const y = useSpring(useMotionValue(0), SPRING);

  function handleMove(event: React.MouseEvent<HTMLAnchorElement>) {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={reduce ? undefined : { x, y }}
      className={cn(
        "inline-flex items-center justify-center btn-gold rounded-lg px-8 py-4 text-sm font-semibold text-brand-ink transition-colors duration-200 hover:bg-[#b0966f] active:scale-[0.98]",
        className,
      )}
    >
      {children}
    </motion.a>
  );
}

/** Non-magnetic sibling, kept here so both closing CTAs share one shape scale. */
export function GhostButton({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-lg border border-line bg-surface px-8 py-4 text-sm font-semibold text-ink transition-all duration-200 hover:-translate-y-px hover:border-brand-strong hover:text-brand-strong active:translate-y-0 active:scale-[0.98]",
        className,
      )}
    >
      {children}
    </Link>
  );
}

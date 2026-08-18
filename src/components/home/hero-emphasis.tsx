"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * The emphasised word in the hero headline.
 *
 * The gold rule draws itself from left to right once the headline has finished rising,
 * so the reveal reads as a single sentence landing rather than two competing entrances.
 * `scaleX` keeps it on the compositor. Reduced motion renders the finished rule.
 */
export function HeroEmphasis({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <em className="relative inline-block pb-1 leading-[1.15] italic">
      {children}
      <motion.span
        aria-hidden="true"
        initial={reduce ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.95 }}
        style={{ originX: 0 }}
        className="absolute inset-x-0 -bottom-0.5 block h-[2px] origin-left rounded-full bg-gradient-to-r from-brand/0 via-brand to-brand/0"
      />
    </em>
  );
}

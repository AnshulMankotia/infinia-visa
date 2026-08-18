"use client";

/** Horizontal share bar: cream track, gold fill that wipes out from zero on mount. */

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export function Meter({
  pct,
  delay = 0,
  className,
}: {
  /** 0–100. */
  pct: number;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <span className={cn("block h-1.5 overflow-hidden rounded-full bg-paper", className)}>
      <motion.span
        className="block h-full rounded-full bg-gradient-to-r from-brand to-brand-strong"
        initial={reduce ? false : { width: 0 }}
        animate={{ width: `${Math.max(pct, 1.5)}%` }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
      />
    </span>
  );
}

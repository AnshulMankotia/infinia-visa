"use client";

/**
 * The one card shell every dashboard block sits in.
 *
 * White surface, hairline border, 10px corner — the site's shape rule. The header is a
 * fixed 48px strip with a coloured status dot, a small-caps title and an optional meta
 * figure pinned right, so titles line up across a row no matter how tall the bodies get.
 */

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Panel({
  children,
  className,
  index = 0,
  hover = false,
}: {
  children: React.ReactNode;
  className?: string;
  /** Stagger position for the page entrance. Each step adds 70ms. */
  index?: number;
  /** Lift on hover. Only for cards that behave like a target, not for the big readouts. */
  hover?: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.section
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE, delay: index * 0.07 }}
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border border-line bg-surface",
        "shadow-[0_1px_2px_-1px_rgb(31_26_21/0.06)]",
        hover &&
          "transition-shadow duration-300 hover:shadow-[0_10px_30px_-18px_rgb(31_26_21/0.35)]",
        className,
      )}
    >
      {children}
    </motion.section>
  );
}

export function PanelHead({
  title,
  meta,
  action,
  tone = "brand",
}: {
  title: string;
  /** Right-aligned figure, e.g. "133 total". */
  meta?: React.ReactNode;
  /** Replaces `meta` when the corner needs a control instead of a number. */
  action?: React.ReactNode;
  tone?: "brand" | "alert";
}) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-2.5 border-b border-line px-4">
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 shrink-0 rounded-full",
          tone === "alert" ? "bg-destructive" : "bg-brand",
        )}
      />
      <h2 className="truncate font-sans text-[11px] font-medium tracking-[0.14em] text-ink uppercase">
        {title}
      </h2>
      <div className="ml-auto shrink-0">
        {action ?? (
          <span className="numeric text-xs text-ink-soft">{meta}</span>
        )}
      </div>
    </header>
  );
}

/** Two-letter corridor code in the small mono chip used across the operations tables. */
export function CountryCode({ code }: { code: string }) {
  return (
    <span className="numeric w-6 shrink-0 text-[10px] font-medium tracking-[0.08em] text-ink-soft">
      {code}
    </span>
  );
}

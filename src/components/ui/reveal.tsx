"use client";

/**
 * Scroll reveal primitive.
 *
 * One shared entrance for every section: a short rise and fade on ease-out-quint, played
 * once when the block enters the viewport. Children can be staggered by passing an index.
 * Only `transform` and `opacity` animate, and reduced motion renders the final state
 * immediately.
 */

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

type RevealProps = {
  children: React.ReactNode;
  /** Stagger position. Each step adds 90ms. */
  index?: number;
  /** Travel distance in px. */
  y?: number;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "header";
} & Omit<HTMLMotionProps<"div">, "children" | "ref">;

export function Reveal({
  children,
  index = 0,
  y = 18,
  delay = 0,
  className,
  as = "div",
  ...rest
}: RevealProps) {
  const reduce = useReducedMotion();
  // Element-specific motion props are structurally incompatible; the shared subset is all
  // this component uses, so widen once here rather than at every call site.
  const Tag = motion[as] as typeof motion.div;

  return (
    <Tag
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.6, ease: EASE, delay: delay + index * 0.09 }}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Page-load entrance for above-the-fold content, which never waits for a scroll. */
export function Rise({
  children,
  index = 0,
  y = 20,
  className,
}: {
  children: React.ReactNode;
  index?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay: index * 0.11 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

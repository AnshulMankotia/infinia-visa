"use client";

/**
 * Aceternity "Sticky Scroll Reveal", reworked for this project.
 *
 * Changes from the upstream copy: it tracks page scroll instead of nesting its own
 * scroll container, the hardcoded dark backgrounds and rainbow gradients are replaced by
 * design tokens, and the sticky panel renders a real component preview rather than a
 * coloured rectangle.
 *
 * Motion justification: the four steps are a sequence, so scroll position maps to
 * progress through the sequence. Under reduced motion every step renders at full
 * opacity and the panel shows the first step.
 */

import React, { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { cn } from "@/lib/utils";

export type StickyScrollItem = {
  title: string;
  description: string;
  content?: React.ReactNode;
};

export const StickyScroll = ({
  content,
  className,
  contentClassName,
}: {
  content: StickyScrollItem[];
  className?: string;
  contentClassName?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [activeCard, setActiveCard] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const index = Math.min(
      content.length - 1,
      Math.max(0, Math.floor(latest * content.length)),
    );
    setActiveCard(index);
  });

  const active = reduce ? 0 : activeCard;

  return (
    <div
      ref={ref}
      className={cn("relative grid gap-10 lg:grid-cols-[1fr_minmax(0,26rem)]", className)}
    >
      {/* Steps. Single column under lg. */}
      <ol className="relative">
        {content.map((item, index) => {
          const isActive = !reduce && index === active;
          return (
            <li
              key={item.title}
              className="border-t border-line py-10 first:border-t-0 first:pt-0 lg:py-16"
            >
              <motion.div
                animate={{ opacity: reduce || isActive ? 1 : 0.42 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-baseline gap-4">
                  <span
                    className={cn(
                      "numeric text-sm transition-colors",
                      isActive ? "text-brand" : "text-ink-soft",
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-heading text-2xl text-ink md:text-3xl">
                    {item.title}
                  </h3>
                </div>
                <p className="mt-3 max-w-[52ch] pl-9 text-ink-soft">{item.description}</p>

                {/* Under lg the sticky panel is hidden, so the preview rides with its step. */}
                {item.content ? (
                  <div className="mt-6 pl-9 lg:hidden">{item.content}</div>
                ) : null}
              </motion.div>
            </li>
          );
        })}
      </ol>

      {/* Sticky preview panel, desktop only. */}
      <div className="hidden lg:block">
        <div
          className={cn(
            "sticky top-28 overflow-hidden rounded-xl border border-line bg-surface p-5",
            contentClassName,
          )}
        >
          <motion.div
            key={active}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {content[active]?.content ?? null}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

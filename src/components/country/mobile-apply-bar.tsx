"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useState } from "react";
import { totalFee, type Country } from "@/data/countries";

/**
 * Compact apply bar for phones, where the sticky rail is stacked out of view.
 *
 * Motion justification: it appears once the hero CTA has scrolled away, so the primary
 * action is never more than a thumb away. State change, not decoration.
 */
export function MobileApplyBar({ country }: { country: Country }) {
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setShown(latest > 700);
  });

  const total = totalFee(country);

  return (
    <motion.div
      initial={false}
      animate={reduce ? undefined : { y: shown ? 0 : 120 }}
      transition={{ type: "spring", stiffness: 260, damping: 32 }}
      aria-hidden={!shown}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur-md lg:hidden"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-ink-soft">From</p>
          <p className="numeric font-heading text-xl text-ink">
            {total === null ? "At checkout" : `$${total}`}
          </p>
        </div>
        <a
          href={`/apply/${country.slug}`}
          tabIndex={shown ? 0 : -1}
          className="inline-flex h-11 flex-1 max-w-56 items-center justify-center btn-gold rounded-lg text-sm font-semibold text-brand-ink transition-colors duration-200 hover:bg-[#b0966f] active:scale-[0.98]"
        >
          Apply now
        </a>
      </div>
    </motion.div>
  );
}

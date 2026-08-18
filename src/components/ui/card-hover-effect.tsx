"use client";

/**
 * Aceternity "Card Hover Effect", generalised for this project.
 *
 * A shared tint sweeps between grid cells via `layoutId` while each cell renders its own
 * content. Upstream hardcoded dark cards and required links; this version takes children
 * and uses the brand tokens.
 */

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

export function HoverGrid({
  children,
  className,
}: {
  children: React.ReactNode[];
  className?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {children.map((child, index) => (
        <div
          key={index}
          className="group relative h-full p-2"
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
        >
          <AnimatePresence>
            {hovered === index && (
              <motion.span
                className="absolute inset-0 block rounded-2xl bg-brand-tint"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.15 } }}
                exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
              />
            )}
          </AnimatePresence>
          <div className="relative z-20 h-full">{child}</div>
        </div>
      ))}
    </div>
  );
}

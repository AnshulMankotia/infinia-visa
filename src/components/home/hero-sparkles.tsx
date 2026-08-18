"use client";

import { useReducedMotion } from "motion/react";
import { SparklesCore } from "@/components/ui/sparkles";
import { cn } from "@/lib/utils";

/**
 * Gold sparkle band under the hero trust chips. Decorative shimmer in the brand gold,
 * masked to fade at the edges. Skipped entirely under reduced motion.
 */
export function HeroSparkles({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative mx-auto h-24 w-full max-w-[36rem] overflow-hidden [mask-image:radial-gradient(60%_100%_at_50%_0%,white_35%,transparent_100%)]",
        className,
      )}
    >
      {/* Hairlines the sparkles appear to fall from. */}
      <div className="absolute top-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-strong to-transparent" />
      <div className="absolute top-0 left-1/2 h-[3px] w-1/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-brand to-transparent blur-sm" />

      <SparklesCore
        id="hero-sparkles"
        background="transparent"
        minSize={0.5}
        maxSize={1.7}
        particleDensity={130}
        speed={2}
        particleColor="#8a6a3e"
        className="h-full w-full"
      />
    </div>
  );
}

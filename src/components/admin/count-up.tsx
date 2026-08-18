"use client";

/**
 * Odometer for the KPI figures.
 *
 * Counts from zero on mount over ~1.1s on the site's ease-out-quint, so the four cards
 * settle together rather than popping. Reduced motion prints the final value immediately.
 */

import { useEffect, useState } from "react";
import { animate, useReducedMotion } from "motion/react";

export function CountUp({
  value,
  decimals = 0,
  delay = 0,
}: {
  value: number;
  decimals?: number;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? value : 0);

  useEffect(() => {
    if (reduce) {
      setShown(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.1,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setShown(v),
    });
    return () => controls.stop();
  }, [value, delay, reduce]);

  return <>{shown.toFixed(decimals)}</>;
}

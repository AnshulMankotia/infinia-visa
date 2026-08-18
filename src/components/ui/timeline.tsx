"use client";

/**
 * Aceternity "Timeline", reworked for this project.
 *
 * Changes from the upstream copy: the hardcoded heading and body copy are gone (the
 * caller owns the section header), the purple-to-blue beam is a single brand-coloured
 * line, and the rail is measured with a ResizeObserver so it stays correct when the
 * content reflows.
 *
 * Motion justification: the beam is a read-progress indicator through an ordered
 * process. It fills as the reader moves down the steps.
 */

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

export interface TimelineEntry {
  /** Short label shown in the left rail, e.g. the party responsible for the step. */
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry.contentRect.height);
    });
    observer.observe(node);
    setHeight(node.getBoundingClientRect().height);

    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 20%", "end 60%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div ref={containerRef} className="w-full">
      <div ref={ref} className="relative">
        {data.map((item, index) => (
          <div key={index} className="flex justify-start pt-10 md:gap-10 md:pt-16">
            <div className="sticky top-32 z-10 flex max-w-xs flex-col items-start self-start md:w-full md:max-w-[16rem] md:flex-row md:items-center">
              <span className="absolute left-0 grid size-8 place-items-center rounded-full border border-line bg-surface">
                <span className="size-2.5 rounded-full bg-brand" />
              </span>
              <span className="numeric hidden pl-14 text-xs tracking-[0.14em] text-ink-soft uppercase md:block">
                {item.title}
              </span>
            </div>

            <div className="relative w-full pr-2 pl-14 md:pl-4">
              <span className="numeric mb-3 block text-xs tracking-[0.14em] text-ink-soft uppercase md:hidden">
                {item.title}
              </span>
              {item.content}
            </div>
          </div>
        ))}

        {/* Rail plus fill. */}
        <div
          style={{ height: `${height}px` }}
          className="absolute top-0 left-4 w-px overflow-hidden bg-line [mask-image:linear-gradient(to_bottom,transparent_0%,black_8%,black_92%,transparent_100%)]"
        >
          <motion.div
            style={
              reduce
                ? { height: "100%", opacity: 1 }
                : { height: heightTransform, opacity: opacityTransform }
            }
            className="absolute inset-x-0 top-0 w-px rounded-full bg-brand"
          />
        </div>
      </div>
    </div>
  );
};

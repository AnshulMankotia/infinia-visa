"use client";

/**
 * "Who does what, and when." as a staircase.
 *
 * Each step is indented one run further right, and the tracker is a stepped path that
 * descends and turns with the stairs, drawn in by scroll progress. As the tracker
 * reaches a node, that step switches to its active state: the card lifts and scales a
 * little, its border goes gold, the node grows and emits a single ring pulse.
 *
 * The path and the activation thresholds are measured from the real dot positions
 * (ResizeObserver), so both stay correct at any viewport or content size. Only
 * transform, opacity and colour animate; reduced motion renders every step active.
 */

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import { Reveal } from "@/components/ui/reveal";
import { APPLICATION_STEPS } from "@/data/site";

/**
 * The next card begins at the midpoint of the card before it. Keeping the card width
 * responsive lets that rule hold without allowing the last step to leave its container.
 */
const MIN_CARD_WIDTH = 300;
const MAX_CARD_WIDTH = 544;
const NODE_COLUMN_WIDTH = 52;
const EASE = [0.22, 1, 0.36, 1] as const;

export function ProcessTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [track, setTrack] = useState<{ path: string; stops: number[] }>({
    path: "",
    stops: [],
  });
  const [cardWidth, setCardWidth] = useState(480);
  const [reached, setReached] = useState(-1);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 72%", "end 62%"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  /* Measure dot centres: build the stepped connector and each node's progress stop. */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      /*
       * Four cards occupy 2.5 card widths when each one begins at the preceding
       * card's midpoint. Reflow first, then measure the actual node centres.
       */
      const nextCardWidth = Math.min(
        MAX_CARD_WIDTH,
        Math.max(MIN_CARD_WIDTH, (container.clientWidth - NODE_COLUMN_WIDTH) / 2.5),
      );
      if (Math.abs(nextCardWidth - cardWidth) > 0.5) {
        setCardWidth(nextCardWidth);
        return;
      }

      const base = container.getBoundingClientRect();
      const points = dotRefs.current
        .filter((dot): dot is HTMLSpanElement => Boolean(dot))
        .map((dot) => {
          const rect = dot.getBoundingClientRect();
          return {
            x: rect.left - base.left + rect.width / 2,
            y: rect.top - base.top + rect.height / 2,
          };
        });
      if (points.length < 2) return;

      let d = `M ${points[0].x} ${points[0].y}`;
      const lengths: number[] = [0];
      let total = 0;

      for (let i = 1; i < points.length; i += 1) {
        // Down, then across: the stair.
        d += ` V ${points[i].y} H ${points[i].x}`;
        total +=
          Math.abs(points[i].y - points[i - 1].y) + Math.abs(points[i].x - points[i - 1].x);
        lengths.push(total);
      }

      setTrack({ path: d, stops: lengths.map((length) => (total ? length / total : 0)) });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [cardWidth]);

  /*
    Activation reads raw scroll progress, not the spring: the state should switch the
    moment the tracker passes a node, without waiting for the spring to settle.
  */
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (!track.stops.length) return;
    let index = -1;
    for (let i = 0; i < track.stops.length; i += 1) {
      if (value >= track.stops[i] - 0.001) index = i;
    }
    setReached(index);
  });

  const isActive = (index: number) => reduce || index <= reached;

  return (
    <section className="bg-paper py-16 md:py-20">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8">
        <Reveal>
          <p className="text-[11px] font-semibold tracking-[0.22em] text-brand-strong uppercase">
            The process
          </p>
          <h2 className="mt-3 font-heading text-[2rem] text-ink md:text-[2.6rem]">
            Who does what, and when.
          </h2>
        </Reveal>

        <div
          ref={containerRef}
          className="relative mt-12"
          style={{ "--timeline-card-width": `${cardWidth}px` } as CSSProperties}
        >
          {/*
            The tracker deliberately sits above each milestone, so its horizontal run
            visibly passes through the centre of the circular marker instead of ending
            at its edge.
          */}
          {track.path ? (
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible"
            >
              <path
                d={track.path}
                fill="none"
                stroke="var(--line)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <motion.path
                d={track.path}
                fill="none"
                stroke="var(--brand)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={reduce ? { pathLength: 1 } : { pathLength: progress }}
              />
            </svg>
          ) : null}

          <ol className="grid gap-10 md:gap-12">
            {APPLICATION_STEPS.map((step, index) => {
              const active = isActive(index);

              return (
                <Reveal
                  as="li"
                  key={step.title}
                  index={index % 2}
                  /* The SVG path is measured from these nodes, so their reveal must not translate them. */
                  y={0}
                  className="relative ml-0 lg:ml-[var(--timeline-offset)]"
                  style={
                    {
                      "--timeline-offset": `${(index * cardWidth) / 2}px`,
                    } as CSSProperties
                  }
                >
                  <div className="flex items-start gap-5">
                    {/* Node */}
                    <motion.span
                      ref={(node: HTMLSpanElement | null) => {
                        dotRefs.current[index] = node;
                      }}
                      animate={reduce ? undefined : { scale: active ? 1.15 : 1 }}
                      transition={{ duration: 0.45, ease: EASE }}
                      className={`relative z-10 mt-1 grid size-8 shrink-0 place-items-center rounded-full border bg-transparent transition-colors duration-400 ${
                        active ? "border-brand" : "border-line"
                      }`}
                    >
                      <span
                        className={`size-2.5 rounded-full transition-colors duration-400 ${
                          active ? "bg-brand" : "bg-line"
                        }`}
                      />
                      {/* One-shot ring pulse the moment the tracker lands. */}
                      {active && !reduce ? (
                        <motion.span
                          key={`pulse-${index}`}
                          aria-hidden="true"
                          initial={{ scale: 0.8, opacity: 0.5 }}
                          animate={{ scale: 1.9, opacity: 0 }}
                          transition={{ duration: 0.9, ease: "easeOut" }}
                          className="absolute inset-0 rounded-full border-2 border-brand"
                        />
                      ) : null}
                    </motion.span>

                    <div className="min-w-0">
                      <p
                        className={`numeric text-[10.5px] font-semibold tracking-[0.18em] uppercase transition-colors duration-400 ${
                          active ? "text-brand-strong" : "text-ink-soft/70"
                        }`}
                      >
                        {step.owner}
                      </p>

                      <motion.div
                        animate={
                          reduce ? undefined : { scale: active ? 1.02 : 1, y: active ? -3 : 0 }
                        }
                        transition={{ duration: 0.45, ease: EASE }}
                        className={`mt-2 w-full origin-center rounded-xl border bg-surface p-5 transition-[border-color,box-shadow,opacity] duration-400 lg:w-[var(--timeline-card-width)] ${
                          active
                            ? "border-brand opacity-100 shadow-[0_24px_50px_-30px_rgba(31,26,21,0.5)]"
                            : "border-line opacity-70 shadow-[0_10px_26px_-24px_rgba(31,26,21,0.35)]"
                        }`}
                      >
                        <h3 className="font-heading text-[1.15rem] text-ink md:text-[1.3rem]">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
                          {step.body}
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

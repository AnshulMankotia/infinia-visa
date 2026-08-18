"use client";

/**
 * The queue that is aging.
 *
 * Each row is a target: the whole row lifts and its arrow slides on hover. A breached SLA
 * shows the red badge instead of the quiet age pill, and the count sits in the title.
 */

import { IconAlertTriangle, IconArrowRight, IconArrowNarrowRight } from "@tabler/icons-react";
import { Panel, PanelHead, CountryCode } from "./panel";
import { ATTENTION } from "@/data/admin";
import { cn } from "@/lib/utils";

export function NeedsAttention({ index = 0 }: { index?: number }) {
  return (
    <Panel index={index} className="min-w-0">
      <PanelHead
        title={`Needs attention · ${ATTENTION.length}`}
        tone="alert"
        action={
          <button
            type="button"
            className="group inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 py-1 text-[11px] font-medium text-ink-soft transition-colors hover:border-brand/50 hover:text-ink"
          >
            View all
            <IconArrowNarrowRight
              stroke={1.8}
              className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </button>
        }
      />

      <ul className="divide-y divide-line">
        {ATTENTION.map((row) => (
          <li key={row.ref}>
            <button
              type="button"
              className="group flex w-full items-center gap-3 px-4 py-2 text-left transition-colors hover:bg-paper/60"
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-destructive/8 text-destructive">
                <IconAlertTriangle stroke={1.7} className="size-4" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex items-baseline gap-2 leading-5">
                  <span className="truncate text-[13.5px] font-medium text-ink">{row.name}</span>
                  <span className="numeric shrink-0 text-[11px] text-ink-soft">{row.ref}</span>
                </span>
                <span className="mt-px flex items-center gap-1.5 text-[11px] leading-4 text-ink-soft">
                  <CountryCode code={row.cc} />
                  <span className="truncate">
                    {row.country} · {row.state}
                  </span>
                </span>
              </span>

              <span
                className={cn(
                  "numeric shrink-0 rounded-md px-2 py-1 text-[11px] font-medium",
                  row.breached
                    ? "bg-destructive/10 text-destructive"
                    : "border border-line bg-paper text-ink-soft",
                )}
              >
                {row.age}
              </span>

              <IconArrowRight
                stroke={1.7}
                className="size-4 shrink-0 text-ink-soft transition-transform duration-200 group-hover:translate-x-1 group-hover:text-brand-strong"
              />
            </button>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

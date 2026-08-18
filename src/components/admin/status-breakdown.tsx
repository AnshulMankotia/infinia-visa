"use client";

/**
 * Where the whole book currently sits.
 *
 * One row per state: an icon disc, the label, a share meter, then the count and its share
 * of all applications. Percentages round to whole numbers, so they will not sum to 100.
 */

import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { Send } from "@/components/animate-ui/icons/send";
import { UserRound } from "@/components/animate-ui/icons/user-round";
import { Clock } from "@/components/animate-ui/icons/clock";
import { Check } from "@/components/animate-ui/icons/check";
import { X } from "@/components/animate-ui/icons/x";
import { Panel, PanelHead } from "./panel";
import { cn } from "@/lib/utils";
import { Meter } from "./meter";
import { STATUS, STATUS_TOTAL, type StatusKey } from "@/data/admin";

const ICONS: Record<
  StatusKey,
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  submitted: Send,
  assigned: UserRound,
  "in-progress": Clock,
  completed: Check,
  rejected: X,
};

export function StatusBreakdown({
  index = 0,
  className,
}: {
  index?: number;
  className?: string;
}) {
  return (
    <Panel index={index} className={cn("min-w-0", className)}>
      <PanelHead title="Status breakdown" meta={`${STATUS_TOTAL} total`} />

      <ul className="flex flex-1 flex-col justify-center gap-0.5 p-2.5">
        {STATUS.map((s, i) => {
          const pct = Math.round((s.count / STATUS_TOTAL) * 100);
          const Icon = ICONS[s.key];

          return (
            // The row is the hover target; the icon inside reads its trigger from here.
            <AnimateIcon key={s.key} asChild animateOnHover>
              <li className="group flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-paper/70">
              <span className="grid size-7 shrink-0 place-items-center rounded-full border border-line bg-paper text-brand-strong transition-colors group-hover:border-brand/40">
                <Icon strokeWidth={1.7} className="size-3.5" />
              </span>
              <span className="w-20 shrink-0 truncate text-[13px] text-ink xl:w-24">{s.label}</span>
              <Meter pct={pct} delay={0.25 + i * 0.06} className="min-w-[52px] flex-1" />
              <span className="numeric w-8 shrink-0 text-right text-[13px] font-medium text-ink">
                {s.count}
              </span>
              <span className="numeric w-9 shrink-0 text-right text-[12px] text-ink-soft">
                {pct}%
                </span>
              </li>
            </AnimateIcon>
          );
        })}
      </ul>
    </Panel>
  );
}

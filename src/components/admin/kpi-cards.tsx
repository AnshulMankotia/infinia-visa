"use client";

/**
 * The four headline readouts.
 *
 * Small-caps label, a large Caslon figure that counts up on load, and an Animate UI icon
 * in a gold-tint disc pinned right. The whole card is the hover target, so the glyph plays
 * its motion wherever the pointer lands on the card. Cards with a delta carry a pill under
 * the figure; the others leave that row empty so all four stay the same height.
 */

import { ArrowUpRight } from "lucide-react";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { Clipboard } from "@/components/animate-ui/icons/clipboard";
import { Search } from "@/components/animate-ui/icons/search";
import { ChartLine } from "@/components/animate-ui/icons/chart-line";
import { Gauge } from "@/components/animate-ui/icons/gauge";
import { Panel } from "./panel";
import { CountUp } from "./count-up";
import { KPIS, type Kpi } from "@/data/admin";

const ICONS: Record<
  Kpi["icon"],
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  file: Clipboard,
  eye: Search,
  trend: ChartLine,
  briefcase: Gauge,
};

export function KpiCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {KPIS.map((kpi, i) => {
        const Icon = ICONS[kpi.icon];

        return (
          <Panel key={kpi.label} index={i} hover className="group">
            {/* The hover target is the whole card body, so the glyph plays wherever the
                pointer lands rather than only over the icon itself. */}
            <AnimateIcon animateOnHover className="block p-4">
              <div className="flex items-start gap-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-medium tracking-[0.14em] text-ink-soft uppercase">
                    {kpi.label}
                  </p>
                  <p className="mt-2.5 flex items-baseline gap-0.5 font-heading text-[38px] leading-none text-ink tabular-nums">
                    <CountUp value={kpi.value} decimals={kpi.decimals} delay={0.15 + i * 0.07} />
                    {kpi.suffix && (
                      <span className="font-sans text-base text-ink-soft">{kpi.suffix}</span>
                    )}
                  </p>
                </div>

                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-brand/25 bg-brand-tint text-brand-strong transition-transform duration-300 group-hover:scale-105">
                  <Icon strokeWidth={1.5} className="size-5" />
                </span>
              </div>

              <div className="mt-3 h-[22px]">
                {kpi.delta && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-brand-tint px-2 py-1 text-[11px] font-medium text-brand-strong">
                    <ArrowUpRight strokeWidth={2} className="size-3.5" />
                    {kpi.delta}
                  </span>
                )}
              </div>
            </AnimateIcon>
          </Panel>
        );
      })}
    </div>
  );
}

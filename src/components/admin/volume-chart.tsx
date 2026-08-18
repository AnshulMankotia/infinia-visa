"use client";

/**
 * Intake volume for the last 14 days.
 *
 * A plain column chart: dashed horizontal rules, no vertical grid, no axis lines. Bars are
 * a soft vertical gold gradient with a rounded cap, and they grow from the baseline once
 * on mount. Reduced motion skips the growth.
 */

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useReducedMotion } from "motion/react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Panel, PanelHead } from "./panel";
import { cn } from "@/lib/utils";
import { VOLUME } from "@/data/admin";

const CONFIG = {
  count: { label: "Applications", color: "var(--brand)" },
} satisfies ChartConfig;

const TOTAL = VOLUME.reduce((sum, d) => sum + d.count, 0);

export function VolumeChart({
  index = 0,
  className,
}: {
  index?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <Panel index={index} className={cn("min-w-0", className)}>
      <PanelHead
        title="Application volume · Last 14 days"
        meta={`${TOTAL} total`}
      />

      <div className="flex-1 px-3 py-3 pl-0">
        <ChartContainer config={CONFIG} className="aspect-auto h-[170px] w-full">
          <BarChart data={VOLUME} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} barCategoryGap="20%">
            <defs>
              <linearGradient id="volume-gold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--brand-strong)" stopOpacity={0.95} />
                <stop offset="100%" stopColor="var(--brand)" stopOpacity={0.75} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} strokeDasharray="3 5" stroke="var(--line)" />
            <YAxis
              width={40}
              tickLine={false}
              axisLine={false}
              tickCount={5}
              domain={[0, 40]}
              tick={{ fill: "var(--ink-soft)", fontSize: 11 }}
            />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fill: "var(--ink-soft)", fontSize: 11 }}
            />
            <ChartTooltip
              cursor={{ fill: "var(--paper)" }}
              content={<ChartTooltipContent labelFormatter={(d) => `Day ${d}`} />}
            />
            <Bar
              dataKey="count"
              fill="url(#volume-gold)"
              radius={[3, 3, 0, 0]}
              isAnimationActive={!reduce}
              animationDuration={900}
              animationEasing="ease-out"
            />
          </BarChart>
        </ChartContainer>
      </div>
    </Panel>
  );
}

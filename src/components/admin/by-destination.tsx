"use client";

/** Today's intake split by corridor, sorted by volume, meters scaled to the busiest one. */

import { Panel, PanelHead, CountryCode } from "./panel";
import { Meter } from "./meter";
import { DESTINATIONS } from "@/data/admin";

const TOTAL = DESTINATIONS.reduce((sum, d) => sum + d.count, 0);
const PEAK = Math.max(...DESTINATIONS.map((d) => d.count));

export function ByDestination({ index = 0 }: { index?: number }) {
  return (
    <Panel index={index} className="min-w-0">
      <PanelHead title="By destination · Today" meta={`${TOTAL} apps`} />

      <ul className="flex flex-col gap-0.5 p-2.5">
        {DESTINATIONS.map((d, i) => (
          <li
            key={d.cc}
            className="group flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-paper/70"
          >
            <CountryCode code={d.cc} />
            <span className="min-w-0 flex-1 truncate text-[13px] text-ink">{d.name}</span>
            <Meter
              pct={(d.count / PEAK) * 100}
              delay={0.3 + i * 0.06}
              className="w-[46%] shrink-0"
            />
            <span className="numeric w-8 shrink-0 text-right text-[13px] font-medium text-ink">
              {d.count}
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

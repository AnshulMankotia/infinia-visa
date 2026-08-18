"use client";

/**
 * Staff audit trail, newest first.
 *
 * A shadcn table with a paper header strip. The "Live" marker in the corner is a pulsing
 * dot — decorative only until this reads a real feed.
 */

import { IconDots } from "@tabler/icons-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Panel, PanelHead } from "./panel";
import { ACTIVITY } from "@/data/admin";

export function ActivityTable({ index = 0 }: { index?: number }) {
  return (
    <Panel index={index} className="min-w-0">
      <PanelHead
        title="Recent staff activity"
        action={
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-positive">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-positive opacity-70" />
              <span className="relative inline-flex size-1.5 rounded-full bg-positive" />
            </span>
            Live
          </span>
        }
      />

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-line bg-paper/60 hover:bg-paper/60">
              {["Time", "Staff", "Action", "Type"].map((h) => (
                <TableHead
                  key={h}
                  className="h-9 px-4 text-[10.5px] font-medium tracking-[0.14em] text-ink-soft uppercase"
                >
                  {h}
                </TableHead>
              ))}
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {ACTIVITY.map((row, i) => (
              <TableRow
                key={`${row.time}-${i}`}
                className="group border-line transition-colors hover:bg-paper/50"
              >
                <TableCell className="numeric w-24 px-4 py-1.5 text-[12.5px] text-ink-soft">
                  {row.time}
                </TableCell>
                <TableCell className="w-40 px-4 py-1.5 text-[13px] text-ink">{row.staff}</TableCell>
                <TableCell className="px-4 py-1.5 text-[13px] text-ink">{row.action}</TableCell>
                <TableCell className="w-40 px-4 py-1.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-tint px-2.5 py-1 text-[11px] font-medium text-brand-strong">
                    <span className="size-1 rounded-full bg-brand-strong" />
                    {row.type}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-1.5 text-right">
                  <button
                    type="button"
                    aria-label="Row actions"
                    className="grid size-7 place-items-center rounded-md text-ink-soft opacity-0 transition-opacity group-hover:opacity-100 hover:bg-paper focus-visible:opacity-100"
                  >
                    <IconDots stroke={1.7} className="size-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Panel>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import type { DateRange } from "react-day-picker";
import {
  IconAlertTriangle,
  IconCalendarEvent,
  IconMapPin,
  IconSearch,
  IconUserCircle,
} from "@tabler/icons-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRIES } from "@/data/countries";
import { NATIONALITIES } from "@/data/site";

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });

function formatRange(range: DateRange | undefined) {
  if (!range?.from) return null;
  if (!range.to) return dateFormat.format(range.from);
  return `${dateFormat.format(range.from)} to ${dateFormat.format(range.to)}`;
}

/** One field cell. The trigger fills the cell, so its menu lines up with the cell edges. */
// No block fill on hover: a tinted rectangle inside a rounded card reads as a bug.
// Emphasis comes from the icon chip and the value text instead.
// One treatment for all three cells: a soft tint plus a hairline ring, never a hard
// outline. The global focus outline is suppressed here so it cannot double up.
const cellClass =
  "group/cell flex h-auto w-full items-center gap-3.5 rounded-xl border-0 bg-transparent px-4 py-3.5 text-left shadow-none ring-0 outline-none transition-colors duration-300 hover:bg-brand-tint/35 focus-visible:bg-brand-tint/50 focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none data-[state=open]:bg-brand-tint/50 data-[state=open]:shadow-none [&>svg:last-child]:text-ink-soft [&>svg:last-child]:transition-transform [&>svg:last-child]:duration-300 data-[state=open]:[&>svg:last-child]:rotate-180";

const iconClass =
  "grid size-9 shrink-0 place-items-center rounded-lg bg-brand-tint text-brand-strong transition-colors duration-300 group-hover/cell:bg-brand group-hover/cell:text-brand-ink group-data-[state=open]/cell:bg-brand group-data-[state=open]/cell:text-brand-ink";

const labelClass = "block text-[11px] leading-none tracking-[0.04em] text-ink-soft";
const valueClass = "mt-1.5 block truncate text-[14px] leading-none font-medium";

/**
 * Corridor search card. Straddles the bottom edge of the hero photograph.
 *
 * Field names (`nationality`, `destination`, `dates`) match the live site so downstream
 * analytics and autofill keep working.
 */
export function CorridorSearch() {
  const router = useRouter();
  const ids = useId();
  const [nationality, setNationality] = useState("");
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState<DateRange | undefined>();
  const [error, setError] = useState<string | null>(null);

  const dateLabel = formatRange(dates);

  function handleSearch() {
    if (!destination) {
      setError("Choose where you are going so we can price the corridor.");
      return;
    }
    setError(null);
    router.push(`/destinations/${destination}`);
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 md:px-8">
      <div className="rounded-2xl border border-white/60 bg-white/80 p-2 shadow-[0_26px_60px_-30px_rgba(31,26,21,0.5)] ring-1 ring-line/50 backdrop-blur-xl">
        <div className="grid gap-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-center lg:gap-0">
          {/* Nationality */}
          <div className="lg:relative lg:after:absolute lg:after:inset-y-4 lg:after:right-0 lg:after:w-px lg:after:bg-line">
            <Select name="nationality" value={nationality} onValueChange={setNationality}>
              <SelectTrigger id={`${ids}-nationality`} aria-label="Nationality" className={cellClass}>
                <span className={iconClass}>
                  <IconUserCircle size={18} stroke={1.6} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className={labelClass}>I&rsquo;m a citizen of</span>
                  <span
                    className={`${valueClass} ${nationality ? "text-ink" : "text-ink-soft"}`}
                  >
                    <SelectValue placeholder="Select nationality" />
                  </span>
                </span>
              </SelectTrigger>
              <SelectContent
                position="popper"
                sideOffset={6}
                className="max-h-72 w-(--radix-select-trigger-width) rounded-xl border border-line bg-surface p-1.5 shadow-[0_24px_50px_-24px_rgba(31,26,21,0.35)]"
              >
                {NATIONALITIES.map((item) => (
                  <SelectItem key={item.code} value={item.code} className="rounded-lg px-3 py-2.5 text-[14px] text-ink transition-colors duration-150 focus:bg-brand-tint focus:text-ink">
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Destination */}
          <div className="lg:relative lg:after:absolute lg:after:inset-y-4 lg:after:right-0 lg:after:w-px lg:after:bg-line">
            <Select
              name="destination"
              value={destination}
              onValueChange={(value) => {
                setDestination(value);
                setError(null);
              }}
            >
              <SelectTrigger
                id={`${ids}-destination`}
                aria-label="Destination"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${ids}-error` : undefined}
                className={cellClass}
              >
                <span className={iconClass}>
                  <IconMapPin size={18} stroke={1.6} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className={labelClass}>Going to</span>
                  <span
                    className={`${valueClass} ${destination ? "text-ink" : "text-ink-soft"}`}
                  >
                    <SelectValue placeholder="Select destination" />
                  </span>
                </span>
              </SelectTrigger>
              <SelectContent
                position="popper"
                sideOffset={6}
                className="max-h-72 w-(--radix-select-trigger-width) rounded-xl border border-line bg-surface p-1.5 shadow-[0_24px_50px_-24px_rgba(31,26,21,0.35)]"
              >
                {COUNTRIES.map((country) => (
                  <SelectItem key={country.slug} value={country.slug} className="rounded-lg px-3 py-2.5 text-[14px] text-ink transition-colors duration-150 focus:bg-brand-tint focus:text-ink">
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Travel dates */}
          <div>
            <Popover>
              <PopoverTrigger
                id={`${ids}-dates`}
                name="dates"
                aria-label="Travel dates"
                className={cellClass}
              >
                <span className={iconClass}>
                  <IconCalendarEvent size={18} stroke={1.6} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className={labelClass}>Travel dates</span>
                  <span className={`${valueClass} ${dateLabel ? "text-ink" : "text-ink-soft"}`}>
                    {dateLabel ?? "Select dates"}
                  </span>
                </span>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                sideOffset={6}
                className="w-(--radix-popover-trigger-width) min-w-[17rem] rounded-xl border border-line bg-surface p-0 shadow-[0_24px_50px_-24px_rgba(31,26,21,0.35)]"
              >
                <Calendar
                  mode="range"
                  numberOfMonths={1}
                  selected={dates}
                  onSelect={setDates}
                  disabled={{ before: new Date() }}
                  autoFocus
                  // Rows share the popover width evenly; day buttons get an explicit
                  // height instead of stacked aspect-square boxes, which clipped glyphs.
                  className="w-full p-3 [--cell-size:2.25rem] [&_td>button]:!aspect-auto [&_td>button]:!h-9 [&_td>button]:!min-w-0"
                  classNames={{
                    root: "w-full",
                    month: "flex w-full flex-col gap-3",
                    weekdays: "flex w-full",
                    weekday: "flex-1 text-[0.75rem] font-normal text-ink-soft",
                    week: "mt-1 flex w-full",
                    day: "group/day relative h-9 w-full flex-1 rounded-(--cell-radius) p-0 text-center select-none",
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="p-1 lg:pl-3">
            <button
              type="button"
              onClick={handleSearch}
              className="btn-gold inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-xl px-7 text-[14px] font-semibold text-brand-ink transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none hover:-translate-y-0.5 hover:bg-[#b0966f] hover:shadow-[0_14px_28px_-16px_rgba(31,26,21,0.7)] focus-visible:shadow-[0_0_0_2px_var(--surface),0_0_0_4px_var(--brand-strong)] focus-visible:outline-none active:translate-y-0 active:scale-[0.98] lg:w-auto"
            >
              <IconSearch size={16} stroke={2} />
              Find my visa
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <p
          id={`${ids}-error`}
          role="alert"
          className="mt-3 flex items-center gap-2 pl-1 text-sm text-destructive"
        >
          <IconAlertTriangle size={16} stroke={1.75} />
          {error}
        </p>
      ) : null}
    </div>
  );
}

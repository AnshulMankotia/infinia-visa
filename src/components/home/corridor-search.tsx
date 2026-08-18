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
  "group/cell flex h-auto w-full items-center gap-3.5 rounded-xl border-0 bg-transparent px-4 py-3.5 text-left shadow-none ring-0 outline-none transition-colors duration-300 hover:bg-brand-tint/45 focus-visible:bg-brand-tint/60 focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none data-[state=open]:bg-brand-tint/60 data-[state=open]:shadow-none [&>svg:last-child]:text-ink-soft [&>svg:last-child]:transition-transform [&>svg:last-child]:duration-300 data-[state=open]:[&>svg:last-child]:rotate-180";

// The chip carries a hairline and a warm shadow so it reads as an object on the
// photograph rather than a flat tint, and it fills gold the moment the cell is live.
const iconClass =
  "grid size-9 shrink-0 place-items-center rounded-lg bg-brand-tint text-brand-strong ring-1 ring-brand/20 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.6)] transition-all duration-300 group-hover/cell:scale-105 group-hover/cell:bg-brand group-hover/cell:text-brand-ink group-hover/cell:ring-brand-strong/40 group-data-[state=open]/cell:scale-105 group-data-[state=open]/cell:bg-brand group-data-[state=open]/cell:text-brand-ink";

// Small caps on the label, matching the type language the rest of the site uses for
// field headings. The value below it is what the eye should land on.
const labelClass =
  "block text-[10px] leading-none font-medium tracking-[0.14em] text-ink-soft uppercase transition-colors duration-300 group-hover/cell:text-brand-strong";
const valueClass = "mt-2 block truncate text-[14.5px] leading-none font-medium";

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
    <div className="mx-auto w-full max-w-[1120px] px-4 md:px-8">
      <div className="group/card relative">
        {/* A warm halo bled out behind the card. The hero sky is bright, and without it
            the panel dissolves into the photograph instead of sitting on top of it. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-6 -inset-y-5 rounded-[2.5rem] bg-[radial-gradient(55%_120%_at_50%_55%,rgba(31,26,21,0.38),transparent_72%)] blur-2xl"
        />

        <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-white/92 p-2 shadow-[0_2px_6px_-2px_rgba(31,26,21,0.25),0_34px_64px_-24px_rgba(31,26,21,0.55)] ring-1 ring-brand/25 backdrop-blur-2xl transition-shadow duration-500 hover:shadow-[0_2px_6px_-2px_rgba(31,26,21,0.3),0_44px_78px_-26px_rgba(31,26,21,0.62)]">
          {/* Gold hairline along the top edge, then a faint sheen down the face. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/70 to-transparent"
          />

          <div className="relative grid gap-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-center lg:gap-0">
          {/* Nationality */}
          <div className="border-b border-line/60 lg:relative lg:border-b-0 lg:after:absolute lg:after:inset-y-3 lg:after:right-0 lg:after:w-px lg:after:bg-gradient-to-b lg:after:from-transparent lg:after:via-line lg:after:to-transparent">
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
          <div className="border-b border-line/60 lg:relative lg:border-b-0 lg:after:absolute lg:after:inset-y-3 lg:after:right-0 lg:after:w-px lg:after:bg-gradient-to-b lg:after:from-transparent lg:after:via-line lg:after:to-transparent">
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
          <div className="border-b border-line/60 md:border-b-0">
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
              className="btn-gold group/cta relative inline-flex h-[54px] w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl px-8 text-[14.5px] font-semibold text-brand-ink transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none hover:-translate-y-0.5 hover:bg-[#b0966f] hover:shadow-[0_16px_32px_-16px_rgba(31,26,21,0.75)] focus-visible:shadow-[0_0_0_2px_var(--surface),0_0_0_4px_var(--brand-strong)] focus-visible:outline-none active:translate-y-0 active:scale-[0.98] lg:w-auto"
            >
              {/* Shine sweep, the same one the auth buttons use. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-0 -left-3/4 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-700 ease-out group-hover/cta:translate-x-[320%]"
              />
              <IconSearch
                size={17}
                stroke={2}
                className="relative transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/cta:scale-110"
              />
              <span className="relative">Find my visa</span>
            </button>
          </div>
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

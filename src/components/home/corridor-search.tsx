"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useTransition,
  type ComponentType,
} from "react";
import type { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import {
  IconAlertTriangle,
  IconCalendarEvent,
  IconCheck,
  IconChevronDown,
  IconLoader2,
  IconMapPin,
  IconSearch,
  IconUserCircle,
  IconX,
  type IconProps,
} from "@tabler/icons-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { COUNTRIES, flagSrc } from "@/data/countries";
import { NATIONALITIES } from "@/data/site";

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });

function formatRange(range: DateRange | undefined) {
  if (!range?.from) return null;
  if (!range.to) return dateFormat.format(range.from);
  return `${dateFormat.format(range.from)} – ${dateFormat.format(range.to)}`;
}

/** Flag image for an ISO 3166-1 alpha-2 code. Emoji flags don't render on Windows. */
function Flag({ iso2, size }: { iso2: string; size: number }) {
  return (
    <span
      aria-hidden="true"
      className="relative block shrink-0 overflow-hidden rounded-full ring-1 ring-line/70"
      style={{ width: size, height: size }}
    >
      <Image src={flagSrc(iso2)} alt="" fill sizes={`${size}px`} className="object-cover" />
    </span>
  );
}

type Option = {
  value: string;
  label: string;
  iso2: string;
  /** Right-aligned hint inside the menu, e.g. processing time. */
  meta?: string;
};

const NATIONALITY_OPTIONS: Option[] = NATIONALITIES.map((item) => ({
  value: item.code,
  label: item.label,
  iso2: item.code,
}));

const DESTINATION_OPTIONS: Option[] = COUNTRIES.map((country) => ({
  value: country.slug,
  label: country.name,
  iso2: country.iso2,
  meta: country.processing,
}));

/* ------------------------------------------------------------------ *
 * Shared cell chrome
 *
 * Three states, one language: rest is transparent, hover lifts a warm tint,
 * and the open cell becomes a raised white surface with a gold hairline so it
 * reads as the live segment of the bar.
 * ------------------------------------------------------------------ */
const cellClass =
  "group/cell relative flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-left outline-none transition-[background-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-brand-tint/45 focus-visible:bg-brand-tint/55 data-[state=open]:bg-surface data-[state=open]:shadow-[0_12px_32px_-20px_rgba(31,26,21,0.55)] data-[state=open]:ring-1 data-[state=open]:ring-brand/35";

const iconClass =
  "grid size-9 shrink-0 place-items-center rounded-lg bg-brand-tint text-brand-strong ring-1 ring-brand/20 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.6)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/cell:scale-105 group-hover/cell:bg-brand group-hover/cell:text-brand-ink group-hover/cell:ring-brand-strong/40 group-data-[state=open]/cell:scale-105 group-data-[state=open]/cell:bg-brand group-data-[state=open]/cell:text-brand-ink group-data-[state=open]/cell:ring-brand-strong/50";

const labelClass =
  "block text-[10px] leading-none font-medium tracking-[0.14em] text-ink-soft uppercase transition-colors duration-300 group-hover/cell:text-brand-strong group-data-[state=open]/cell:text-brand-strong";

const valueClass = "mt-2 flex items-center gap-1.5 text-[14.5px] leading-none font-medium";

const menuChrome =
  "overflow-hidden rounded-2xl border border-line/80 bg-surface p-0 text-ink shadow-[0_30px_64px_-28px_rgba(31,26,21,0.5)] ring-1 ring-brand/10";
const menuClass = `w-(--radix-popover-trigger-width) min-w-[19rem] ${menuChrome}`;

const chevronClass =
  "size-4 shrink-0 text-ink-soft transition-transform duration-300 group-data-[state=open]/cell:rotate-180 group-data-[state=open]/cell:text-brand-strong";

/** Clear button, layered over the trigger — a nested <button> would be invalid markup. */
function ClearButton({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation();
        onClear();
      }}
      className="absolute top-1/2 right-9 z-10 grid size-6 -translate-y-1/2 place-items-center rounded-full text-ink-soft/70 transition-colors duration-200 hover:bg-brand-tint hover:text-ink focus-visible:ring-2 focus-visible:ring-brand-strong/50 focus-visible:outline-none"
    >
      <IconX size={13} stroke={2} />
    </button>
  );
}

/* ------------------------------------------------------------------ *
 * Searchable country picker
 *
 * Radix Select has no filter field, so this is a Popover + listbox pair with
 * the keyboard contract people expect from one: type to filter, arrows to
 * move, Enter to commit, Escape to dismiss.
 * ------------------------------------------------------------------ */
function CountryField({
  id,
  icon: Icon,
  label,
  placeholder,
  searchPlaceholder,
  emptyLabel,
  options,
  value,
  onChange,
  invalid,
  describedBy,
}: {
  id: string;
  icon: ComponentType<IconProps>;
  label: string;
  placeholder: string;
  searchPlaceholder: string;
  emptyLabel: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  describedBy?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  // Tracked by value, not index, so filtering never leaves the highlight stranded.
  const [activeValue, setActiveValue] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selected = options.find((option) => option.value === value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(q) || option.iso2.toLowerCase().startsWith(q),
    );
  }, [options, query]);

  // Highlight falls back to the current selection, then to the first match.
  const active = (() => {
    const byActive = filtered.findIndex((option) => option.value === activeValue);
    if (byActive >= 0) return byActive;
    const bySelection = filtered.findIndex((option) => option.value === value);
    return bySelection >= 0 ? bySelection : 0;
  })();

  const moveTo = (index: number) => {
    const option = filtered[Math.min(Math.max(index, 0), filtered.length - 1)];
    if (option) setActiveValue(option.value);
  };

  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  function commit(option: Option) {
    onChange(option.value);
    setOpen(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveTo(active + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveTo(active - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      moveTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      moveTo(filtered.length - 1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const option = filtered[active];
      if (option) commit(option);
    }
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setQuery("");
          setActiveValue(null);
        }
      }}
    >
      <PopoverTrigger
        id={id}
        aria-label={label}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className={`${cellClass} ${
          invalid ? "ring-1 ring-destructive/50 data-[state=open]:ring-destructive/60" : ""
        }`}
      >
        <span className={`${iconClass} ${invalid ? "text-destructive" : ""}`}>
          <Icon size={18} stroke={1.6} />
        </span>
        <span className="min-w-0 flex-1">
          <span className={labelClass}>{label}</span>
          <span className={`${valueClass} ${selected ? "text-ink" : "text-ink-soft"}`}>
            {selected ? (
              <>
                <Flag iso2={selected.iso2} size={18} />
                <span className="truncate">{selected.label}</span>
              </>
            ) : (
              <span className="truncate">{placeholder}</span>
            )}
          </span>
        </span>
        <IconChevronDown className={chevronClass} stroke={1.8} />
      </PopoverTrigger>

      {selected ? (
        <ClearButton label={`Clear ${label.toLowerCase()}`} onClear={() => onChange("")} />
      ) : null}

      <PopoverContent align="start" sideOffset={8} className={menuClass}>
        <div className="flex items-center gap-2.5 border-b border-line/70 px-3.5 py-3">
          <IconSearch size={15} stroke={1.8} className="shrink-0 text-ink-soft" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            aria-controls={`${id}-listbox`}
            aria-activedescendant={filtered[active] ? `${id}-opt-${filtered[active].value}` : undefined}
            className="w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-ink-soft/70"
          />
          {query ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery("")}
              className="grid size-5 shrink-0 place-items-center rounded-full text-ink-soft transition-colors hover:bg-brand-tint hover:text-ink"
            >
              <IconX size={12} stroke={2} />
            </button>
          ) : null}
        </div>

        <div
          ref={listRef}
          id={`${id}-listbox`}
          role="listbox"
          aria-label={label}
          className="max-h-64 overflow-y-auto overscroll-contain p-1.5"
        >
          {filtered.length === 0 ? (
            <p className="px-3 py-6 text-center text-[13px] text-ink-soft">
              {emptyLabel}
            </p>
          ) : (
            filtered.map((option, index) => {
              const isSelected = option.value === value;
              const isActive = index === active;
              return (
                <button
                  key={option.value}
                  id={`${id}-opt-${option.value}`}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  data-active={isActive}
                  onPointerMove={() => setActiveValue(option.value)}
                  onClick={() => commit(option)}
                  className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left text-[14px] transition-colors duration-150 outline-none ${
                    isActive ? "bg-brand-tint text-ink" : "text-ink"
                  }`}
                >
                  <Flag iso2={option.iso2} size={20} />
                  <span className={`min-w-0 flex-1 truncate ${isSelected ? "font-semibold" : ""}`}>
                    {option.label}
                  </span>
                  {option.meta ? (
                    <span className="shrink-0 text-[11.5px] text-ink-soft">{option.meta}</span>
                  ) : null}
                  <IconCheck
                    size={15}
                    stroke={2.2}
                    className={`shrink-0 text-brand-strong transition-opacity duration-150 ${
                      isSelected ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

const DATE_PRESETS = [
  { label: "Next 7 days", days: 7 },
  { label: "Next 14 days", days: 14 },
  { label: "Next 30 days", days: 30 },
];

/**
 * Corridor search card. Straddles the bottom edge of the hero photograph.
 *
 * Field names (`nationality`, `destination`, `dates`) match the live site so downstream
 * analytics and autofill keep working.
 */
export function CorridorSearch() {
  const router = useRouter();
  const ids = useId();
  const isMobile = useIsMobile();
  const [pending, startTransition] = useTransition();
  const [nationality, setNationality] = useState("");
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState<DateRange | undefined>();
  const [datesOpen, setDatesOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dateLabel = formatRange(dates);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!destination) {
      setError("Choose where you are going so we can price the corridor.");
      document.getElementById(`${ids}-destination`)?.focus();
      return;
    }
    setError(null);
    startTransition(() => {
      router.push(`/destinations/${destination}`);
    });
  }

  return (
    <div className="mx-auto w-full max-w-[1120px] px-4 md:px-8">
      <form onSubmit={handleSubmit} className="group/card relative">
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
            <div className="relative border-b border-line/60 lg:border-b-0 lg:after:absolute lg:after:inset-y-3 lg:after:right-0 lg:after:w-px lg:after:bg-gradient-to-b lg:after:from-transparent lg:after:via-line lg:after:to-transparent">
              <CountryField
                id={`${ids}-nationality`}
                icon={IconUserCircle}
                label="I'm a citizen of"
                placeholder="Select nationality"
                searchPlaceholder="Search nationalities"
                emptyLabel="No nationality matches that search."
                options={NATIONALITY_OPTIONS}
                value={nationality}
                onChange={setNationality}
              />
            </div>

            {/* Destination */}
            <div className="relative border-b border-line/60 lg:border-b-0 lg:after:absolute lg:after:inset-y-3 lg:after:right-0 lg:after:w-px lg:after:bg-gradient-to-b lg:after:from-transparent lg:after:via-line lg:after:to-transparent">
              <CountryField
                id={`${ids}-destination`}
                icon={IconMapPin}
                label="Going to"
                placeholder="Select destination"
                searchPlaceholder="Search destinations"
                emptyLabel="We don't cover that corridor yet."
                options={DESTINATION_OPTIONS}
                value={destination}
                onChange={(value) => {
                  setDestination(value);
                  setError(null);
                }}
                invalid={Boolean(error)}
                describedBy={error ? `${ids}-error` : undefined}
              />
            </div>

            {/* Travel dates */}
            <div className="relative border-b border-line/60 md:border-b-0">
              <Popover open={datesOpen} onOpenChange={setDatesOpen}>
                <PopoverTrigger id={`${ids}-dates`} aria-label="Travel dates" className={cellClass}>
                  <span className={iconClass}>
                    <IconCalendarEvent size={18} stroke={1.6} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={labelClass}>Travel dates</span>
                    <span className={`${valueClass} ${dateLabel ? "text-ink" : "text-ink-soft"}`}>
                      <span className="truncate">{dateLabel ?? "Select dates"}</span>
                    </span>
                  </span>
                  <IconChevronDown className={chevronClass} stroke={1.8} />
                </PopoverTrigger>

                {dates?.from ? (
                  <ClearButton label="Clear travel dates" onClear={() => setDates(undefined)} />
                ) : null}

                <PopoverContent
                  align="start"
                  sideOffset={8}
                  className={`w-auto ${menuChrome}`}
                >
                  <div className="flex flex-wrap gap-1.5 border-b border-line/70 px-3 py-2.5">
                    {DATE_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          const from = new Date();
                          setDates({ from, to: addDays(from, preset.days) });
                        }}
                        className="rounded-full border border-line px-3 py-1.5 text-[12px] font-medium text-ink-soft transition-colors duration-200 hover:border-brand hover:bg-brand-tint hover:text-ink focus-visible:ring-2 focus-visible:ring-brand-strong/50 focus-visible:outline-none"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  <Calendar
                    mode="range"
                    numberOfMonths={isMobile ? 1 : 2}
                    selected={dates}
                    onSelect={setDates}
                    disabled={{ before: new Date() }}
                    autoFocus
                    // Rows share the popover width evenly; day buttons get an explicit
                    // height instead of stacked aspect-square boxes, which clipped glyphs.
                    className="p-3 [--cell-size:2.25rem] [&_td>button]:!aspect-auto [&_td>button]:!h-9 [&_td>button]:!min-w-0"
                    classNames={{
                      // `relative` is what the absolutely-positioned nav arrows anchor to; without it
                      // they escape to the popover and land on the preset row.
                      months: "relative flex flex-col gap-4 sm:flex-row sm:gap-6",
                      month: "flex w-[16rem] flex-col gap-3",
                      weekdays: "flex w-full",
                      weekday: "flex-1 text-[0.75rem] font-normal text-ink-soft",
                      week: "mt-1 flex w-full",
                      day: "group/day relative h-9 w-full flex-1 rounded-(--cell-radius) p-0 text-center select-none",
                    }}
                  />

                  <div className="flex items-center justify-between border-t border-line/70 px-3 py-2.5">
                    <button
                      type="button"
                      onClick={() => setDates(undefined)}
                      className="rounded-md px-2 py-1 text-[12.5px] font-medium text-ink-soft transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-brand-strong/50 focus-visible:outline-none"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={() => setDatesOpen(false)}
                      className="btn-gold rounded-lg px-4 py-1.5 text-[12.5px] font-semibold text-brand-ink transition-colors duration-200 hover:bg-[#b0966f] focus-visible:ring-2 focus-visible:ring-brand-strong/60 focus-visible:outline-none"
                    >
                      Done
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="p-1 lg:pl-3">
              <button
                type="submit"
                disabled={pending}
                className="btn-gold group/cta relative inline-flex h-[54px] w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl px-8 text-[14.5px] font-semibold text-brand-ink transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none hover:-translate-y-0.5 hover:bg-[#b0966f] hover:shadow-[0_16px_32px_-16px_rgba(31,26,21,0.75)] focus-visible:shadow-[0_0_0_2px_var(--surface),0_0_0_4px_var(--brand-strong)] focus-visible:outline-none active:translate-y-0 active:scale-[0.98] disabled:cursor-progress disabled:opacity-80 disabled:hover:translate-y-0 lg:w-auto"
              >
                {/* Shine sweep, the same one the auth buttons use. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 -left-3/4 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-700 ease-out group-hover/cta:translate-x-[320%]"
                />
                {pending ? (
                  <IconLoader2 size={17} stroke={2} className="relative animate-spin" />
                ) : (
                  <IconSearch
                    size={17}
                    stroke={2}
                    className="relative transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/cta:scale-110"
                  />
                )}
                <span className="relative">{pending ? "Searching" : "Find my visa"}</span>
              </button>
            </div>
          </div>
        </div>
      </form>

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

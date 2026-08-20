"use client";

/**
 * Application checkout, rebuilt to the framed-canvas design: a cream frame around a
 * white sheet, a centered segmented progress bar in the top chrome, a left rail with
 * an etched corridor illustration, a vertical stepper and the application summary,
 * and one step at a time in the main pane. The Trip step is a large two-month
 * calendar with a single travel date.
 *
 * Content model comes from the old checkout: travel date, marital status, passport
 * scan with auto-fill, traveler details, per-document uploads with skip, review.
 * Demo build: the scan is simulated and no payment backend is wired up.
 */

import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  IconArrowLeft,
  IconArrowRight,
  IconBookmark,
  IconCalendarEvent,
  IconChecklist,
  IconChevronLeft,
  IconCircleCheck,
  IconClock,
  IconCloudUpload,
  IconCreditCard,
  IconFileText,
  IconFlower,
  IconHeart,
  IconHeartBroken,
  IconInfoCircle,
  IconLoader2,
  IconLock,
  IconMoon,
  IconPencil,
  IconPlane,
  IconPlus,
  IconScan,
  IconShieldCheck,
  IconSun,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import { Calendar } from "@/components/ui/calendar";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NATIONALITIES } from "@/data/site";
import { flagSrc, totalFee, type Country } from "@/data/countries";

/* ---------------------------------- model ---------------------------------- */

const STEPS = [
  { label: "Trip", sub: "Travel dates & route" },
  { label: "Details", sub: "Traveler details & documents" },
  { label: "Review", sub: "Review & confirm application" },
] as const;

const MARITAL_OPTIONS = [
  { label: "Single", icon: IconUser },
  { label: "Married", icon: IconHeart },
  { label: "Divorced", icon: IconHeartBroken },
  { label: "Widowed", icon: IconFlower },
] as const;

type Traveler = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  passportNumber: string;
  issuedOn: string;
  validTill: string;
  nationality: string;
  placeOfIssue: string;
};

type TravelerProfile = {
  id: string;
  traveler: Traveler;
  marital: string | null;
  scanState: "idle" | "scanning" | "done";
};

const EMPTY_TRAVELER: Traveler = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  passportNumber: "",
  issuedOn: "",
  validTill: "",
  nationality: "",
  placeOfIssue: "",
};

function createTraveler(id: string): TravelerProfile {
  return {
    id,
    traveler: { ...EMPTY_TRAVELER },
    marital: null,
    scanState: "idle",
  };
}

/** Values the simulated OCR pass fills in. Sample data for the demo. */
const SCANNED: Partial<Traveler> = {
  firstName: "Aanya",
  lastName: "Mehta",
  dateOfBirth: "1994-03-18",
  gender: "Female",
  passportNumber: "M2841937",
  issuedOn: "2021-04-18",
  validTill: "2031-04-17",
  nationality: "US",
  placeOfIssue: "New York",
};

const longDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
const mediumDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** Uploads and skips are stored per traveler: each traveler files their own set. */
const docKey = (travelerId: string, documentName: string) => `${travelerId}:${documentName}`;
const fieldClass =
  "h-10 w-full rounded-lg border-line bg-surface px-3.5 text-[14px] text-ink shadow-none transition-[border-color,box-shadow] duration-200 placeholder:text-ink-soft/70 hover:border-brand focus-visible:border-brand-strong focus-visible:ring-0 focus-visible:shadow-[0_0_0_1px_var(--brand-strong)] focus-visible:outline-none";

const selectFieldClass =
  "h-10 w-full rounded-lg border-line bg-surface px-3.5 text-[14px] text-ink shadow-none transition-[border-color,box-shadow] duration-200 hover:border-brand focus-visible:border-brand-strong focus-visible:ring-0 focus-visible:shadow-[0_0_0_1px_var(--brand-strong)] focus-visible:outline-none data-[placeholder]:text-ink-soft/70";

/* ---------------------------------- shell ---------------------------------- */

export function ApplyWizard({ country }: { country: Country }) {
  const reduce = useReducedMotion();
  const [dark, setDark] = useState(false);
  const [step, setStep] = useState(0);
  const [dates, setDates] = useState<DateRange | undefined>();
  const [travelers, setTravelers] = useState<TravelerProfile[]>(() => [createTraveler("traveler-1")]);
  const [activeTravelerId, setActiveTravelerId] = useState<string | null>(null);
  // Each traveler is filled in two sub-steps: their details form, then their documents.
  const [travelerSubStep, setTravelerSubStep] = useState<"details" | "documents">("details");
  const [uploads, setUploads] = useState<Record<string, string>>({});
  const [skipped, setSkipped] = useState<Set<string>>(new Set());

  const totalPerTraveler = totalFee(country);
  const total = totalPerTraveler === null ? null : totalPerTraveler * travelers.length;
  const activeTraveler = travelers.find(({ id }) => id === activeTravelerId) ?? null;

  const earliest = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + (country.processingDays ?? 7));
    return cutoff;
  }, [country.processingDays]);

  // The wizard owns the whole viewport; without this the page can grow a
  // second scrollbar whose track shows as a white strip beside the frame.
  useEffect(() => {
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = previous;
    };
  }, []);

  const isTravelerComplete = ({ traveler, marital }: TravelerProfile) =>
    Boolean(traveler.firstName && traveler.lastName && traveler.passportNumber && traveler.nationality && marital);

  const canContinue =
    step === 0
      ? Boolean(dates?.from && dates?.to)
      : step === 1
        ? activeTraveler
          ? travelerSubStep === "details"
            ? isTravelerComplete(activeTraveler)
            : true // documents are skippable
          : travelers.every(isTravelerComplete)
        : true;

  function startScan(id: string) {
    const selectedTraveler = travelers.find((traveler) => traveler.id === id);
    if (!selectedTraveler || selectedTraveler.scanState === "scanning") return;
    setTravelers((current) =>
      current.map((traveler) =>
        traveler.id === id ? { ...traveler, scanState: "scanning" } : traveler,
      ),
    );
    setTimeout(() => {
      setTravelers((current) =>
        current.map((traveler) =>
          traveler.id === id
            ? { ...traveler, traveler: { ...traveler.traveler, ...SCANNED }, scanState: "done" }
            : traveler,
        ),
      );
    }, 2000);
  }

  const setTravelerField = (id: string, field: keyof Traveler) => (value: string) =>
    setTravelers((current) =>
      current.map((traveler) =>
        traveler.id === id
          ? { ...traveler, traveler: { ...traveler.traveler, [field]: value } }
          : traveler,
      ),
    );

  const setTravelerMarital = (id: string, marital: string) =>
    setTravelers((current) =>
      current.map((traveler) => (traveler.id === id ? { ...traveler, marital } : traveler)),
    );

  function addTraveler() {
    const id = `traveler-${Date.now()}`;
    setTravelers((current) => [...current, createTraveler(id)]);
    setActiveTravelerId(id);
    setTravelerSubStep("details");
  }

  function selectTraveler(id: string) {
    setActiveTravelerId(id);
    setTravelerSubStep("details");
  }

  function removeTraveler(id: string) {
    if (travelers.length === 1) return;
    setTravelers((current) => current.filter((traveler) => traveler.id !== id));
    if (activeTravelerId === id) setActiveTravelerId(null);
  }

  function handleBack() {
    if (step === 1 && activeTravelerId) {
      if (travelerSubStep === "documents") {
        setTravelerSubStep("details");
        return;
      }
      setActiveTravelerId(null);
      return;
    }
    setStep(Math.max(0, step - 1));
  }

  function handleContinue() {
    if (step === 1 && activeTravelerId) {
      if (travelerSubStep === "details") {
        setTravelerSubStep("documents");
        return;
      }
      setActiveTravelerId(null);
      setTravelerSubStep("details");
      return;
    }
    setStep(Math.min(STEPS.length - 1, step + 1));
  }

  const atStart = step === 0 && !activeTravelerId;

  return (
    <div className={dark ? "dark" : undefined}>
      <div className="h-dvh bg-paper p-2 text-ink sm:p-4">
        <div className="grid h-full grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-2xl bg-surface shadow-[0_30px_70px_-40px_rgba(31,26,21,0.35)] ring-1 ring-line/60">
          {/* ------------------------------- top chrome ------------------------------- */}
          <header className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-line/70 px-3 py-3 sm:grid-cols-[1fr_auto_1fr] sm:px-6">
            {atStart ? (
              <Link
                href={`/destinations/${country.slug}`}
                className="inline-flex w-fit items-center gap-1.5 rounded-xl border border-line bg-surface px-4 py-2.5 text-[13px] font-semibold text-ink transition-colors hover:border-brand hover:bg-brand-tint/40"
              >
                <IconChevronLeft size={16} stroke={2} />
                Back
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex w-fit items-center gap-1.5 rounded-xl border border-line bg-surface px-4 py-2.5 text-[13px] font-semibold text-ink transition-colors hover:border-brand hover:bg-brand-tint/40"
              >
                <IconChevronLeft size={16} stroke={2} />
                Back
              </button>
            )}

            <div className="hidden flex-col items-center sm:flex">
              <p className="numeric text-[11.5px] font-semibold tracking-[0.24em] text-ink uppercase">
                Step {step + 1} of {STEPS.length}
                <span className="mx-2 text-brand" aria-hidden="true">
                  •
                </span>
                <span className="text-ink-soft">{STEPS[step].label}</span>
              </p>
              <div className="mt-2 flex w-64 items-center lg:w-80" aria-hidden="true">
                {STEPS.map(({ label }, index) => (
                  <Fragment key={label}>
                    {index > 0 ? <span className="mx-1.5 size-1 shrink-0 rounded-full bg-line" /> : null}
                    <span className="h-[3px] flex-1 overflow-hidden rounded-full bg-line">
                      <span
                        className="block h-full rounded-full bg-brand-strong transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        style={{ width: index < step ? "100%" : index === step ? "55%" : "0%" }}
                      />
                    </span>
                  </Fragment>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <Link
                href={`/destinations/${country.slug}`}
                className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-[13px] font-semibold text-ink transition-colors hover:border-brand hover:bg-brand-tint/40"
              >
                <IconBookmark size={15} stroke={1.8} />
                <span className="hidden md:inline">Save &amp; exit</span>
              </Link>
              <button
                type="button"
                onClick={() => setDark((current) => !current)}
                aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
                className="grid size-10 place-items-center rounded-xl border border-line bg-surface text-ink-soft transition-colors hover:border-brand hover:text-ink"
              >
                {dark ? <IconMoon size={17} stroke={1.7} /> : <IconSun size={17} stroke={1.7} />}
              </button>
            </div>
          </header>

          {/* ------------------------------ sheet body ------------------------------ */}
          <div className="grid min-h-0 lg:grid-cols-[19.5rem_minmax(0,1fr)] xl:grid-cols-[22rem_minmax(0,1fr)]">
            <SidebarRail country={country} step={step} />

            <div className="grid min-h-0 grid-rows-[minmax(0,1fr)_auto]">
              <main
                data-lenis-prevent
                className="application-form-scroll flex min-h-0 flex-col overflow-x-hidden overflow-y-auto overscroll-contain px-4 py-4 sm:px-8 lg:px-10"
              >
                <CorridorStrip country={country} className="mb-4 lg:hidden" />

                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={step === 1 ? `1-${activeTravelerId ?? "roster"}-${travelerSubStep}` : step}
                    initial={reduce ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -12 }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    className="my-auto w-full"
                  >
                    {step === 0 ? (
                      <TripStep country={country} dates={dates} setDates={setDates} earliest={earliest} />
                    ) : step === 1 ? (
                      activeTraveler ? (
                        travelerSubStep === "documents" ? (
                          <TravelerDocumentsStep
                            country={country}
                            profile={activeTraveler}
                            travelerNumber={travelers.findIndex(({ id }) => id === activeTraveler.id) + 1}
                            travelerCount={travelers.length}
                            uploads={uploads}
                            setUploads={setUploads}
                            skipped={skipped}
                            setSkipped={setSkipped}
                          />
                        ) : (
                          <TravelerStep
                            traveler={activeTraveler.traveler}
                            travelerNumber={travelers.findIndex(({ id }) => id === activeTraveler.id) + 1}
                            travelerCount={travelers.length}
                            setField={(field) => setTravelerField(activeTraveler.id, field)}
                            marital={activeTraveler.marital}
                            setMarital={(value) => setTravelerMarital(activeTraveler.id, value)}
                            scanState={activeTraveler.scanState}
                            startScan={() => startScan(activeTraveler.id)}
                          />
                        )
                      ) : (
                        <TravelerRoster
                          travelers={travelers}
                          country={country}
                          uploads={uploads}
                          onSelect={selectTraveler}
                          onAdd={addTraveler}
                          onRemove={removeTraveler}
                          isComplete={isTravelerComplete}
                        />
                      )
                    ) : (
                      <ReviewStep
                        country={country}
                        dates={dates}
                        travelers={travelers}
                        uploads={uploads}
                        onEdit={(target) => setStep(target)}
                        onEditTraveler={(id) => {
                          setStep(1);
                          selectTraveler(id);
                        }}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </main>

              <footer className="flex items-center justify-between gap-4 border-t border-line/70 px-4 py-4 sm:px-8">
                <div className="hidden items-center gap-3 md:flex">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-brand-strong">
                    <IconShieldCheck size={19} stroke={1.6} />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-ink">Secure. Trusted. Hassle-free.</p>
                    <p className="text-[12px] text-ink-soft">Your data is encrypted and protected.</p>
                  </div>
                </div>

                <div className="ml-auto flex items-center gap-3">
                  {step === STEPS.length - 1 ? (
                    <p className="hidden text-[12px] text-ink-soft sm:block">Refundable if denied</p>
                  ) : null}
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={atStart}
                    className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-6 py-3 text-[13.5px] font-semibold text-ink transition-all duration-200 hover:border-brand hover:bg-brand-tint/40 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:bg-surface"
                  >
                    <IconArrowLeft size={15} stroke={1.9} />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleContinue}
                    disabled={!canContinue}
                    className="btn-gold inline-flex items-center gap-2.5 rounded-xl px-8 py-3 text-[13.5px] font-semibold text-brand-ink transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-[#b0966f] hover:shadow-[0_14px_28px_-16px_rgba(31,26,21,0.7)] active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  >
                    {step === STEPS.length - 1 ? (
                      <>
                        <IconLock size={15} stroke={1.8} />
                        Pay {total === null ? "securely" : `$${total}`}
                      </>
                    ) : step === 1 && activeTraveler ? (
                      travelerSubStep === "details" ? (
                        <>
                          Add documents
                          <IconArrowRight size={15} stroke={1.9} />
                        </>
                      ) : (
                        <>
                          Save traveler
                          <IconArrowRight size={15} stroke={1.9} />
                        </>
                      )
                    ) : (
                      <>
                        Continue
                        <IconArrowRight size={15} stroke={1.9} />
                      </>
                    )}
                  </button>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- sidebar ---------------------------------- */

function SidebarRail({ country, step }: { country: Country; step: number }) {
  const reduce = useReducedMotion();

  return (
    <aside className="hidden min-h-0 flex-col overflow-y-auto border-r border-line/70 bg-ground lg:flex">
      {/* Faded travel photograph, dissolving into the rail's ground. */}
      <div aria-hidden="true" className="relative h-32 shrink-0 overflow-hidden xl:h-40">
        <Image
          src="https://images.unsplash.com/photo-1474302770737-173ee21bab63?auto=format&fit=crop&w=800&q=70"
          alt=""
          fill
          sizes="22rem"
          className="object-cover opacity-35 sepia-[0.35]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--ground)]/30 via-transparent to-[var(--ground)]" />
      </div>

      <nav aria-label="Application steps" className="px-7 pt-2 xl:px-9">
        <ol>
          {STEPS.map(({ label, sub }, index) => {
            const state = index < step ? "done" : index === step ? "current" : "todo";
            return (
              <li key={label} className="relative flex gap-4 pb-18 last:pb-0">
                {index < STEPS.length - 1 ? (
                  <span aria-hidden="true" className="absolute top-9 left-[17px] h-[calc(100%-2.5rem)] w-px bg-line">
                    <span
                      className="absolute inset-x-0 top-0 w-px bg-brand transition-[height] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      style={{ height: index < step ? "100%" : "0%" }}
                    />
                    {/* The plane rides the tip of the gold line down to the current step. */}
                    <span
                      className={`absolute left-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ground p-1 text-brand-strong transition-[top,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        index === step - 1 ? "opacity-100" : "opacity-0"
                      }`}
                      style={{ top: index < step ? "calc(100% - 18px)" : "0%" }}
                    >
                      <IconPlane size={22} stroke={1.6} className="rotate-90" />
                    </span>
                  </span>
                ) : null}
                <span
                  className={`numeric relative z-10 grid size-[35px] shrink-0 place-items-center rounded-full text-[13px] font-semibold transition-[background-color,color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    state === "done"
                      ? "bg-brand text-brand-ink"
                      : state === "current"
                        ? "bg-brand-strong text-white shadow-[0_8px_16px_-10px_rgba(160,126,76,0.9)]"
                        : "border border-line bg-surface text-ink-soft"
                  }`}
                >
                  {state === "current" ? (
                    <>
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 rounded-full bg-brand-strong/45 animate-[stepper-ripple_2.4s_ease-out_infinite]"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 rounded-full bg-brand-strong/35 animate-[stepper-ripple_2.4s_ease-out_infinite] [animation-delay:1.2s]"
                      />
                    </>
                  ) : null}
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={state === "done" ? "check" : "number"}
                      initial={reduce ? false : { scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={reduce ? undefined : { scale: 0.4, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="grid place-items-center"
                    >
                      {state === "done" ? <IconCircleCheck size={17} stroke={2.2} /> : index + 1}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <div className="pt-1">
                  <p
                    className={`text-[14.5px] font-semibold transition-colors duration-500 ${
                      state === "todo" ? "text-ink-soft" : "text-ink"
                    }`}
                  >
                    {label}
                  </p>
                  <p className="mt-0.5 text-[12.5px] text-ink-soft">{sub}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="mt-auto p-5 xl:p-6">
        <ApplicationSummary country={country} />
      </div>
    </aside>
  );
}

function ApplicationSummary({ country }: { country: Country }) {
  const fee = totalFee(country);
  const rows = [
    { icon: IconClock, label: "Processing time", value: country.processing },
    { icon: IconFileText, label: "Documents required", value: String(country.documents.length) },
    { icon: IconCreditCard, label: "Service fee", value: fee === null ? "At checkout" : `$${country.serviceFee ?? 0}` },
  ];

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-[0_18px_38px_-32px_rgba(31,26,21,0.5)]">
      <p className="text-[10.5px] font-semibold tracking-[0.2em] text-ink-soft uppercase">Your application</p>

      <div className="mt-4 flex items-start gap-4">
        <CorridorChip iso2="IN" name="India" />
        <span className="mt-2 text-brand-strong" aria-hidden="true">
          <IconArrowRight size={17} stroke={1.8} />
        </span>
        <CorridorChip iso2={country.iso2} name={country.name} />
      </div>

      <dl className="mt-4 grid gap-2.5 border-t border-line/70 pt-4">
        {rows.map(({ icon: RowIcon, label, value }) => (
          <div key={label} className="flex items-center justify-between gap-3">
            <dt className="flex items-center gap-2 text-[12.5px] text-ink-soft">
              <RowIcon size={15} stroke={1.7} className="shrink-0 text-ink-soft/80" />
              {label}
            </dt>
            <dd className="numeric text-[12.5px] font-semibold text-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function CorridorChip({ iso2, name }: { iso2: string; name: string }) {
  return (
    <div className="min-w-0">
      <span className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line bg-ground px-2">
        <Image
          src={flagSrc(iso2)}
          alt=""
          width={20}
          height={15}
          className="h-3.5 w-5 rounded-[3px] object-cover ring-1 ring-line/60"
        />
        <span className="numeric text-[13px] font-semibold text-ink">{iso2}</span>
      </span>
      <p className="mt-1.5 truncate text-[12px] font-medium text-ink">{name}</p>
    </div>
  );
}

/** Compact corridor summary shown above the step content when the rail is hidden. */
function CorridorStrip({ country, className = "" }: { country: Country; className?: string }) {
  return (
    <div className={`flex items-center justify-between gap-3 rounded-xl border border-line bg-ground px-4 py-3 ${className}`}>
      <p className="numeric flex items-center gap-2 text-[12.5px] font-semibold tracking-[0.08em] text-ink uppercase">
        India <IconArrowRight size={13} stroke={2} className="text-brand-strong" /> {country.name}
      </p>
      <p className="numeric text-[12px] text-ink-soft">
        {country.processing} · {country.documents.length} documents
      </p>
    </div>
  );
}

/* ---------------------------------- steps ----------------------------------- */

function StepHeading({
  icon: HeadingIcon,
  title,
  subtitle,
}: {
  icon: typeof IconCalendarEvent;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-4">
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-brand/25 bg-brand-tint text-brand-strong shadow-[0_14px_26px_-22px_rgba(160,126,76,0.9)] sm:size-13">
        <HeadingIcon size={24} stroke={1.5} />
      </span>
      <div>
        <h1 className="font-heading text-[1.7rem] leading-[1.05] text-ink md:text-[2.1rem]">{title}</h1>
        <p className="mt-1 max-w-[68ch] text-[13.5px] leading-relaxed text-ink-soft">{subtitle}</p>
      </div>
    </div>
  );
}

function TripStep({
  country,
  dates,
  setDates,
  earliest,
}: {
  country: Country;
  dates: DateRange | undefined;
  setDates: (range: DateRange | undefined) => void;
  earliest: Date;
}) {
  const processingLabel =
    country.processingDays !== null ? `~${country.processingDays} days` : country.processing;

  const rangeLabel = dates?.from
    ? dates.to
      ? `${mediumDate.format(dates.from)} – ${mediumDate.format(dates.to)}`
      : longDate.format(dates.from)
    : "Choose your dates";

  return (
    <section className="mx-auto w-full max-w-[74rem]">
      <StepHeading
        icon={IconCalendarEvent}
        title="Travel Dates"
        subtitle="When are you planning to travel? Pick a departure and return date."
      />

      <div className="rounded-2xl border border-line bg-surface px-4 pt-4 pb-3.5 shadow-[0_24px_54px_-42px_rgba(31,26,21,0.5)] sm:px-6">
        <Calendar
          mode="range"
          numberOfMonths={2}
          weekStartsOn={1}
          selected={dates}
          onSelect={setDates}
          disabled={{ before: earliest }}
          className="mx-auto w-full bg-transparent p-0 [--cell-radius:9999px] [--cell-size:2.05rem] sm:[--cell-size:2.35rem]"
          modifiers={{ weekend: { dayOfWeek: [0, 6] } }}
          modifiersClassNames={{ weekend: "text-brand-strong" }}
          dayButtonClassName="rounded-full text-[13.5px] font-medium text-inherit transition-[background-color,box-shadow] duration-200 ease-out hover:bg-brand-tint hover:text-brand-strong focus-visible:ring-brand/45 data-[range-start=true]:rounded-full! data-[range-start=true]:bg-ink! data-[range-start=true]:text-surface! data-[range-start=true]:shadow-[0_10px_20px_-12px_rgba(31,26,21,0.9)] data-[range-end=true]:rounded-full! data-[range-end=true]:bg-ink! data-[range-end=true]:text-surface! data-[range-end=true]:shadow-[0_10px_20px_-12px_rgba(31,26,21,0.9)] data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-transparent data-[range-middle=true]:text-ink data-[range-middle=true]:hover:bg-brand-tint"
          classNames={{
            months: "relative mx-auto flex w-full max-w-[56rem] flex-col justify-center gap-6 md:flex-row md:gap-12",
            month: "flex min-w-0 w-full max-w-[26rem] flex-1 flex-col gap-2.5",
            nav: "pointer-events-none absolute inset-x-0 top-0 z-20 flex h-(--cell-size) items-center justify-between",
            button_previous:
              "pointer-events-auto grid size-9 place-items-center rounded-xl border border-line bg-surface text-ink shadow-[0_10px_20px_-16px_rgba(31,26,21,0.6)] transition-all duration-200 hover:border-brand hover:bg-brand-tint hover:text-brand-strong",
            button_next:
              "pointer-events-auto grid size-9 place-items-center rounded-xl border border-line bg-surface text-ink shadow-[0_10px_20px_-16px_rgba(31,26,21,0.6)] transition-all duration-200 hover:border-brand hover:bg-brand-tint hover:text-brand-strong",
            month_caption: "flex h-(--cell-size) w-full items-center justify-center px-2",
            caption_label: "font-heading text-[1.25rem] text-ink md:text-[1.35rem]",
            week: "mt-1 flex w-full",
            weekday: "flex-1 text-[12px] font-medium text-ink-soft select-none",
            today: "font-semibold",
            outside: "text-ink-soft/45 opacity-100",
            disabled: "text-ink-soft/35 opacity-100",
            range_start: "rounded-l-full bg-brand-tint/70 after:hidden",
            range_middle: "rounded-none bg-brand-tint/70",
            range_end: "rounded-r-full bg-brand-tint/70 after:hidden",
          }}
        />

        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 border-t border-line/70 px-1 pt-3 sm:px-2">
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full border border-brand/25 bg-brand-tint text-brand-strong">
              <IconCalendarEvent size={18} stroke={1.6} />
            </span>
            <div>
              <p className="text-[12px] text-ink-soft">
                {dates?.from && !dates.to ? "Departure selected — now pick a return date" : "Selected travel dates"}
              </p>
              <p className={`font-heading text-[1.15rem] leading-tight ${dates?.from ? "text-ink" : "text-ink-soft/70"}`}>
                {rangeLabel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {dates?.from ? (
              <button
                type="button"
                onClick={() => setDates(undefined)}
                className="text-[12.5px] font-medium text-ink-soft underline-offset-4 transition-colors hover:text-brand-strong hover:underline"
              >
                Clear
              </button>
            ) : null}
            <span className="inline-flex items-center gap-2 rounded-lg bg-positive/10 px-3.5 py-2 text-[13px] font-medium text-positive">
              <IconCircleCheck size={16} stroke={2} />
              Visa takes {processingLabel} to process.
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3 rounded-xl border border-line/60 bg-paper/70 px-4 py-3 sm:px-5">
        <IconInfoCircle size={18} stroke={1.7} className="shrink-0 text-brand-strong" />
        <p className="text-[13.5px] leading-relaxed text-ink-soft">
          Plan ahead! We recommend applying at least {country.processingDays ?? 7} days before your
          intended travel date.
        </p>
      </div>
    </section>
  );
}

function TravelerRoster({
  travelers,
  country,
  uploads,
  onSelect,
  onAdd,
  onRemove,
  isComplete,
}: {
  travelers: TravelerProfile[];
  country: Country;
  uploads: Record<string, string>;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  isComplete: (traveler: TravelerProfile) => boolean;
}) {
  const uploadedFor = (travelerId: string) =>
    country.documents.filter((document) => uploads[docKey(travelerId, document.name)]).length;

  return (
    <section className="mx-auto w-full max-w-[74rem]">
      <StepHeading
        icon={IconUser}
        title="Traveler Details"
        subtitle="Add everyone in this application, then complete each traveler's details and documents one at a time."
      />

      <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
        {travelers.map((profile, index) => {
          const complete = isComplete(profile);
          const name = `${profile.traveler.firstName} ${profile.traveler.lastName}`.trim();
          const isPrimary = index === 0;

          return (
            <div
              key={profile.id}
              className={`group flex min-h-30 min-w-0 items-center rounded-2xl border bg-surface p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_-26px_rgba(31,26,21,0.52)] ${
                complete ? "border-positive/45" : "border-line hover:border-brand"
              }`}
            >
              <button
                type="button"
                onClick={() => onSelect(profile.id)}
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
                aria-label={`Edit ${isPrimary ? "your" : `traveler ${index + 1}`} details`}
              >
                <span
                  className={`numeric grid size-10 shrink-0 place-items-center rounded-xl text-[13px] font-semibold ${
                    complete ? "bg-positive text-white" : "bg-brand-tint text-brand-strong"
                  }`}
                >
                  {complete ? <IconCircleCheck size={19} stroke={2} /> : String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14.5px] font-semibold text-ink">
                    {name || `Traveler ${index + 1}`}
                    {isPrimary ? " (You)" : ""}
                  </span>
                  <span className={`mt-0.5 block text-[12.5px] ${complete ? "text-positive" : "text-ink-soft"}`}>
                    {complete
                      ? `Details complete · ${uploadedFor(profile.id)}/${country.documents.length} documents`
                      : "Details not started"}
                  </span>
                </span>
                <IconArrowRight size={17} stroke={1.7} className="shrink-0 text-ink-soft transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand-strong" />
              </button>
              {!isPrimary ? (
                <button
                  type="button"
                  onClick={() => onRemove(profile.id)}
                  className="ml-2 grid size-8 shrink-0 place-items-center rounded-full border border-transparent text-ink-soft transition-colors hover:border-line hover:bg-brand-tint hover:text-ink"
                  aria-label={`Remove traveler ${index + 1}`}
                >
                  <IconX size={15} stroke={1.8} />
                </button>
              ) : null}
            </div>
          );
        })}

        <button
          type="button"
          onClick={onAdd}
          className="flex min-h-30 items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line bg-brand-tint/20 px-5 text-[13.5px] font-semibold text-ink-soft transition-all duration-200 hover:border-brand hover:bg-brand-tint/60 hover:text-ink"
        >
          <IconPlus size={18} stroke={1.8} className="text-brand-strong" />
          Add another traveler
        </button>
      </div>
    </section>
  );
}

function TravelerStep({
  traveler,
  travelerNumber,
  travelerCount,
  setField,
  marital,
  setMarital,
  scanState,
  startScan,
}: {
  traveler: Traveler;
  travelerNumber: number;
  travelerCount: number;
  setField: (field: keyof Traveler) => (value: string) => void;
  marital: string | null;
  setMarital: (value: string) => void;
  scanState: "idle" | "scanning" | "done";
  startScan: () => void;
}) {
  const filled = scanState === "done";

  return (
    <section className="mx-auto w-full max-w-[74rem]">
      <StepHeading
        icon={IconUser}
        title={`Traveler ${travelerNumber} of ${travelerCount}`}
        subtitle="Choose the marital status, scan the passport if you have it, then confirm the details below."
      />

      <div className="grid gap-5">
        <div className="grid gap-1.5">
          <Label className="text-[13px] font-semibold">Marital status</Label>
          <div role="radiogroup" aria-label="Marital status" className="grid grid-cols-2 gap-2 sm:grid-cols-[repeat(4,7.75rem)]">
            {MARITAL_OPTIONS.map((option) => {
              const selected = marital === option.label;
              const StatusIcon = option.icon;
              return (
                <button
                  key={option.label}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setMarital(option.label)}
                  className={`group flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border text-[13px] font-semibold transition-all duration-200 ${
                    selected
                      ? "border-brand bg-brand-tint text-ink shadow-[0_10px_20px_-18px_rgba(31,26,21,0.85),inset_0_0_0_1px_var(--brand)]"
                      : "border-line bg-surface text-ink-soft hover:-translate-y-0.5 hover:border-brand hover:bg-brand-tint/35 hover:text-ink"
                  }`}
                >
                  <span className={`grid size-8 place-items-center rounded-lg transition-colors ${selected ? "bg-brand text-brand-ink" : "bg-paper text-brand-strong group-hover:bg-brand-tint"}`}>
                    <StatusIcon size={17} stroke={1.7} />
                  </span>
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <button
        type="button"
        onClick={startScan}
        disabled={scanState === "scanning"}
        className={`flex w-full items-center gap-4 rounded-2xl border-2 border-dashed p-4 text-left transition-colors duration-300 ${
          filled
            ? "border-positive/50 bg-positive/5"
            : "border-line bg-surface hover:border-brand hover:bg-brand-tint/30"
        }`}
      >
        <span
          className={`grid size-12 shrink-0 place-items-center rounded-xl transition-colors ${
            filled ? "bg-positive text-white" : "bg-brand-tint text-brand-strong"
          }`}
        >
          {scanState === "scanning" ? (
            <IconLoader2 size={22} stroke={1.7} className="animate-spin" />
          ) : filled ? (
            <IconCircleCheck size={22} stroke={1.8} />
          ) : (
            <IconScan size={22} stroke={1.6} />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[14.5px] font-semibold text-ink">
            {scanState === "scanning"
              ? "Reading your passport..."
              : filled
                ? "Passport scanned. Details filled below."
                : "Scan your passport bio page"}
          </span>
          <span className="mt-0.5 block text-[12.5px] text-ink-soft">
            {scanState === "scanning"
              ? "This takes a few seconds."
              : filled
                ? "Check every field before you continue."
                : "AES-256 encrypted. Your passport stays private. Or fill the form manually."}
          </span>
        </span>
        {scanState === "idle" ? (
          <span className="numeric hidden shrink-0 rounded-full border border-line bg-surface px-4 py-2 text-[11px] font-semibold tracking-[0.1em] text-ink uppercase sm:block">
            Auto-fill
          </span>
        ) : null}
        </button>

        <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="grid gap-1.5">
          <Label className="text-[13px] font-semibold">First name</Label>
          <Input
            value={traveler.firstName}
            onChange={(e) => setField("firstName")(e.target.value)}
            placeholder="First name"
            autoComplete="given-name"
            className={fieldClass}
          />
        </div>
        <div className="grid gap-1.5">
          <Label className="text-[13px] font-semibold">Last name</Label>
          <Input
            value={traveler.lastName}
            onChange={(e) => setField("lastName")(e.target.value)}
            placeholder="Last name"
            autoComplete="family-name"
            className={fieldClass}
          />
        </div>
        <div className="grid gap-1.5">
          <Label className="text-[13px] font-semibold">Date of birth</Label>
          <Input
            type="date"
            value={traveler.dateOfBirth}
            onChange={(e) => setField("dateOfBirth")(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div className="grid gap-1.5">
          <Label className="text-[13px] font-semibold">Gender</Label>
          <Select value={traveler.gender} onValueChange={setField("gender")}>
            <SelectTrigger className={selectFieldClass}>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-line bg-surface">
              {["Female", "Male", "Other"].map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label className="text-[13px] font-semibold">Passport number</Label>
          <Input
            value={traveler.passportNumber}
            onChange={(e) => setField("passportNumber")(e.target.value)}
            placeholder="Passport number"
            className={`${fieldClass} numeric`}
          />
        </div>
        <div className="grid gap-1.5">
          <Label className="text-[13px] font-semibold">Nationality</Label>
          <Select value={traveler.nationality} onValueChange={setField("nationality")}>
            <SelectTrigger className={selectFieldClass}>
              <SelectValue placeholder="Select nationality" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-line bg-surface">
              {NATIONALITIES.map((item) => (
                <SelectItem key={item.code} value={item.code}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label className="text-[13px] font-semibold">Passport issued on</Label>
          <Input
            type="date"
            value={traveler.issuedOn}
            onChange={(e) => setField("issuedOn")(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div className="grid gap-1.5">
          <Label className="text-[13px] font-semibold">Passport valid till</Label>
          <Input
            type="date"
            value={traveler.validTill}
            onChange={(e) => setField("validTill")(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div className="grid gap-1.5">
          <Label className="text-[13px] font-semibold">Passport place of issue</Label>
          <Input
            value={traveler.placeOfIssue}
            onChange={(e) => setField("placeOfIssue")(e.target.value)}
            placeholder="Passport place of issue"
            className={fieldClass}
          />
        </div>
        </div>
      </div>
    </section>
  );
}

function TravelerDocumentsStep({
  country,
  profile,
  travelerNumber,
  travelerCount,
  uploads,
  setUploads,
  skipped,
  setSkipped,
}: {
  country: Country;
  profile: TravelerProfile;
  travelerNumber: number;
  travelerCount: number;
  uploads: Record<string, string>;
  setUploads: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  skipped: Set<string>;
  setSkipped: React.Dispatch<React.SetStateAction<Set<string>>>;
}) {
  const name =
    `${profile.traveler.firstName} ${profile.traveler.lastName}`.trim() ||
    `Traveler ${travelerNumber}`;
  const uploadedCount = country.documents.filter(
    (document) => uploads[docKey(profile.id, document.name)],
  ).length;

  return (
    <section className="mx-auto w-full max-w-[74rem]">
      <StepHeading
        icon={IconFileText}
        title={`${name}'s documents`}
        subtitle={`Traveler ${travelerNumber} of ${travelerCount} · Upload the ${country.documents.length} required documents. Skip any of them and add them later from your application page.`}
      />

      <p className="numeric mb-3 text-[12.5px] text-ink-soft" aria-live="polite">
        {uploadedCount} of {country.documents.length} uploaded
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {country.documents.map((document) => {
          const key = docKey(profile.id, document.name);
          const uploaded = uploads[key];
          const isSkipped = skipped.has(key);
          const slug = document.name.toLowerCase().replace(/\s+/g, "-");

          return (
            <div key={key} className={isSkipped && !uploaded ? "opacity-60" : undefined}>
              <FileUpload
                id={`upload-${profile.id}-${slug}`}
                compact
                label={document.name}
                hint={`${document.hint} · JPG, PNG or PDF up to 10 MB`}
                initialFileName={uploaded}
                onChange={(files) => {
                  const file = files[0];
                  if (!file) return;
                  setUploads((current) => ({ ...current, [key]: file.name }));
                  setSkipped((current) => {
                    const next = new Set(current);
                    next.delete(key);
                    return next;
                  });
                }}
                onRemove={() =>
                  setUploads((current) => {
                    const next = { ...current };
                    delete next[key];
                    return next;
                  })
                }
              />
              {!uploaded ? (
                <div className="mt-1.5 flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      setSkipped((current) => {
                        const next = new Set(current);
                        if (next.has(key)) next.delete(key);
                        else next.add(key);
                        return next;
                      })
                    }
                    className={`text-[12.5px] font-medium underline-offset-4 transition-colors hover:underline ${
                      isSkipped ? "text-brand-strong" : "text-ink-soft"
                    }`}
                  >
                    {isSkipped ? "Skipped — undo" : "Skip for now"}
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-2.5">
      <dt className="text-[13px] text-ink-soft">{label}</dt>
      <dd className="numeric text-right text-[13.5px] font-semibold text-ink">
        {value || "Not provided"}
      </dd>
    </div>
  );
}

function ReviewStep({
  country,
  dates,
  travelers,
  uploads,
  onEdit,
  onEditTraveler,
}: {
  country: Country;
  dates: DateRange | undefined;
  travelers: TravelerProfile[];
  uploads: Record<string, string>;
  onEdit: (step: number) => void;
  onEditTraveler: (id: string) => void;
}) {
  const totalPerTraveler = totalFee(country);
  const total = totalPerTraveler === null ? null : totalPerTraveler * travelers.length;
  const anySkipped = travelers.some((profile) =>
    country.documents.some((document) => !uploads[docKey(profile.id, document.name)]),
  );

  return (
    <section className="mx-auto w-full max-w-[74rem]">
      <StepHeading icon={IconChecklist} title="Review & Confirm" subtitle="One last look before we file." />

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)_minmax(18rem,0.95fr)]">
        {/* Column 1: trip + documents */}
        <div className="grid min-w-0 gap-4">
          <div className="rounded-2xl border border-line bg-surface p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] font-semibold tracking-[0.18em] text-brand-strong uppercase">
                Trip
              </h2>
              <EditButton onClick={() => onEdit(0)} />
            </div>
            <dl className="mt-1 divide-y divide-line/70">
              <ReviewRow label="Destination" value={country.name} />
              <ReviewRow
                label="Travel dates"
                value={
                  dates?.from
                    ? `${mediumDate.format(dates.from)}${dates.to ? ` – ${mediumDate.format(dates.to)}` : ""}`
                    : ""
                }
              />
              <ReviewRow label="Visa type" value={country.visaType} />
              <ReviewRow label="Entry" value={`${country.entry} entry`} />
            </dl>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] font-semibold tracking-[0.18em] text-brand-strong uppercase">
                Documents
              </h2>
              <EditButton onClick={() => onEdit(1)} />
            </div>
            {travelers.map((profile, index) => {
              const name =
                `${profile.traveler.firstName} ${profile.traveler.lastName}`.trim() ||
                `Traveler ${index + 1}`;
              return (
                <div key={profile.id} className={index > 0 ? "mt-2 border-t border-line/70 pt-2" : "mt-2"}>
                  {travelers.length > 1 ? (
                    <p className="text-[12px] font-semibold text-ink-soft">{name}</p>
                  ) : null}
                  <ul className="grid gap-0.5">
                    {country.documents.map((document) => {
                      const uploaded = uploads[docKey(profile.id, document.name)];
                      return (
                        <li
                          key={document.name}
                          className="flex items-center justify-between gap-3 py-1.5 text-[13px]"
                        >
                          <span className="flex min-w-0 items-center gap-2 font-medium text-ink">
                            <span
                              className={`grid size-5 shrink-0 place-items-center rounded-full ${
                                uploaded ? "bg-positive text-white" : "bg-brand-tint text-brand-strong"
                              }`}
                            >
                              {uploaded ? (
                                <IconCircleCheck size={13} stroke={2.4} />
                              ) : (
                                <IconCloudUpload size={12} stroke={2} />
                              )}
                            </span>
                            <span className="truncate">{document.name}</span>
                          </span>
                          <span
                            className={`shrink-0 text-[12px] ${uploaded ? "text-positive" : "text-ink-soft"}`}
                          >
                            {uploaded ? "Uploaded" : "Skipped"}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
            {anySkipped ? (
              <p className="mt-2 border-t border-line/70 pt-3 text-[12px] leading-relaxed text-ink-soft">
                Skipped documents can be uploaded later from your application page.
              </p>
            ) : null}
          </div>
        </div>

        {/* Column 2: every traveler, kept compact enough to scan as a party. */}
        <div className="min-w-0 rounded-2xl border border-line bg-surface p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-semibold tracking-[0.18em] text-brand-strong uppercase">
              Travelers ({travelers.length})
            </h2>
            <EditButton onClick={() => onEdit(1)} />
          </div>
          <div className="mt-3 grid gap-2.5">
            {travelers.map((profile, index) => {
              const name = `${profile.traveler.firstName} ${profile.traveler.lastName}`.trim();
              return (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => onEditTraveler(profile.id)}
                  className="group rounded-xl border border-line p-3 text-left transition-colors hover:border-brand hover:bg-brand-tint/25"
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span className="numeric grid size-7 shrink-0 place-items-center rounded-full bg-brand-tint text-[10px] font-semibold text-brand-strong">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="truncate text-[13.5px] font-semibold text-ink">
                        {name || `Traveler ${index + 1}`}
                        {index === 0 ? " (You)" : ""}
                      </span>
                    </span>
                    <IconPencil size={14} stroke={1.8} className="shrink-0 text-brand-strong" />
                  </span>
                  <span className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 border-t border-line/70 pt-2 text-[11.5px] text-ink-soft">
                    <span className="truncate">{profile.traveler.passportNumber || "Passport not provided"}</span>
                    <span className="truncate text-right">{profile.traveler.nationality || "Nationality not provided"}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Column 3: payment, always in view */}
        <div className="min-w-0 overflow-hidden rounded-2xl border border-line bg-paper">
          <div
            aria-hidden="true"
            className="h-px bg-gradient-to-r from-transparent via-brand to-transparent"
          />
          <div className="p-4">
            <h2 className="text-[11px] font-semibold tracking-[0.18em] text-brand-strong uppercase">
              Payment
            </h2>
            <dl className="mt-1 divide-y divide-line/70">
              <ReviewRow
                label="Government fee"
                value={
                  country.govFee === null
                    ? "At checkout"
                    : `$${country.govFee * travelers.length}`
                }
              />
              <ReviewRow label="Service fee" value={`$${(country.serviceFee ?? 0) * travelers.length}`} />
            </dl>
            <div className="mt-2 flex items-baseline justify-between border-t border-line pt-4">
              <p className="text-[14px] font-semibold text-ink">Total</p>
              <p className="numeric font-heading text-[2rem] text-ink">
                {total === null ? "At checkout" : `$${total}`}
              </p>
            </div>

            <ul className="mt-3 grid gap-2 border-t border-line pt-3">
              {[
                "Refundable if your visa is denied",
                `Delivered by email in ${country.processing}`,
                `${travelers.length} traveler${travelers.length === 1 ? "" : "s"} included in this application`,
                "Payment secured by Stripe",
              ].map((line) => (
                <li key={line} className="flex items-start gap-2 text-[12.5px] text-ink-soft">
                  <IconCircleCheck
                    size={15}
                    stroke={1.9}
                    className="mt-px shrink-0 text-brand-strong"
                  />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 text-[12.5px] font-medium text-brand-strong underline-offset-4 transition-colors hover:underline"
    >
      <IconPencil size={13} stroke={1.8} />
      Edit
    </button>
  );
}

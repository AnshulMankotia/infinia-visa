"use client";

/**
 * Application checkout, designed in the site's own language rather than the old site's
 * wizard: a photographic corridor rail on the left (like the auth pages), a horizontal
 * gold stepper, four condensed steps, and a payment summary on review.
 *
 * Content model comes from the old checkout: travel dates, marital status, passport
 * scan with auto-fill, traveler details, per-document uploads with skip, review.
 * Demo build: the scan is simulated and no payment backend is wired up.
 */

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCircleCheck,
  IconCloudUpload,
  IconFileText,
  IconFlower,
  IconHeart,
  IconHeartBroken,
  IconLoader2,
  IconLock,
  IconPencil,
  IconPlus,
  IconRoute,
  IconScan,
  IconShieldCheck,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Logo } from "@/components/layout/logo";
import { NATIONALITIES } from "@/data/site";
import { flagSrc, totalFee, type Country } from "@/data/countries";

/* ---------------------------------- model ---------------------------------- */

const STEPS = ["Trip", "Traveler", "Documents", "Review"] as const;

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
const shortDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });

const fieldClass =
  "h-10 w-full rounded-lg border-line bg-surface px-3.5 text-[14px] text-ink shadow-none transition-[border-color,box-shadow] duration-200 placeholder:text-ink-soft/70 hover:border-brand focus-visible:border-brand-strong focus-visible:ring-0 focus-visible:shadow-[0_0_0_1px_var(--brand-strong)] focus-visible:outline-none";

const selectFieldClass =
  "h-10 w-full rounded-lg border-line bg-surface px-3.5 text-[14px] text-ink shadow-none transition-[border-color,box-shadow] duration-200 hover:border-brand focus-visible:border-brand-strong focus-visible:ring-0 focus-visible:shadow-[0_0_0_1px_var(--brand-strong)] focus-visible:outline-none data-[placeholder]:text-ink-soft/70";

/* ---------------------------------- shell ---------------------------------- */

export function ApplyWizard({ country }: { country: Country }) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [dates, setDates] = useState<DateRange | undefined>();
  const [travelers, setTravelers] = useState<TravelerProfile[]>(() => [createTraveler("traveler-1")]);
  const [activeTravelerId, setActiveTravelerId] = useState<string | null>(null);
  const [uploads, setUploads] = useState<Record<string, string>>({});
  const [skipped, setSkipped] = useState<Set<string>>(new Set());

  const totalPerTraveler = totalFee(country);
  const total = totalPerTraveler === null ? null : totalPerTraveler * travelers.length;
  const activeTraveler = travelers.find(({ id }) => id === activeTravelerId) ?? null;

  const earliest = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + (country.processingDays ?? 7));
    return date;
  }, [country.processingDays]);

  const deliverBy = useMemo(() => {
    if (!dates?.from) return null;
    const date = new Date();
    date.setDate(date.getDate() + (country.processingDays ?? 7));
    return date > dates.from ? dates.from : date;
  }, [dates, country.processingDays]);

  const isTravelerComplete = ({ traveler, marital }: TravelerProfile) =>
    Boolean(traveler.firstName && traveler.lastName && traveler.passportNumber && traveler.nationality && marital);

  const canContinue =
    step === 0
      ? Boolean(dates?.from)
      : step === 1
        ? activeTraveler
          ? isTravelerComplete(activeTraveler)
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
  }

  function selectTraveler(id: string) {
    setActiveTravelerId(id);
  }

  function removeTraveler(id: string) {
    if (travelers.length === 1) return;
    setTravelers((current) => current.filter((traveler) => traveler.id !== id));
    if (activeTravelerId === id) setActiveTravelerId(null);
  }

  function handleBack() {
    if (step === 1 && activeTravelerId) {
      setActiveTravelerId(null);
      return;
    }
    setStep(Math.max(0, step - 1));
  }

  function handleContinue() {
    if (step === 1 && activeTravelerId) {
      setActiveTravelerId(null);
      return;
    }
    setStep(Math.min(STEPS.length - 1, step + 1));
  }

  return (
    <div className="grid h-[100dvh] overflow-hidden bg-ground xl:grid-cols-[65%_35%]">
      {/* The task panel owns the fixed controls. Only its middle section scrolls. */}
      <section className="flex min-h-0 min-w-0 flex-col xl:border-r xl:border-line">
        <header className="flex h-15 shrink-0 items-center justify-between border-b border-line px-4 md:px-8 xl:px-10">
          <div className="xl:hidden">
            <Logo className="-ml-1 w-fit" />
          </div>
          <p className="numeric hidden text-[11px] tracking-[0.18em] text-ink-soft uppercase xl:block">
            {country.name} visa application
          </p>
          <Link
            href={`/destinations/${country.slug}`}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line px-4 py-2 text-[12.5px] font-medium text-ink-soft transition-colors hover:border-brand hover:bg-brand-tint/50 hover:text-ink"
          >
            Save &amp; exit
            <IconX size={14} stroke={1.8} />
          </Link>
        </header>

        {/* The stepper remains visible while form fields are scrolled. */}
        <nav aria-label="Application steps" className="shrink-0 border-b border-line bg-ground px-4 py-3 md:px-8 xl:px-10">
          <ol className="flex items-center gap-2">
            {STEPS.map((label, index) => {
              const state = index < step ? "done" : index === step ? "current" : "todo";
              return (
                <li key={label} className="flex min-w-0 flex-1 items-center gap-2">
                  <span
                    className={`numeric grid size-7 shrink-0 place-items-center rounded-full text-[11px] font-semibold transition-colors duration-300 ${
                      state === "done"
                        ? "bg-brand text-brand-ink"
                        : state === "current"
                          ? "bg-brand-tint text-brand-strong ring-1 ring-brand"
                          : "border border-line text-ink-soft"
                    }`}
                  >
                    {state === "done" ? (
                      <IconCircleCheck size={15} stroke={2.2} />
                    ) : (
                      String(index + 1).padStart(2, "0")
                    )}
                  </span>
                  <span
                    className={`hidden truncate text-[12.5px] sm:block ${
                      state === "current" ? "font-semibold text-ink" : "text-ink-soft"
                    }`}
                  >
                    {label}
                  </span>
                  {index < STEPS.length - 1 ? (
                    <span className="relative mx-1 h-px flex-1 overflow-hidden rounded-full bg-line">
                      <span
                        className="absolute inset-y-0 left-0 bg-brand transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        style={{ width: index < step ? "100%" : "0%" }}
                      />
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </nav>

        <main
          data-lenis-prevent
          className="application-form-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-4 py-5 md:px-8 xl:overflow-y-hidden xl:px-10 xl:py-5"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              {step === 0 ? (
                <TripStep
                  country={country}
                  dates={dates}
                  setDates={setDates}
                  earliest={earliest}
                />
              ) : step === 1 ? (
                activeTraveler ? (
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
                ) : (
                  <TravelerRoster
                    travelers={travelers}
                    onSelect={selectTraveler}
                    onAdd={addTraveler}
                    onRemove={removeTraveler}
                    isComplete={isTravelerComplete}
                  />
                )
              ) : step === 2 ? (
                <DocumentsStep
                  country={country}
                  uploads={uploads}
                  setUploads={setUploads}
                  skipped={skipped}
                  setSkipped={setSkipped}
                />
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

        <footer className="flex h-[76px] shrink-0 items-center justify-between border-t border-line bg-ground px-4 md:px-8 xl:px-10">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 0 && !activeTravelerId}
            className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-5 py-2.5 text-[13.5px] font-medium text-ink transition-all duration-200 hover:border-brand hover:bg-brand-tint/50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:bg-surface"
          >
            <IconArrowLeft size={15} stroke={1.8} />
            Back
          </button>

          <div className="flex items-center gap-4">
            {step === STEPS.length - 1 ? (
              <p className="hidden text-[12px] text-ink-soft sm:block">
                Refundable if denied
              </p>
            ) : null}
            <button
              type="button"
              onClick={handleContinue}
              disabled={!canContinue}
              className="btn-gold inline-flex items-center gap-2 rounded-lg px-7 py-3 text-[13.5px] font-semibold text-brand-ink transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-[#b0966f] hover:shadow-[0_14px_28px_-16px_rgba(31,26,21,0.7)] active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {step === STEPS.length - 1 ? (
                <>
                  <IconLock size={15} stroke={1.8} />
                  Pay {total === null ? "securely" : `$${total}`}
                </>
              ) : step === 1 && activeTraveler ? (
                <>
                  Save traveler
                  <IconArrowRight size={15} stroke={1.8} />
                </>
              ) : (
                <>
                  Continue
                  <IconArrowRight size={15} stroke={1.8} />
                </>
              )}
            </button>
          </div>
        </footer>
      </section>

      <ApplicationGuide
        country={country}
        step={step}
        earliest={earliest}
        deliverBy={deliverBy}
        total={total}
        travelerCount={travelers.length}
        activeTravelerNumber={
          activeTraveler ? travelers.findIndex(({ id }) => id === activeTraveler.id) + 1 : null
        }
        reduce={reduce}
      />
    </div>
  );
}

function ApplicationGuide({
  country,
  step,
  earliest,
  deliverBy,
  total,
  travelerCount,
  activeTravelerNumber,
  reduce,
}: {
  country: Country;
  step: number;
  earliest: Date;
  deliverBy: Date | null;
  total: number | null;
  travelerCount: number;
  activeTravelerNumber: number | null;
  reduce: boolean | null;
}) {
  const panels = [
    {
      icon: IconRoute,
      title: "Set the rhythm for your trip.",
      copy: `Choose dates that leave enough time for ${country.processing} processing. We will keep the rest of the application aligned to your travel window.`,
      facts: [
        { label: "Processing", value: country.processing },
        { label: "Earliest travel", value: longDate.format(earliest) },
      ],
    },
    {
      icon: IconScan,
      title: activeTravelerNumber
        ? `Complete traveler ${activeTravelerNumber}'s passport profile.`
        : "One clear form for every traveler.",
      copy: activeTravelerNumber
        ? "Choose marital status, scan the passport if you wish, and confirm the details in one place before saving."
        : "Add everyone who is travelling, then complete one short passport form at a time. You can return to any traveller before continuing.",
      facts: [
        {
          label: activeTravelerNumber ? "Traveler" : "In this application",
          value: activeTravelerNumber ? `${activeTravelerNumber} of ${travelerCount}` : `${travelerCount} traveler${travelerCount === 1 ? "" : "s"}`,
        },
        { label: "Secure scan", value: "AES-256 encrypted" },
      ],
    },
    {
      icon: IconFileText,
      title: "Gather only what is needed.",
      copy: `This application needs ${country.documents.length} documents. Upload what you have now and add anything else later from your application page.`,
      facts: [
        { label: "Required now", value: `${country.documents.length} documents` },
        { label: "Accepted files", value: "JPG, PNG or PDF" },
      ],
    },
    {
      icon: IconLock,
      title: "One final check, then you are set.",
      copy: "Review the details you provided before we prepare your application for submission. Payment is protected and your visa is delivered by email.",
      facts: [
        { label: "Delivery", value: deliverBy ? shortDate.format(deliverBy) : country.processing },
        { label: "Total", value: total === null ? "At checkout" : `$${total}` },
      ],
    },
  ] as const;
  const panel = panels[step] ?? panels[0];
  const GuideIcon = panel.icon;

  return (
    <aside className="relative hidden min-w-0 overflow-hidden bg-ink xl:flex xl:flex-col">
      <Image
        src={country.image}
        alt={`A view of ${country.name}`}
        fill
        priority
        sizes="35vw"
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: `scale(${step === 0 ? 1.04 : 1.09})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#12100d]/95 via-[#12100d]/58 to-[#12100d]/30" />

      <div className="relative z-10 flex h-full flex-col justify-between p-7 2xl:p-10">
        <div className="flex items-start justify-between gap-3">
          <Logo tone="light" className="-ml-1 w-fit" />
          <span className="numeric rounded-full border border-white/20 bg-[#12100d]/25 px-3 py-1.5 text-[11px] font-semibold tracking-[0.12em] text-white/80 uppercase">
            Step {step + 1} of {STEPS.length}
          </span>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={reduce ? false : { opacity: 0, y: 16, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={reduce ? undefined : { opacity: 0, y: -10, filter: "blur(3px)" }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="w-full min-w-0 max-w-[25rem]"
          >
            <span className="mb-5 grid size-11 place-items-center rounded-full border border-white/25 bg-white/10 text-brand">
              <GuideIcon size={21} stroke={1.7} />
            </span>
            <h2 className="max-w-[10ch] break-words text-balance font-heading text-[2.05rem] leading-[1.04] text-white 2xl:text-[2.45rem]">
              {panel.title}
            </h2>
            <p className="mt-4 max-w-[36ch] text-[13.5px] leading-relaxed text-white/76">{panel.copy}</p>

            <dl className="mt-7 grid max-w-[24rem] gap-y-3">
              {panel.facts.map((fact) => (
                <div key={fact.label} className="min-w-0 border-t border-white/25 pt-3">
                  <dt className="text-[11px] font-medium tracking-[0.1em] text-white/58 uppercase">
                    {fact.label}
                  </dt>
                  <dd className="numeric mt-1 break-words text-[13px] font-semibold text-white">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-3 text-[12px] text-white/68">
          <span className="relative block size-8 shrink-0 overflow-hidden rounded-full ring-1 ring-white/45">
            <Image src={flagSrc(country.iso2)} alt="" fill sizes="32px" className="object-cover" />
          </span>
          <span className="numeric flex items-center gap-2 font-medium tracking-[0.12em] uppercase">
            United States <IconArrowRight size={13} stroke={2} /> {country.name}
          </span>
        </div>
      </div>
    </aside>
  );
}

/* ---------------------------------- steps ----------------------------------- */

function StepHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-5">
      <h1 className="font-heading text-[1.7rem] leading-none text-ink md:text-[2rem]">{title}</h1>
      <p className="mt-1.5 max-w-[72ch] text-[13.5px] leading-relaxed text-ink-soft">{subtitle}</p>
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
  const departure = dates?.from ? shortDate.format(dates.from) : "Select date";
  const returnDate = dates?.to ? shortDate.format(dates.to) : "Select date";
  const nights =
    dates?.from && dates?.to
      ? Math.max(0, Math.round((dates.to.getTime() - dates.from.getTime()) / 86_400_000))
      : null;

  return (
    <section className="mx-auto w-full max-w-[72rem]">
      <StepHeading
        title="When are you traveling?"
        subtitle={`Pick your dates. Earliest travel date is ${longDate.format(earliest)}, since the visa takes ${country.processing} to process.`}
      />

      <div className="overflow-hidden rounded-2xl border border-brand/30 bg-surface shadow-[0_22px_50px_-36px_rgba(31,26,21,0.48)]">
        <div className="border-b border-line bg-paper/55 px-4 py-3.5 sm:px-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[14px] font-semibold text-ink">Choose your travel window</h2>
              <p className="mt-0.5 text-[12px] text-ink-soft">Select your departure first, then your return date.</p>
            </div>
            <span className="hidden shrink-0 rounded-full border border-brand/35 bg-surface px-3 py-1.5 text-[11px] font-semibold text-brand-strong sm:block">
              {country.processing} processing
            </span>
          </div>
          <div className="mt-3 grid max-w-xl grid-cols-[1fr_auto_1fr] items-center rounded-xl border border-line/80 bg-surface/85 px-3 py-2.5 shadow-[0_8px_18px_-18px_rgba(31,26,21,0.7)]">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.14em] text-ink-soft uppercase">Departure</p>
              <p className={`numeric mt-0.5 text-[13px] font-semibold ${dates?.from ? "text-ink" : "text-ink-soft"}`}>{departure}</p>
            </div>
            <div className="mx-3 flex size-7 items-center justify-center rounded-full border border-brand/30 bg-brand-tint text-brand-strong" aria-hidden="true">
              <IconArrowRight size={14} stroke={1.8} />
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold tracking-[0.14em] text-ink-soft uppercase">Return</p>
              <p className={`numeric mt-0.5 text-[13px] font-semibold ${dates?.to ? "text-ink" : "text-ink-soft"}`}>{returnDate}</p>
            </div>
          </div>
        </div>
        <Calendar
          mode="range"
          numberOfMonths={2}
          showOutsideDays={false}
          selected={dates}
          onSelect={setDates}
          disabled={{ before: earliest }}
          className="mx-auto w-full bg-transparent px-2 py-3 [--cell-radius:0.75rem] [--cell-size:1.9rem] sm:px-5 sm:[--cell-size:2.15rem]"
          dayButtonClassName="rounded-xl text-[13px] font-medium text-ink transition-[transform,background-color,box-shadow] duration-200 ease-out hover:scale-[1.06] hover:bg-brand-tint hover:text-brand-strong focus-visible:ring-brand/45 data-[selected-single=true]:bg-brand data-[selected-single=true]:text-brand-ink data-[selected-single=true]:shadow-[0_5px_12px_-8px_rgba(126,91,44,0.95)] data-[range-start=true]:rounded-l-xl data-[range-start=true]:bg-brand data-[range-start=true]:text-brand-ink data-[range-start=true]:shadow-[0_5px_12px_-8px_rgba(126,91,44,0.95)] data-[range-end=true]:rounded-r-xl data-[range-end=true]:bg-brand data-[range-end=true]:text-brand-ink data-[range-end=true]:shadow-[0_5px_12px_-8px_rgba(126,91,44,0.95)] data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-brand-tint data-[range-middle=true]:text-ink data-[range-middle=true]:hover:scale-100 data-[range-middle=true]:hover:bg-brand-tint"
          classNames={{
            months: "relative mx-auto flex w-full max-w-[44rem] flex-col justify-center gap-6 md:flex-row",
            month: "flex min-w-0 w-full max-w-[21rem] flex-1 flex-col gap-2.5",
            nav: "absolute inset-x-0 top-0 z-20 flex h-(--cell-size) items-center justify-between pointer-events-none md:left-1/2 md:right-auto md:w-auto md:-translate-x-1/2 md:justify-center md:gap-1",
            button_previous: "pointer-events-auto grid size-7 place-items-center rounded-full border border-line bg-surface text-ink transition-all duration-200 hover:scale-105 hover:border-brand/45 hover:bg-brand-tint hover:text-brand-strong",
            button_next: "pointer-events-auto grid size-7 place-items-center rounded-full border border-line bg-surface text-ink transition-all duration-200 hover:scale-105 hover:border-brand/45 hover:bg-brand-tint hover:text-brand-strong",
            month_caption: "flex h-(--cell-size) w-full items-center justify-center px-2",
            caption_label: "font-semibold text-[13px] text-ink",
            week: "mt-1 flex w-full",
            weekday: "flex-1 text-[10px] font-semibold tracking-[0.08em] text-ink-soft uppercase select-none",
            range_start: "relative isolate z-0 rounded-l-xl bg-brand-tint after:hidden",
            range_middle: "rounded-none bg-brand-tint",
            range_end: "relative isolate z-0 rounded-r-xl bg-brand-tint after:hidden",
            today: "rounded-xl bg-brand-tint/55 text-brand-strong data-[selected=true]:bg-brand-tint",
            disabled: "text-ink-soft/35 opacity-100",
          }}
        />
        <div className="flex items-center justify-between border-t border-line bg-paper/35 px-4 py-3">
          <p className="numeric text-[12.5px] font-medium text-ink-soft">
            {dates?.from
              ? dates.to
                ? `${shortDate.format(dates.from)} to ${shortDate.format(dates.to)} · ${nights} ${nights === 1 ? "night" : "nights"}`
                : "Your departure is selected — now choose a return date."
              : "Choose a departure and return date to continue."}
          </p>
          {dates?.from && (
            <button
              type="button"
              onClick={() => setDates(undefined)}
              className="text-[13px] font-medium text-ink-soft transition-colors hover:text-brand-strong"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function TravelerRoster({
  travelers,
  onSelect,
  onAdd,
  onRemove,
  isComplete,
}: {
  travelers: TravelerProfile[];
  onSelect: (id: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  isComplete: (traveler: TravelerProfile) => boolean;
}) {
  return (
    <section className="mx-auto w-full max-w-[72rem]">
      <StepHeading
        title="Who is traveling?"
        subtitle="Add everyone in this application, then complete each passport profile one at a time."
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
                    {complete ? "Details complete" : "Details not started"}
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
    <section className="mx-auto w-full max-w-[72rem]">
      <StepHeading
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

function DocumentsStep({
  country,
  uploads,
  setUploads,
  skipped,
  setSkipped,
}: {
  country: Country;
  uploads: Record<string, string>;
  setUploads: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  skipped: Set<string>;
  setSkipped: React.Dispatch<React.SetStateAction<Set<string>>>;
}) {
  const uploadedCount = Object.keys(uploads).length;

  return (
    <section className="mx-auto w-full max-w-[72rem]">
      <StepHeading
        title="Upload your documents"
        subtitle={`${country.documents.length} items for this corridor. Skip any of them and add them later from your application page.`}
      />

      <p className="numeric mb-3 text-[12.5px] text-ink-soft" aria-live="polite">
        {uploadedCount} of {country.documents.length} uploaded
      </p>

      <div className="grid gap-2.5 xl:grid-cols-3">
        {country.documents.map((document) => {
          const uploaded = uploads[document.name];
          const isSkipped = skipped.has(document.name);

          return (
            <div
              key={document.name}
              className={`flex flex-wrap items-center gap-3 rounded-2xl border p-3.5 transition-colors duration-300 ${
                uploaded
                  ? "border-positive/40 bg-positive/5"
                  : isSkipped
                    ? "border-line bg-surface opacity-60"
                    : "border-line bg-surface"
              }`}
            >
              <span
                className={`grid size-11 shrink-0 place-items-center rounded-xl ${
                  uploaded ? "bg-positive text-white" : "bg-brand-tint text-brand-strong"
                }`}
              >
                {uploaded ? (
                  <IconCircleCheck size={20} stroke={1.8} />
                ) : (
                  <IconCloudUpload size={20} stroke={1.6} />
                )}
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-ink">{document.name}</p>
                <p className="mt-0.5 truncate text-[12px] text-ink-soft">
                  {uploaded ?? `${document.hint} · JPG, PNG or PDF up to 10 MB`}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <label className="cursor-pointer rounded-lg border border-line bg-surface px-4 py-2 text-[12.5px] font-semibold text-ink transition-colors hover:border-brand hover:bg-brand-tint/50">
                  {uploaded ? "Replace" : "Upload"}
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      setUploads((current) => ({ ...current, [document.name]: file.name }));
                      setSkipped((current) => {
                        const next = new Set(current);
                        next.delete(document.name);
                        return next;
                      });
                    }}
                  />
                </label>
                {!uploaded ? (
                  <button
                    type="button"
                    onClick={() =>
                      setSkipped((current) => {
                        const next = new Set(current);
                        if (next.has(document.name)) next.delete(document.name);
                        else next.add(document.name);
                        return next;
                      })
                    }
                    className={`text-[12.5px] font-medium underline-offset-4 transition-colors hover:underline ${
                      isSkipped ? "text-brand-strong" : "text-ink-soft"
                    }`}
                  >
                    {isSkipped ? "Skipped" : "Skip"}
                  </button>
                ) : null}
              </div>
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
  const missing = country.documents.filter((document) => !uploads[document.name]);

  return (
    <section className="mx-auto w-full max-w-[72rem]">
      <StepHeading title="Review and pay" subtitle="One last look before we file." />

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
                    ? `${shortDate.format(dates.from)}${dates.to ? ` to ${shortDate.format(dates.to)}` : ""}`
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
              <EditButton onClick={() => onEdit(2)} />
            </div>
            <ul className="mt-2 grid gap-1">
              {country.documents.map((document) => {
                const uploaded = uploads[document.name];
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
            {missing.length > 0 ? (
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

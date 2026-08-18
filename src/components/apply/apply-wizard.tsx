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
  IconLoader2,
  IconLock,
  IconPencil,
  IconScan,
  IconShieldCheck,
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

const MARITAL_OPTIONS = ["Single", "Married", "Divorced", "Widowed"] as const;
const DIAL_CODES = ["+1", "+44", "+91", "+971", "+65", "+61", "+49"];

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
  email: string;
  dialCode: string;
  phone: string;
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
  email: "",
  dialCode: "+1",
  phone: "",
};

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
  "h-11 w-full rounded-lg border-line bg-surface px-3.5 text-[14px] text-ink shadow-none transition-[border-color,box-shadow] duration-200 placeholder:text-ink-soft/70 hover:border-brand focus-visible:border-brand-strong focus-visible:ring-0 focus-visible:shadow-[0_0_0_1px_var(--brand-strong)] focus-visible:outline-none";

const selectFieldClass =
  "h-11 w-full rounded-lg border-line bg-surface px-3.5 text-[14px] text-ink shadow-none transition-[border-color,box-shadow] duration-200 hover:border-brand focus-visible:border-brand-strong focus-visible:ring-0 focus-visible:shadow-[0_0_0_1px_var(--brand-strong)] focus-visible:outline-none data-[placeholder]:text-ink-soft/70";

/* ---------------------------------- shell ---------------------------------- */

export function ApplyWizard({ country }: { country: Country }) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [dates, setDates] = useState<DateRange | undefined>();
  const [marital, setMarital] = useState<string | null>(null);
  const [scanState, setScanState] = useState<"idle" | "scanning" | "done">("idle");
  const [traveler, setTraveler] = useState<Traveler>(EMPTY_TRAVELER);
  const [uploads, setUploads] = useState<Record<string, string>>({});
  const [skipped, setSkipped] = useState<Set<string>>(new Set());

  const total = totalFee(country);

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

  const canContinue =
    step === 0
      ? Boolean(dates?.from)
      : step === 1
        ? Boolean(traveler.firstName && traveler.lastName && traveler.email && marital)
        : true;

  function startScan() {
    if (scanState === "scanning") return;
    setScanState("scanning");
    setTimeout(() => {
      setTraveler((current) => ({ ...current, ...SCANNED }));
      setScanState("done");
    }, 2000);
  }

  const setField = (field: keyof Traveler) => (value: string) =>
    setTraveler((current) => ({ ...current, [field]: value }));

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-ground">
      {/* Corridor rail: the country photograph carries the summary, like the auth pages. */}
      <aside className="relative hidden w-[24rem] shrink-0 overflow-hidden lg:flex lg:flex-col xl:w-[27rem]">
        <Image
          src={country.image}
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="27rem"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12100d]/94 via-[#12100d]/55 to-[#12100d]/35" />

        <div className="relative flex flex-1 flex-col justify-between p-8">
          <Logo tone="light" className="-ml-1 w-fit" />

          <div>
            <p className="numeric flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-white/70 uppercase">
              United States
              <IconArrowRight size={13} stroke={2} />
              {country.name}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <span className="relative block size-10 overflow-hidden rounded-full ring-2 ring-white/70">
                <Image src={flagSrc(country.iso2)} alt="" fill sizes="40px" className="object-cover" />
              </span>
              <h2 className="font-heading text-[1.9rem] leading-tight text-white">
                {country.name}
              </h2>
            </div>

            <dl className="mt-6 overflow-hidden rounded-2xl border border-white/15 bg-[#12100d]/45 backdrop-blur-xl">
              {[
                { label: "Processing", value: country.processing },
                { label: "Documents", value: `${country.documents.length} required` },
                {
                  label: "Government fee",
                  value: country.govFee === null ? "At checkout" : `$${country.govFee}`,
                },
                { label: "Service fee", value: `$${country.serviceFee ?? 0}` },
                { label: "Get it by", value: deliverBy ? shortDate.format(deliverBy) : "Pick dates" },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between border-t border-white/10 px-5 py-3.5 first:border-t-0"
                >
                  <dt className="text-[12.5px] text-white/65">{row.label}</dt>
                  <dd className="numeric text-[13px] font-semibold text-white">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex flex-wrap gap-2">
            {["AES-256 encrypted", "GDPR", "Stripe payments"].map((chip) => (
              <span
                key={chip}
                className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-medium text-white/85 backdrop-blur-md"
              >
                <IconShieldCheck size={12} stroke={1.8} className="text-brand" />
                {chip}
              </span>
            ))}
          </div>
        </div>
      </aside>

      {/* Content column */}
      <div className="flex h-full min-w-0 flex-1 flex-col">
        {/* Minimal header */}
        <header className="flex h-[68px] shrink-0 items-center justify-between px-4 md:px-10">
          <div className="lg:hidden">
            <Logo className="-ml-1 w-fit" />
          </div>
          <p className="numeric hidden text-[11px] tracking-[0.18em] text-ink-soft uppercase lg:block">
            {country.name} visa application
          </p>
          <Link
            href={`/destinations/${country.slug}`}
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-[12.5px] font-medium text-ink-soft transition-colors hover:border-brand hover:bg-brand-tint/50 hover:text-ink"
          >
            Save &amp; exit
            <IconX size={14} stroke={1.8} />
          </Link>
        </header>

        {/* Gold stepper */}
        <nav aria-label="Application steps" className="px-4 md:px-10">
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

        {/* Step body */}
        <main data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-8 md:px-10">
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
                  deliverBy={deliverBy}
                />
              ) : step === 1 ? (
                <TravelerStep
                  traveler={traveler}
                  setField={setField}
                  marital={marital}
                  setMarital={setMarital}
                  scanState={scanState}
                  startScan={startScan}
                />
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
                  marital={marital}
                  traveler={traveler}
                  uploads={uploads}
                  onEdit={(target) => setStep(target)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Step controls */}
        <footer className="flex h-[84px] shrink-0 items-center justify-between border-t border-line px-4 md:px-10">
          <button
            type="button"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
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
              onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}
              disabled={!canContinue}
              className="btn-gold inline-flex items-center gap-2 rounded-lg px-7 py-3 text-[13.5px] font-semibold text-brand-ink transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-[#b0966f] hover:shadow-[0_14px_28px_-16px_rgba(31,26,21,0.7)] active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {step === STEPS.length - 1 ? (
                <>
                  <IconLock size={15} stroke={1.8} />
                  Pay {total === null ? "securely" : `$${total}`}
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
      </div>
    </div>
  );
}

/* ---------------------------------- steps ----------------------------------- */

function StepHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-7">
      <h1 className="font-heading text-[1.8rem] text-ink md:text-[2.1rem]">{title}</h1>
      <p className="mt-1.5 text-[14px] text-ink-soft">{subtitle}</p>
    </div>
  );
}

function TripStep({
  country,
  dates,
  setDates,
  earliest,
  deliverBy,
}: {
  country: Country;
  dates: DateRange | undefined;
  setDates: (range: DateRange | undefined) => void;
  earliest: Date;
  deliverBy: Date | null;
}) {
  return (
    <section>
      <StepHeading
        title="When are you traveling?"
        subtitle={`Pick your dates. Earliest travel date is ${longDate.format(earliest)}, since the visa takes ${country.processing} to process.`}
      />

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,38rem)_1fr]">
      <div className="rounded-2xl border border-line bg-surface p-4 shadow-[0_22px_50px_-36px_rgba(31,26,21,0.45)]">
        <Calendar
          mode="range"
          numberOfMonths={2}
          selected={dates}
          onSelect={setDates}
          disabled={{ before: earliest }}
          className="mx-auto w-full [--cell-size:2.3rem]"
        />
        <div className="flex items-center justify-between border-t border-line px-3 pt-3 pb-1">
          <p className="numeric text-[12.5px] text-ink-soft">
            {dates?.from
              ? `${shortDate.format(dates.from)}${dates.to ? ` to ${shortDate.format(dates.to)}` : ""}`
              : "No dates selected"}
          </p>
          <button
            type="button"
            onClick={() => setDates(undefined)}
            className="text-[13px] font-medium text-ink-soft transition-colors hover:text-brand-strong"
          >
            Clear
          </button>
        </div>
      </div>

      <div
        className={`flex items-center justify-between gap-6 rounded-2xl border px-6 py-5 transition-colors duration-500 ${
          deliverBy ? "border-brand/50 bg-brand-tint/50" : "border-dashed border-line bg-surface"
        }`}
      >
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] text-brand-strong uppercase">
            Our promise
          </p>
          <p className="mt-0.5 max-w-[30ch] text-[13.5px] text-ink-soft">
            Visa in your inbox before you fly, or the fee comes back.
          </p>
        </div>
        <p
          className={`numeric font-heading text-[1.6rem] transition-colors duration-500 ${
            deliverBy ? "text-ink" : "text-ink-soft/50"
          }`}
        >
          {deliverBy ? shortDate.format(deliverBy) : "Pick dates"}
        </p>
      </div>
      </div>
    </section>
  );
}

function TravelerStep({
  traveler,
  setField,
  marital,
  setMarital,
  scanState,
  startScan,
}: {
  traveler: Traveler;
  setField: (field: keyof Traveler) => (value: string) => void;
  marital: string | null;
  setMarital: (value: string) => void;
  scanState: "idle" | "scanning" | "done";
  startScan: () => void;
}) {
  const filled = scanState === "done";

  return (
    <section>
      <StepHeading title="Who is traveling?" subtitle="Scan your passport and we fill the form for you." />

      {/* Scan strip: one compact action instead of a full screen. */}
      <button
        type="button"
        onClick={startScan}
        disabled={scanState === "scanning"}
        className={`flex w-full items-center gap-4 rounded-2xl border-2 border-dashed p-5 text-left transition-colors duration-300 ${
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

      {/* Marital status as a segmented row, not four giant cards. */}
      <div className="mt-7 grid gap-2">
        <Label className="text-[13px] font-semibold">Marital status</Label>
        <div
          role="radiogroup"
          aria-label="Marital status"
          className="grid max-w-[34rem] grid-cols-2 gap-2 sm:grid-cols-4"
        >
          {MARITAL_OPTIONS.map((option) => {
            const selected = marital === option;
            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setMarital(option)}
                className={`rounded-lg border px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                  selected
                    ? "border-brand bg-brand-tint text-ink shadow-[inset_0_0_0_1px_var(--brand)]"
                    : "border-line bg-surface text-ink-soft hover:border-brand hover:text-ink"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="grid gap-2">
          <Label className="text-[13px] font-semibold">First name</Label>
          <Input
            value={traveler.firstName}
            onChange={(e) => setField("firstName")(e.target.value)}
            placeholder="First name"
            autoComplete="given-name"
            className={fieldClass}
          />
        </div>
        <div className="grid gap-2">
          <Label className="text-[13px] font-semibold">Last name</Label>
          <Input
            value={traveler.lastName}
            onChange={(e) => setField("lastName")(e.target.value)}
            placeholder="Last name"
            autoComplete="family-name"
            className={fieldClass}
          />
        </div>
        <div className="grid gap-2">
          <Label className="text-[13px] font-semibold">Date of birth</Label>
          <Input
            type="date"
            value={traveler.dateOfBirth}
            onChange={(e) => setField("dateOfBirth")(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div className="grid gap-2">
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
        <div className="grid gap-2">
          <Label className="text-[13px] font-semibold">Passport number</Label>
          <Input
            value={traveler.passportNumber}
            onChange={(e) => setField("passportNumber")(e.target.value)}
            placeholder="Passport number"
            className={`${fieldClass} numeric`}
          />
        </div>
        <div className="grid gap-2">
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
        <div className="grid gap-2">
          <Label className="text-[13px] font-semibold">Passport issued on</Label>
          <Input
            type="date"
            value={traveler.issuedOn}
            onChange={(e) => setField("issuedOn")(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div className="grid gap-2">
          <Label className="text-[13px] font-semibold">Passport valid till</Label>
          <Input
            type="date"
            value={traveler.validTill}
            onChange={(e) => setField("validTill")(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div className="grid gap-2">
          <Label className="text-[13px] font-semibold">Passport place of issue</Label>
          <Input
            value={traveler.placeOfIssue}
            onChange={(e) => setField("placeOfIssue")(e.target.value)}
            placeholder="Passport place of issue"
            className={fieldClass}
          />
        </div>
        <div className="grid gap-2">
          <Label className="text-[13px] font-semibold">Email</Label>
          <Input
            type="email"
            value={traveler.email}
            onChange={(e) => setField("email")(e.target.value)}
            placeholder="Primary email"
            autoComplete="email"
            className={fieldClass}
          />
        </div>
        <div className="grid gap-2">
          <Label className="text-[13px] font-semibold">Phone number</Label>
          <div className="flex gap-2">
            <Select value={traveler.dialCode} onValueChange={setField("dialCode")}>
              <SelectTrigger aria-label="Dial code" className={`${selectFieldClass} w-22 shrink-0`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="min-w-22 rounded-xl border-line bg-surface">
                {DIAL_CODES.map((code) => (
                  <SelectItem key={code} value={code}>
                    {code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="tel"
              value={traveler.phone}
              onChange={(e) => setField("phone")(e.target.value)}
              placeholder="Phone number"
              autoComplete="tel-national"
              className={fieldClass}
            />
          </div>
        </div>
      </div>
      <p className="mt-3 text-[12px] text-ink-soft">
        We use your phone number for essential visa updates in real time.
      </p>
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
    <section>
      <StepHeading
        title="Upload your documents"
        subtitle={`${country.documents.length} items for this corridor. Skip any of them and add them later from your application page.`}
      />

      <p className="numeric mb-4 text-[12.5px] text-ink-soft" aria-live="polite">
        {uploadedCount} of {country.documents.length} uploaded
      </p>

      <div className="grid gap-3 xl:grid-cols-2">
        {country.documents.map((document) => {
          const uploaded = uploads[document.name];
          const isSkipped = skipped.has(document.name);

          return (
            <div
              key={document.name}
              className={`flex flex-wrap items-center gap-4 rounded-2xl border p-4 transition-colors duration-300 ${
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
  marital,
  traveler,
  uploads,
  onEdit,
}: {
  country: Country;
  dates: DateRange | undefined;
  marital: string | null;
  traveler: Traveler;
  uploads: Record<string, string>;
  onEdit: (step: number) => void;
}) {
  const total = totalFee(country);
  const missing = country.documents.filter((document) => !uploads[document.name]);

  return (
    <section>
      <StepHeading title="Review and pay" subtitle="One last look before we file." />

      <div className="grid items-start gap-4 lg:grid-cols-2 xl:grid-cols-[1fr_1.15fr_1fr]">
        {/* Column 1: trip + documents */}
        <div className="grid gap-4">
          <div className="rounded-2xl border border-line bg-surface p-5">
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

          <div className="rounded-2xl border border-line bg-surface p-5">
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

        {/* Column 2: traveler */}
        <div className="rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-semibold tracking-[0.18em] text-brand-strong uppercase">
              Traveler
            </h2>
            <EditButton onClick={() => onEdit(1)} />
          </div>
          <dl className="mt-1 divide-y divide-line/70">
            <ReviewRow label="Name" value={`${traveler.firstName} ${traveler.lastName}`.trim()} />
            <ReviewRow label="Date of birth" value={traveler.dateOfBirth} />
            <ReviewRow label="Gender" value={traveler.gender} />
            <ReviewRow label="Marital status" value={marital ?? ""} />
            <ReviewRow label="Passport number" value={traveler.passportNumber} />
            <ReviewRow label="Valid till" value={traveler.validTill} />
            <ReviewRow label="Email" value={traveler.email} />
            <ReviewRow
              label="Phone"
              value={traveler.phone ? `${traveler.dialCode} ${traveler.phone}` : ""}
            />
          </dl>
        </div>

        {/* Column 3: payment, always in view */}
        <div className="overflow-hidden rounded-2xl border border-line bg-paper lg:col-span-2 xl:col-span-1">
          <div
            aria-hidden="true"
            className="h-px bg-gradient-to-r from-transparent via-brand to-transparent"
          />
          <div className="p-5">
            <h2 className="text-[11px] font-semibold tracking-[0.18em] text-brand-strong uppercase">
              Payment
            </h2>
            <dl className="mt-1 divide-y divide-line/70">
              <ReviewRow
                label="Government fee"
                value={country.govFee === null ? "At checkout" : `$${country.govFee}`}
              />
              <ReviewRow label="Service fee" value={`$${country.serviceFee ?? 0}`} />
            </dl>
            <div className="mt-2 flex items-baseline justify-between border-t border-line pt-4">
              <p className="text-[14px] font-semibold text-ink">Total</p>
              <p className="numeric font-heading text-[2rem] text-ink">
                {total === null ? "At checkout" : `$${total}`}
              </p>
            </div>

            <ul className="mt-4 grid gap-2 border-t border-line pt-4">
              {[
                "Refundable if your visa is denied",
                `Delivered by email in ${country.processing}`,
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

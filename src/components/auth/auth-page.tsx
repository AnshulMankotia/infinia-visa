"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";
import { FaApple, FaFacebook } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import {
  IconEye,
  IconEyeOff,
  IconLock,
  IconMail,
  IconPhone,
  IconUser,
  type IconProps,
} from "@tabler/icons-react";
import { Logo } from "@/components/layout/logo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Rise } from "@/components/ui/reveal";
import { NATIONALITIES, REVIEWS } from "@/data/site";

type Mode = "signin" | "signup";

const COPY: Record<Mode, {
  title: string;
  subtitle: string;
  submit: string;
  switchPrompt: string;
  switchCta: string;
  switchHref: string;
  /** Right panel: airplane photography, a different frame per page. */
  panelImage: string;
  panelAlt: string;
}> = {
  signin: {
    title: "Welcome back!",
    subtitle:
      "Pick up where you left off. Track applications, manage documents, and file your next visa in minutes.",
    submit: "Sign in",
    switchPrompt: "New to Infinia Visa?",
    switchCta: "Create an account",
    switchHref: "/signup",
    panelImage:
      "https://images.unsplash.com/photo-1529947327457-8f5cb53bc1b6?w=1600&q=80&auto=format&fit=crop",
    panelAlt: "Airliner climbing above a clear sky",
  },
  signup: {
    title: "Create your account",
    subtitle: "Start processing visas in minutes.",
    submit: "Create account",
    switchPrompt: "Already have an account?",
    switchCta: "Sign in",
    switchHref: "/login",
    panelImage:
      "https://images.unsplash.com/photo-1732091562152-225151ce292f?w=1600&q=80&auto=format&fit=crop",
    panelAlt: "Aircraft wing over the ocean at altitude",
  },
};

const SOCIALS: {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
}[] = [
  { name: "Google", icon: FcGoogle, iconClass: "" },
  { name: "Facebook", icon: FaFacebook, iconClass: "text-[#1877F2]" },
  { name: "Apple", icon: FaApple, iconClass: "text-ink" },
];

const DIAL_CODES = [
  { code: "+1", label: "US" },
  { code: "+44", label: "GB" },
  { code: "+91", label: "IN" },
  { code: "+971", label: "AE" },
  { code: "+65", label: "SG" },
  { code: "+61", label: "AU" },
  { code: "+49", label: "DE" },
];

const QUOTE = REVIEWS[0];

const inputClass =
  "h-11 w-full rounded-lg border-line bg-surface text-[14px] text-ink shadow-none transition-[border-color,box-shadow] duration-200 placeholder:text-ink-soft/70 hover:border-brand focus-visible:border-brand-strong focus-visible:ring-0 focus-visible:shadow-[0_0_0_1px_var(--brand-strong)] focus-visible:outline-none";

const selectClass =
  "h-11 w-full rounded-lg border-line bg-surface px-3.5 text-[14px] text-ink shadow-none transition-[border-color,box-shadow] duration-200 hover:border-brand focus-visible:border-brand-strong focus-visible:ring-0 focus-visible:shadow-[0_0_0_1px_var(--brand-strong)] focus-visible:outline-none data-[placeholder]:text-ink-soft/70";

function Field({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<IconProps>;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <Icon
        size={16}
        stroke={1.7}
        className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-soft"
      />
      {children}
    </div>
  );
}

export function AuthPage({ mode }: { mode: Mode }) {
  const copy = COPY[mode];
  const ids = useId();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Demo build: validates locally, no auth backend is wired up yet.
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mode !== "signup") return;
    const data = new FormData(event.currentTarget);
    if (data.get("password") !== data.get("confirmPassword")) {
      setError("Passwords do not match.");
      return;
    }
    if (!data.get("terms")) {
      setError("Please agree to the Terms of Service to continue.");
      return;
    }
    setError(null);
  }

  const passwordToggle = (shown: boolean, toggle: () => void) => (
    <button
      type="button"
      onClick={toggle}
      aria-label={shown ? "Hide password" : "Show password"}
      className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-ink-soft transition-colors hover:bg-brand-tint hover:text-ink"
    >
      {shown ? <IconEyeOff size={16} stroke={1.7} /> : <IconEye size={16} stroke={1.7} />}
    </button>
  );

  return (
    <div className="flex min-h-[100dvh] bg-ground 2xl:h-[100dvh] 2xl:overflow-hidden">
      {/* Form column */}
      <div className="flex w-full flex-col px-6 py-8 md:px-12 lg:w-1/2 lg:px-20">
        <Rise index={0}>
          <Logo className="-ml-1 w-fit" />
        </Rise>

        <div className="mx-auto flex w-full max-w-[26rem] flex-1 flex-col justify-center py-8 2xl:max-w-[36rem] 2xl:py-4">
          <Rise index={1}>
            <h1 className="font-heading text-[2rem] leading-[1.15] text-ink md:text-[2.3rem]">
              {copy.title}
            </h1>
            <p className="mt-2.5 text-[14px] leading-relaxed text-ink-soft">{copy.subtitle}</p>
          </Rise>

          <Rise index={2}>
            <form
              className={`mt-7 grid gap-4 2xl:mt-4 ${
                mode === "signup" ? "2xl:grid-cols-2 2xl:gap-x-4 2xl:gap-y-3" : ""
              }`}
              onSubmit={handleSubmit}
            >
              {mode === "signup" ? (
                <div className="grid gap-2">
                  <Label htmlFor={`${ids}-name`} className="text-[13px] font-semibold">
                    Full name
                  </Label>
                  <Field icon={IconUser}>
                    <Input
                      id={`${ids}-name`}
                      name="name"
                      autoComplete="name"
                      placeholder="Your name as on your passport"
                      className={`${inputClass} pl-10`}
                    />
                  </Field>
                </div>
              ) : null}

              <div className="grid gap-2">
                <Label htmlFor={`${ids}-email`} className="text-[13px] font-semibold">
                  Email
                </Label>
                <Field icon={IconMail}>
                  <Input
                    id={`${ids}-email`}
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={`${inputClass} pl-10`}
                  />
                </Field>
              </div>

              {mode === "signup" ? (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor={`${ids}-phone`} className="text-[13px] font-semibold">
                      Phone number
                    </Label>
                    <div className="flex gap-3">
                      <Select name="dialCode" defaultValue="+1">
                        <SelectTrigger
                          aria-label="Country dial code"
                          className={`${selectClass} w-[6.5rem] shrink-0`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="min-w-[6.5rem] rounded-xl border-line bg-surface">
                          {DIAL_CODES.map((dial) => (
                            <SelectItem key={dial.code} value={dial.code}>
                              {dial.label} {dial.code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Field icon={IconPhone}>
                        <Input
                          id={`${ids}-phone`}
                          name="phone"
                          type="tel"
                          autoComplete="tel-national"
                          placeholder="555 000 0000"
                          className={`${inputClass} pl-10`}
                        />
                      </Field>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor={`${ids}-country`} className="text-[13px] font-semibold">
                      Country
                    </Label>
                    <Select name="country">
                      <SelectTrigger id={`${ids}-country`} className={selectClass}>
                        <SelectValue placeholder="Select your country" />
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
                </>
              ) : null}

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`${ids}-password`} className="text-[13px] font-semibold">
                    Password
                  </Label>
                  {mode === "signin" ? (
                    <Link
                      href="/help"
                      className="text-[12px] text-ink-soft underline-offset-4 transition-colors hover:text-brand-strong hover:underline"
                    >
                      Forgot password?
                    </Link>
                  ) : null}
                </div>
                <Field icon={IconLock}>
                  <Input
                    id={`${ids}-password`}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                    placeholder={
                      mode === "signin" ? "Enter your password" : "Create a strong password"
                    }
                    className={`${inputClass} pr-11 pl-10`}
                  />
                  {passwordToggle(showPassword, () => setShowPassword((v) => !v))}
                </Field>
              </div>

              {mode === "signup" ? (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor={`${ids}-confirm`} className="text-[13px] font-semibold">
                      Confirm password
                    </Label>
                    <Field icon={IconLock}>
                      <Input
                        id={`${ids}-confirm`}
                        name="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Confirm your password"
                        className={`${inputClass} pr-11 pl-10`}
                      />
                      {passwordToggle(showConfirm, () => setShowConfirm((v) => !v))}
                    </Field>
                  </div>

                  <label className="mt-1 flex items-start gap-2.5 text-[13px] text-ink-soft 2xl:col-span-2">
                    <input
                      type="checkbox"
                      name="terms"
                      className="mt-0.5 size-4 shrink-0 rounded border-line accent-[var(--brand-strong)]"
                    />
                    <span>
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="font-medium text-brand-strong underline-offset-4 hover:underline"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="font-medium text-brand-strong underline-offset-4 hover:underline"
                      >
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                </>
              ) : null}

              {error ? (
                <p role="alert" className="text-[13px] text-destructive 2xl:col-span-2">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                className="btn-gold mt-1 inline-flex h-11 w-full items-center justify-center rounded-lg text-[14px] font-semibold text-brand-ink transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none 2xl:col-span-2 hover:-translate-y-0.5 hover:bg-[#b0966f] hover:shadow-[0_14px_28px_-16px_rgba(31,26,21,0.7)] focus-visible:shadow-[0_0_0_2px_var(--surface),0_0_0_4px_var(--brand-strong)] focus-visible:outline-none active:translate-y-0 active:scale-[0.98]"
              >
                {copy.submit}
              </button>
            </form>
          </Rise>

          <Rise index={3}>
            <div className="mt-6 flex items-center gap-4 2xl:mt-4">
              <span className="h-px flex-1 bg-line" />
              <span className="text-[12px] text-ink-soft">
                or {mode === "signup" ? "sign up" : "sign in"} with
              </span>
              <span className="h-px flex-1 bg-line" />
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 2xl:mt-3">
              {SOCIALS.map((social) => (
                <button
                  key={social.name}
                  type="button"
                  aria-label={`Continue with ${social.name}`}
                  className="group relative inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-lg border border-line bg-surface text-[13px] font-medium text-ink transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-brand hover:shadow-[0_12px_26px_-18px_rgba(31,26,21,0.5)] active:translate-y-0 active:scale-[0.97]"
                >
                  {/* Shine sweep across the button face on hover. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-0 -left-3/4 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[320%]"
                  />
                  <social.icon
                    className={`size-[18px] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.18] ${social.iconClass}`}
                  />
                  <span className="hidden text-ink-soft transition-colors duration-200 group-hover:text-ink sm:inline">
                    {social.name}
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-6 text-center text-[13px] text-ink-soft 2xl:mt-4">
              {copy.switchPrompt}{" "}
              <Link
                href={copy.switchHref}
                className="font-semibold text-brand-strong underline-offset-4 transition-colors hover:underline"
              >
                {copy.switchCta}
              </Link>
            </p>
          </Rise>
        </div>
      </div>

      {/* Visual column: airplane photography */}
      <div className="hidden p-4 lg:block lg:w-1/2">
        <Rise index={2} className="h-full">
          <div className="relative flex h-full min-h-[calc(100dvh-2rem)] flex-col justify-end overflow-hidden rounded-3xl bg-[#171310] p-8">
            <Image
              src={copy.panelImage}
              alt={copy.panelAlt}
              fill
              priority
              sizes="50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#12100d]/85 via-[#12100d]/20 to-[#12100d]/15" />

            <div className="relative">
              <div className="flex flex-wrap gap-2">
                {["Trusted worldwide", "99.4% on-time approvals"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg border border-white/25 bg-white/12 px-3 py-1.5 text-[11.5px] font-medium text-white backdrop-blur-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <figure className="mt-3 rounded-2xl border border-white/15 bg-[#12100d]/55 p-6 backdrop-blur-xl">
                <blockquote className="text-[15px] leading-relaxed text-white">
                  &ldquo;{QUOTE.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-[13px]">
                  <span className="block font-semibold text-white">{QUOTE.name}</span>
                  <span className="block text-white/60">{QUOTE.role}</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </Rise>
      </div>
    </div>
  );
}

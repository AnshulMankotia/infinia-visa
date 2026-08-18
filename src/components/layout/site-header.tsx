"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { IconChevronDown, IconMenu2, IconX } from "@tabler/icons-react";
import { Logo } from "@/components/layout/logo";
import { CTA, NAV_LINKS } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * Header. Transparent over the hero photograph, then solid once the page scrolls past it.
 *
 * Motion justification: the swap is a state change. It keeps nav labels legible when the
 * photograph stops sitting behind them.
 */
export function SiteHeader({ solid = false }: { solid?: boolean }) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => setScrolled(latest > 40));

  const onPhoto = !solid && !scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        onPhoto
          ? "border-b border-white/15 bg-white/10 backdrop-blur-md"
          : "border-b border-line/70 bg-ground/70 shadow-[0_8px_30px_-18px_rgba(31,26,21,0.25)] backdrop-blur-xl",
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between gap-6 px-4 md:px-8">
        <Logo tone={onPhoto ? "light" : "ink"} />

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group relative inline-flex items-center gap-1 rounded-md px-3 py-2 text-[13px] transition-colors",
                onPhoto ? "text-white/85 hover:text-white" : "text-ink-soft hover:text-ink",
              )}
            >
              {link.label}
              {link.label === "Resources" ? (
                <IconChevronDown size={13} stroke={2} className="opacity-70" />
              ) : null}
              <span
                className={cn(
                  "absolute inset-x-3 -bottom-0.5 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100",
                  onPhoto ? "bg-white/70" : "bg-brand-strong",
                )}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={CTA.signIn.href}
            className={cn(
              "hidden rounded-lg px-3 py-2 text-[13px] transition-colors sm:inline-flex",
              onPhoto ? "text-white/85 hover:text-white" : "text-ink-soft hover:text-ink",
            )}
          >
            {CTA.signIn.label}
          </Link>

          <Link
            href={CTA.start.href}
            className="btn-gold inline-flex items-center rounded-lg px-4 py-2.5 text-[13px] font-semibold text-brand-ink transition-all duration-200 hover:-translate-y-px hover:bg-[#b0966f] active:translate-y-0 active:scale-[0.98]"
          >
            {CTA.start.label}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className={cn(
              "grid size-10 place-items-center rounded-lg transition-colors lg:hidden",
              onPhoto ? "text-white hover:bg-white/15" : "text-ink hover:bg-brand-tint",
            )}
          >
            {open ? <IconX size={20} stroke={1.75} /> : <IconMenu2 size={20} stroke={1.75} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id="mobile-nav"
            aria-label="Primary"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-line bg-ground lg:hidden"
          >
            <div className="mx-auto flex max-w-[1280px] flex-col px-4 py-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-2 py-3 text-[15px] text-ink transition-colors hover:bg-brand-tint"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={CTA.signIn.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-3 text-[15px] text-ink-soft transition-colors hover:bg-brand-tint"
              >
                {CTA.signIn.label}
              </Link>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

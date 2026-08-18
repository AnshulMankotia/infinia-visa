"use client";

import { useEffect, useState } from "react";
import { IconLock, IconMinus, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import type { Country } from "@/data/countries";

const deliveryFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
});

/**
 * Price and apply rail. Sticky from lg, and mirrored by a compact bottom bar on phones.
 *
 * The delivery date is computed after mount rather than during render, so a statically
 * generated page never ships a stale date or trips a hydration mismatch.
 */
export function ApplyRail({ country }: { country: Country }) {
  const [travellers, setTravellers] = useState(1);
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null);

  useEffect(() => {
    if (!country.processingDays) return;
    const date = new Date();
    date.setDate(date.getDate() + country.processingDays);
    setDeliveryDate(deliveryFormat.format(date));
  }, [country.processingDays]);

  const govFee = country.govFee === null ? null : country.govFee * travellers;
  const serviceFee = (country.serviceFee ?? 0) * travellers;
  const total = govFee === null ? null : govFee + serviceFee;

  return (
    <aside id="apply" className="scroll-mt-28 self-start lg:sticky lg:top-24">
      <div className="relative overflow-hidden rounded-2xl border border-line bg-surface p-6 shadow-[0_26px_60px_-38px_rgba(31,26,21,0.45)]">
        {/* Gold hairline, echoing the footer and closing panel. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent"
        />
        <div className="numeric flex items-center justify-between text-xs tracking-[0.14em] text-ink-soft uppercase">
          <span>US to {country.iso2}</span>
          <span>{country.visaType}</span>
        </div>

        <div className="mt-5 border-t border-line pt-5">
          <p className="text-sm text-ink-soft">Get it by</p>
          {country.processingDays ? (
            deliveryDate ? (
              <p className="numeric font-heading text-3xl text-ink">
                {deliveryDate}
              </p>
            ) : (
              <Skeleton className="mt-1 h-9 w-32" />
            )
          ) : (
            <p className="mt-1 text-base text-ink">Confirmed when we file</p>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-line pt-5">
          <label htmlFor="travellers" className="text-sm text-ink">
            Travellers
          </label>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setTravellers((value) => Math.max(1, value - 1))}
              disabled={travellers === 1}
              aria-label="Remove a traveller"
              className="grid size-9 place-items-center rounded-full border border-line text-ink transition-colors hover:border-brand-strong hover:text-brand-strong disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:text-ink"
            >
              <IconMinus size={15} stroke={2} />
            </button>
            <output
              id="travellers"
              aria-live="polite"
              className="numeric w-9 text-center text-base text-ink"
            >
              {travellers}
            </output>
            <button
              type="button"
              onClick={() => setTravellers((value) => Math.min(9, value + 1))}
              disabled={travellers === 9}
              aria-label="Add a traveller"
              className="grid size-9 place-items-center rounded-full border border-line text-ink transition-colors hover:border-brand-strong hover:text-brand-strong disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:text-ink"
            >
              <IconPlus size={15} stroke={2} />
            </button>
          </div>
        </div>

        <dl className="mt-5 grid gap-3 border-t border-line pt-5">
          <div className="flex items-baseline justify-between">
            <dt className="text-sm text-ink-soft">Government fees</dt>
            <dd className="numeric text-sm text-ink">
              {govFee === null ? "At checkout" : `$${govFee}`}
            </dd>
          </div>
          <div className="flex items-baseline justify-between">
            <dt className="text-sm text-ink-soft">Service fees</dt>
            <dd className="numeric text-sm text-ink">${serviceFee}</dd>
          </div>
          <div className="flex items-baseline justify-between border-t border-line pt-3">
            <dt className="text-sm font-semibold text-ink">Total</dt>
            <dd className="numeric font-heading text-2xl text-ink">
              {total === null ? "At checkout" : `$${total}`}
            </dd>
          </div>
        </dl>

        <Link
          href={`/apply/${country.slug}`}
          className="btn-gold mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold text-brand-ink transition-all duration-200 hover:-translate-y-px hover:bg-[#b0966f] active:translate-y-0 active:scale-[0.98]"
        >
          <IconLock size={15} stroke={1.75} />
          Apply now
        </Link>
        <p className="mt-3 text-center text-xs text-ink-soft">
          Refundable if denied. Payment secured by Stripe.
        </p>
      </div>
    </aside>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { IconArrowUpRight } from "@tabler/icons-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { flagSrc, totalFee, type Country } from "@/data/countries";

/**
 * Destination card.
 *
 * Resting: photograph, circular flag, country name, and a footer with TYPE / VALID / FEES.
 * Hover: an Aceternity glowing border tracks the cursor, the flag and name slide up, and
 * a DOCUMENTS NEEDED panel fades in beneath them.
 *
 * Everything that moves is `transform` or `opacity`. Nothing animates height, so the
 * card never reflows mid-transition, which is what made the earlier version stutter.
 */
export function DestinationCard({
  country,
  priority = false,
}: {
  country: Country;
  priority?: boolean;
}) {
  const total = totalFee(country);
  const documents = country.documents.map((document) => document.name).join(", ");

  const meta = [
    { label: "Type", value: country.visaType },
    { label: "Valid", value: shortValidity(country.validity) },
    { label: "Fees", value: total === null ? "At checkout" : `US$${total}` },
  ];

  return (
    <div className="group relative h-full rounded-2xl">
      <GlowingEffect
        disabled={false}
        glow
        blur={0}
        spread={38}
        proximity={72}
        borderWidth={1.5}
        movementDuration={1.2}
        className="rounded-2xl"
      />

      <Link
        href={`/destinations/${country.slug}`}
        aria-label={`${country.name} visa, ${country.visaType}, from ${
          total === null ? "price at checkout" : `US$${total}`
        }`}
        className="relative flex aspect-[3/4] flex-col overflow-hidden rounded-2xl bg-ink/5 shadow-[0_10px_30px_-24px_rgba(31,26,21,0.45)]"
      >
        <Image
          src={country.image}
          alt={country.imageAlt}
          fill
          priority={priority}
          sizes="(max-width: 640px) 88vw, (max-width: 1024px) 42vw, 24vw"
          className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        />

        {/* Legibility wash. */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#12100d]/90 via-[#12100d]/20 to-[#12100d]/10" />
        <div className="absolute inset-0 bg-[#12100d]/0 transition-colors duration-500 group-hover:bg-[#12100d]/20" />

        <span className="absolute top-3 right-3 grid size-8 place-items-center rounded-full bg-white/18 text-white opacity-0 backdrop-blur-sm transition-opacity duration-400 group-hover:opacity-100">
          <IconArrowUpRight size={15} stroke={2} />
        </span>

        <div className="relative mt-auto flex flex-col items-center px-3 pb-3">
          {/* Flag and name ride up by exactly the panel height, so nothing reflows. */}
          <div className="flex flex-col items-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[74px]">
            <span className="relative mb-2.5 block size-9 overflow-hidden rounded-full ring-2 ring-white/85">
              <Image
                src={flagSrc(country.iso2)}
                alt=""
                fill
                sizes="36px"
                className="object-cover"
              />
            </span>
            <h3 className="text-center font-heading text-[18px] leading-tight text-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.5)]">
              {country.name}
            </h3>
          </div>

          <div className="relative mt-3 w-full">
            {/* Panel is absolutely placed, so revealing it costs no layout. */}
            <div className="pointer-events-none absolute inset-x-0 bottom-full mb-1.5 flex h-[62px] translate-y-2 flex-col justify-center rounded-xl bg-[#12100d]/78 px-4 opacity-0 backdrop-blur-md transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
              <p className="text-[9px] font-semibold tracking-[0.16em] text-white/55 uppercase">
                Documents needed
              </p>
              <p className="mt-1.5 truncate text-[12.5px] font-medium text-white">
                {documents}
              </p>
            </div>

            <dl className="grid grid-cols-3 rounded-xl bg-[#12100d]/72 px-2 py-3 backdrop-blur-md">
              {meta.map((item, index) => (
                <div
                  key={item.label}
                  className={
                    index === 1
                      ? "border-x border-white/15 px-1 text-center"
                      : "px-1 text-center"
                  }
                >
                  <dt className="text-[9px] font-semibold tracking-[0.14em] text-white/55 uppercase">
                    {item.label}
                  </dt>
                  <dd className="mt-1 truncate text-[12px] font-semibold text-white">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Link>
    </div>
  );
}

/** "3 months" reads as "3 MOS" in the card footer, matching the approved design. */
function shortValidity(validity: string): string {
  const months = validity.match(/^(\d+)\s*months?$/i);
  if (months) return `${months[1]} MOS`;

  const years = validity.match(/^(\d+)\s*years?$/i);
  if (years) return `${years[1]} ${Number(years[1]) === 1 ? "YR" : "YRS"}`;

  return validity;
}

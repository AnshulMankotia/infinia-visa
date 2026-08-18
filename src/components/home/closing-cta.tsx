import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { Mark } from "@/components/layout/logo";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Reveal } from "@/components/ui/reveal";
import { CLOSING, CTA } from "@/data/site";

/**
 * Closing band: the page's one deliberate contrast moment.
 *
 * Dark ink panel inside the container; the dusk photograph reads on the right, copy on
 * the left, proof numerals fill the space between. CSS background rather than
 * `next/image` because a lazy full-bleed background pops in late and reads as a glitch.
 */
export function ClosingCta() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-20">
      <Reveal className="relative mx-auto max-w-[1280px] overflow-hidden rounded-3xl bg-[#171310]">
        <div
          aria-hidden="true"
          style={{ backgroundImage: `url(${CLOSING.image})` }}
          className="absolute inset-0 bg-cover bg-[75%_35%] bg-no-repeat"
        />
        {/* Ink wash: opaque behind the copy, lifting to reveal the dusk on the right. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#171310] via-[#171310]/82 to-[#171310]/25"
        />
        {/* Gold breath in the top-right corner. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(60%_80%_at_85%_0%,rgba(190,167,132,0.22)_0%,transparent_60%)]"
        />

        <div className="relative grid gap-12 p-10 md:p-16 lg:grid-cols-[1.2fr_auto] lg:items-center lg:gap-20">
          <div className="max-w-xl">
            <Mark className="h-4 w-9 text-brand" />
            <h2 className="mt-6 font-heading text-[2rem] leading-[1.15] text-white md:text-[2.6rem]">
              Your journey starts <em className="pb-1 text-brand italic">here</em>.
            </h2>
            <p className="mt-4 max-w-[44ch] text-[15px] leading-relaxed text-white/65">
              Apply with confidence. Travel with peace of mind.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-6">
              <HoverBorderGradient
                as="a"
                href={CTA.apply.href}
                duration={1.4}
                containerClassName="rounded-full border-brand/30"
                className="bg-transparent px-7 py-3 text-sm font-semibold text-white"
              >
                {CTA.apply.label}
              </HoverBorderGradient>
              <Link
                href="/destinations"
                className="group inline-flex items-center gap-2 text-[13px] font-medium text-white/70 transition-colors duration-200 hover:text-white"
              >
                Explore destinations
                <IconArrowRight
                  size={15}
                  stroke={1.8}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>

          {/* Proof numerals. Hairlines in gold, numerals in the serif. */}
          <dl className="grid gap-6 lg:min-w-[15rem]">
            {CLOSING.stats.map((stat, index) => (
              <div
                key={stat.label}
                className={index === 0 ? "" : "border-t border-brand/25 pt-6"}
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd className="numeric font-heading text-3xl text-brand md:text-4xl">
                  {stat.value}
                </dd>
                <p className="mt-1 text-[12px] tracking-[0.06em] text-white/55">
                  {stat.label}
                </p>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>
    </section>
  );
}

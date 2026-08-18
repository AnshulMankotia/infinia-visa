import Link from "next/link";
import { IconArrowRight, IconWorld } from "@tabler/icons-react";
import { DestinationCard } from "@/components/home/destination-card";
import { Reveal } from "@/components/ui/reveal";
import { FEATURED_COUNTRIES } from "@/data/countries";

function PillLink({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href="/destinations"
      className={`group inline-flex items-center gap-2 rounded-lg border border-brand/70 px-5 py-2.5 text-[13px] font-medium text-brand-strong transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-brand hover:bg-brand-tint hover:shadow-[0_10px_24px_-16px_rgba(31,26,21,0.6)] active:translate-y-0 active:scale-[0.98] ${className}`}
    >
      {children}
    </Link>
  );
}

export function Destinations() {
  return (
    <section id="countries" className="scroll-mt-28 pt-14 pb-20 md:pt-16 md:pb-24">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] text-brand-strong uppercase">
              Explore the world
            </p>
            <h2 className="mt-3 font-heading text-[2rem] text-ink md:text-[2.6rem]">
              Popular destinations
            </h2>
            <p className="mt-2 text-[15px] text-ink-soft">
              Handpicked places. Simplified visa process.
            </p>
          </div>
          <PillLink>
            View all destinations
            <IconArrowRight
              size={15}
              stroke={1.8}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </PillLink>
        </Reveal>

        <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
          {FEATURED_COUNTRIES.map((country, index) => (
            <Reveal as="li" key={country.slug} index={index % 4} y={22}>
              <DestinationCard country={country} priority={index < 4} />
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-12 flex justify-center">
          <PillLink>
            View all destinations
            <IconWorld size={15} stroke={1.7} />
          </PillLink>
        </Reveal>
      </div>
    </section>
  );
}

import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { DestinationCard } from "@/components/home/destination-card";
import { Reveal } from "@/components/ui/reveal";
import { relatedCountries } from "@/data/countries";

/** Other corridors, using the homepage destination cards. */
export function Related({ slug }: { slug: string }) {
  const countries = relatedCountries(slug, 4);

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] text-brand-strong uppercase">
              Explore more
            </p>
            <h2 className="mt-3 font-heading text-[2rem] text-ink md:text-[2.6rem]">
              Other destinations you might like.
            </h2>
          </div>
          <Link
            href="/destinations"
            className="group inline-flex items-center gap-2 rounded-lg border border-brand/70 px-5 py-2.5 text-[13px] font-medium text-brand-strong transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-brand hover:bg-brand-tint active:translate-y-0 active:scale-[0.98]"
          >
            View all destinations
            <IconArrowRight
              size={15}
              stroke={1.8}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </Link>
        </Reveal>

        <ul className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
          {countries.map((country, index) => (
            <Reveal as="li" key={country.slug} index={index} y={22}>
              <DestinationCard country={country} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

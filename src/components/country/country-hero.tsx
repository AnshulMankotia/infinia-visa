import Image from "next/image";
import Link from "next/link";
import { IconArrowRight, IconChevronRight } from "@tabler/icons-react";
import { Mark } from "@/components/layout/logo";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Rise } from "@/components/ui/reveal";
import { flagSrc, totalFee, type Country } from "@/data/countries";

/**
 * Corridor hero: the destination photograph fills the section, with an ink gradient
 * rising from the left so the copy sits in the dark side and the landscape breathes on
 * the right. Left-aligned and dark: deliberately not the homepage's centred cream hero.
 */
export function CountryHero({ country }: { country: Country }) {
  const total = totalFee(country);

  const facts = [
    { label: "From", value: total === null ? "At checkout" : `$${total}` },
    { label: "Decision", value: country.processing },
    {
      label: "Max stay",
      value: country.stayDays ? `${country.stayDays} days` : "Embassy set",
    },
  ];

  return (
    <section className="relative flex min-h-[88dvh] flex-col justify-center overflow-hidden pt-[72px]">
      <Image
        src={country.image}
        alt={country.imageAlt}
        fill
        priority
        quality={85}
        sizes="100vw"
        className="hero-drift -z-10 object-cover object-center"
      />

      {/* Ink scrim from the left carries the copy; the photo stays open on the right. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#12100d]/92 via-[#12100d]/62 to-[#12100d]/15" />
      <div className="absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-[#12100d]/60 to-transparent" />

      <div className="mx-auto w-full max-w-[1280px] px-4 py-14 md:px-8">
        <div className="max-w-2xl">
          <Rise index={0}>
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1.5 text-[12px] text-white/65">
                <li>
                  <Link href="/" className="transition-colors hover:text-white">
                    Home
                  </Link>
                </li>
                <IconChevronRight size={13} stroke={2} className="text-white/35" />
                <li>
                  <Link href="/destinations" className="transition-colors hover:text-white">
                    Destinations
                  </Link>
                </li>
                <IconChevronRight size={13} stroke={2} className="text-white/35" />
                <li aria-current="page" className="font-medium text-white">
                  {country.name} Visa
                </li>
              </ol>
            </nav>
          </Rise>

          <Rise index={1}>
            <p className="mt-9 flex items-center gap-3 text-[11px] font-semibold tracking-[0.24em] text-brand uppercase">
              <Mark className="h-2.5 w-5" />
              US to {country.iso2} corridor
            </p>
          </Rise>

          <Rise index={2}>
            <h1 className="mt-4 flex flex-wrap items-center gap-4 font-heading text-[2.7rem] leading-[1.08] text-white md:text-[3.4rem] lg:text-[3.8rem]">
              <span className="relative inline-block size-10 overflow-hidden rounded-full ring-2 ring-white/60 md:size-12">
                <Image src={flagSrc(country.iso2)} alt="" fill sizes="48px" className="object-cover" />
              </span>
              {country.name}.
            </h1>
            <p className="mt-5 max-w-[44ch] text-[15px] leading-relaxed text-white/75 md:text-[16px]">
              Apply in two minutes. We file with the embassy and email your visa on the
              promised date.
            </p>
          </Rise>

          <Rise index={3}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <HoverBorderGradient
                as="a"
                href={`/apply/${country.slug}`}
                duration={1.4}
                containerClassName="rounded-full border-brand/40"
                plateClassName="bg-brand"
                className="group flex items-center gap-2 bg-transparent px-7 py-3 text-sm font-semibold text-brand-ink"
              >
                Apply now
                <IconArrowRight
                  size={16}
                  stroke={1.75}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </HoverBorderGradient>
              <a
                href="#documents"
                className="inline-flex items-center rounded-lg border border-white/35 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/70 hover:bg-white/20 active:translate-y-0 active:scale-[0.98]"
              >
                What you&rsquo;ll need
              </a>
            </div>
          </Rise>

          <Rise index={4}>
            {/* Facts as a serif stat row with gold rules: this page's own device. */}
            <dl className="mt-11 flex flex-wrap gap-x-10 gap-y-6 border-t border-white/15 pt-7">
              {facts.map((fact) => (
                <div key={fact.label} className="border-l-2 border-brand pl-4">
                  <dt className="text-[10px] font-semibold tracking-[0.16em] text-white/55 uppercase">
                    {fact.label}
                  </dt>
                  <dd className="numeric mt-1 font-heading text-[1.55rem] leading-none text-white">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Rise>
        </div>
      </div>

      {/* Visa facts strip, anchored bottom right over the open photo. */}
      <Rise
        index={5}
        className="absolute right-6 bottom-10 hidden lg:block xl:right-12"
      >
        <div className="flex items-center gap-6 rounded-2xl border border-white/20 bg-[#12100d]/50 px-6 py-4 backdrop-blur-md">
          <div>
            <p className="text-[9.5px] font-semibold tracking-[0.16em] text-white/60 uppercase">
              Visa type
            </p>
            <p className="mt-0.5 text-[13px] font-semibold text-white">{country.visaType}</p>
          </div>
          <div className="h-8 w-px bg-white/15" />
          <div>
            <p className="text-[9.5px] font-semibold tracking-[0.16em] text-white/60 uppercase">
              Entry
            </p>
            <p className="mt-0.5 text-[13px] font-semibold text-white">{country.entry}</p>
          </div>
          <div className="h-8 w-px bg-white/15" />
          <div>
            <p className="text-[9.5px] font-semibold tracking-[0.16em] text-white/60 uppercase">
              Validity
            </p>
            <p className="numeric mt-0.5 text-[13px] font-semibold text-white">
              {country.validity}
            </p>
          </div>
        </div>
      </Rise>
    </section>
  );
}

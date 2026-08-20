import {
  IconCalendarEvent,
  IconClockHour4,
  IconHourglassHigh,
  IconId,
  IconLogin,
  IconRoute,
  type IconProps,
} from "@tabler/icons-react";
import { Reveal } from "@/components/ui/reveal";
import type { Country } from "@/data/countries";

/** The corridor facts as one hairline-divided panel, not six loose boxes. */
export function AtAGlance({ country }: { country: Country }) {
  const specs: { label: string; value: string; icon: React.ComponentType<IconProps> }[] = [
    { label: "Corridor", value: `US to ${country.iso2}`, icon: IconRoute },
    { label: "Visa type", value: country.visaType, icon: IconId },
    {
      label: "Length of stay",
      value: country.stayDays ? `${country.stayDays} days` : "Embassy set",
      icon: IconCalendarEvent,
    },
    { label: "Validity", value: country.validity, icon: IconClockHour4 },
    { label: "Entry", value: `${country.entry} entry`, icon: IconLogin },
    { label: "Processing time", value: country.processing, icon: IconHourglassHigh },
  ];

  return (
    <section id="glance" className="scroll-mt-28">
      <Reveal>
        <p className="text-[11px] font-semibold tracking-[0.22em] text-brand-strong uppercase">
          At a glance
        </p>
        <h2 className="mt-3 font-heading text-[1.9rem] text-ink md:text-[2.3rem]">
          About your {country.name} visa.
        </h2>
        <p className="mt-3 max-w-[62ch] text-[14px] leading-relaxed text-ink-soft">
          {country.summary}
        </p>
      </Reveal>

      <Reveal className="mt-8 overflow-hidden rounded-2xl border border-line shadow-[0_20px_44px_-34px_rgba(31,26,21,0.35)]">
        {/* gap-px over the line colour paints perfect hairlines between cells. */}
        <dl className="grid grid-cols-2 gap-px bg-line sm:grid-cols-3">
          {specs.map((spec, index) => (
            <div
              key={spec.label}
              className={`p-5 ${index % 2 === 0 ? "bg-brand-tint/55" : "bg-surface"}`}
            >
              <dt className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.14em] text-ink-soft uppercase">
                <spec.icon
                  size={14}
                  stroke={1.8}
                  className="text-brand-strong"
                />
                {spec.label}
              </dt>
              <dd className="numeric mt-2 font-heading text-[1.15rem] text-ink">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}

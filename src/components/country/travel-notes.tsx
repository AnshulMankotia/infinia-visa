import { IconCircleCheck, IconInfoCircle } from "@tabler/icons-react";
import { Reveal } from "@/components/ui/reveal";
import type { Country } from "@/data/countries";

/** Three short heads-up notes before travel. */
export function TravelNotes({ country }: { country: Country }) {
  return (
    <section className="mt-16 md:mt-20">
      <Reveal className="overflow-hidden rounded-2xl border border-line bg-paper">
        <div
          aria-hidden="true"
          className="h-px bg-gradient-to-r from-transparent via-brand to-transparent"
        />
        <div className="p-6 md:p-7">
          <h2 className="flex items-center gap-2.5 font-heading text-[1.2rem] text-ink">
            <IconInfoCircle size={19} stroke={1.7} className="text-brand-strong" />
            Before you travel to {country.name}
          </h2>
          <ul className="mt-5 grid gap-4 md:grid-cols-3">
            {country.notes.map((note) => (
              <li key={note} className="flex gap-2.5">
                <IconCircleCheck
                  size={16}
                  stroke={1.9}
                  className="mt-px shrink-0 text-brand-strong"
                />
                <span className="text-[13px] leading-relaxed text-ink-soft">{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}

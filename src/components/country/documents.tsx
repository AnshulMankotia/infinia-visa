import {
  IconFileDescription,
  IconId,
  IconPhoto,
  type IconProps,
} from "@tabler/icons-react";
import { Reveal } from "@/components/ui/reveal";
import type { Country, VisaDocument } from "@/data/countries";

type IconComponent = React.ComponentType<IconProps>;

const ICONS: { match: RegExp; icon: IconComponent }[] = [
  { match: /photo/i, icon: IconPhoto },
  { match: /passport/i, icon: IconId },
];

function iconFor(document: VisaDocument): IconComponent {
  return ICONS.find((entry) => entry.match.test(document.name))?.icon ?? IconFileDescription;
}

/** What the corridor asks for. Reference only: uploading happens inside the application. */
export function Documents({ country }: { country: Country }) {
  return (
    <section id="documents" className="mt-16 scroll-mt-28 md:mt-20">
      <Reveal>
        <p className="text-[11px] font-semibold tracking-[0.22em] text-brand-strong uppercase">
          Requirements
        </p>
        <h2 className="mt-3 font-heading text-[1.9rem] text-ink md:text-[2.3rem]">
          What you&rsquo;ll need.
        </h2>
        <p className="mt-3 max-w-[62ch] text-[14px] leading-relaxed text-ink-soft">
          {country.documents.length} documents for this corridor. You upload them inside the
          application, and anything already stored in your account carries over.
        </p>
      </Reveal>

      <ol className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {country.documents.map((document, index) => {
          const Icon = iconFor(document);

          return (
            <Reveal
              as="li"
              key={document.name}
              index={index % 2}
              className="group relative overflow-hidden rounded-xl border border-white/75 bg-surface/72 p-5 shadow-[0_18px_38px_-32px_rgba(31,26,21,0.5)] backdrop-blur-xl transition-[background-color,border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-brand/55 hover:bg-surface/88 hover:shadow-[0_24px_46px_-32px_rgba(31,26,21,0.55)]"
            >
              {/* Gold index watermark. */}
              <span
                aria-hidden="true"
                className="numeric pointer-events-none absolute top-3 right-4 font-heading text-[2.9rem] leading-none text-brand/12 transition-colors duration-300 group-hover:text-brand/20"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="relative grid size-10 place-items-center rounded-xl bg-brand-tint text-brand-strong transition-colors duration-300 group-hover:bg-brand group-hover:text-brand-ink">
                <Icon size={19} stroke={1.7} />
              </span>

              <h3 className="relative mt-4 text-[15px] font-semibold text-ink">
                {document.name}
              </h3>
              <p className="relative mt-1 text-[12.5px] text-ink-soft">{document.hint}</p>
            </Reveal>
          );
        })}
      </ol>
    </section>
  );
}

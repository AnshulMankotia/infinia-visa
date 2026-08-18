import { IconAlertTriangle } from "@tabler/icons-react";
import { Reveal } from "@/components/ui/reveal";
import type { Country } from "@/data/countries";

/** The most common refusal reasons, as a grid of cards. */
export function Rejections({ country }: { country: Country }) {
  return (
    <section className="mt-16 md:mt-20">
      <Reveal>
        <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.22em] text-brand-strong uppercase">
          <IconAlertTriangle size={14} stroke={1.9} />
          Avoid these
        </p>
        <h2 className="mt-3 font-heading text-[1.9rem] text-ink md:text-[2.3rem]">
          Why visas get rejected.
        </h2>
        <p className="mt-3 max-w-[62ch] text-[14px] leading-relaxed text-ink-soft">
          The most common reasons a {country.name} visa is refused. Each one is fixable
          before you file.
        </p>
      </Reveal>

      <ol className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {country.rejections.map((reason, index) => (
          <Reveal
            as="li"
            key={reason.title}
            index={index % 2}
            className="group relative overflow-hidden rounded-xl border border-line bg-surface p-5 transition-[border-color,box-shadow] duration-300 hover:border-brand hover:shadow-[0_20px_44px_-32px_rgba(31,26,21,0.4)]"
          >
            {/* Gold rule that grows on hover. */}
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 bg-brand transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100"
            />
            <div className="flex items-baseline gap-3">
              <span className="numeric font-heading text-[1.1rem] text-brand">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-[15px] font-semibold text-ink">{reason.title}</h3>
            </div>
            <p className="mt-2 pl-9 text-[13px] leading-relaxed text-ink-soft">{reason.body}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

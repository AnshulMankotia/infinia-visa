import {
  IconCompass,
  IconFileText,
  IconMail,
  IconSend,
  type IconProps,
} from "@tabler/icons-react";
import { HoverGrid } from "@/components/ui/card-hover-effect";
import { Reveal } from "@/components/ui/reveal";
import { HOW_IT_WORKS } from "@/data/site";

const ICONS: Record<string, React.ComponentType<IconProps>> = {
  compass: IconCompass,
  form: IconFileText,
  send: IconSend,
  mail: IconMail,
};

/** Four steps as numbered cards on the warm band. */
export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-28 bg-paper py-20 md:py-24">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8">
        <Reveal>
          <p className="text-[11px] font-semibold tracking-[0.22em] text-brand-strong uppercase">
            Simple, secure, stress-free
          </p>
          <h2 className="mt-3 font-heading text-[2rem] text-ink md:text-[2.6rem]">
            How it works
          </h2>
          <p className="mt-2 text-[15px] text-ink-soft">
            Four simple steps to your next adventure.
          </p>
        </Reveal>

        <Reveal className="mt-8 -mx-2">
          <HoverGrid>
            {HOW_IT_WORKS.map((step, index) => {
              const Icon = ICONS[step.icon] ?? IconCompass;
              return (
                <div
                  key={step.title}
                  className="flex h-full flex-col rounded-xl border border-line bg-surface p-6 transition-[border-color,box-shadow] duration-300 group-hover:border-brand group-hover:shadow-[0_20px_44px_-30px_rgba(31,26,21,0.4)]"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-heading text-[2.6rem] leading-none text-brand">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="grid size-10 place-items-center rounded-full bg-brand-tint text-brand-strong transition-[background-color,color,transform] duration-300 group-hover:scale-110 group-hover:bg-brand group-hover:text-brand-ink">
                      <Icon size={18} stroke={1.6} />
                    </span>
                  </div>

                  <h3 className="mt-7 font-heading text-lg text-ink">{step.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{step.body}</p>
                </div>
              );
            })}
          </HoverGrid>
        </Reveal>
      </div>
    </section>
  );
}

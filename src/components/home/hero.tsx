import Image from "next/image";
import {
  IconClockCheck,
  IconHeadset,
  IconShieldLock,
  IconUsers,
  type IconProps,
} from "@tabler/icons-react";
import { CorridorSearch } from "@/components/home/corridor-search";
import { HeroSparkles } from "@/components/home/hero-sparkles";
import { HeroEmphasis } from "@/components/home/hero-emphasis";
import { Mark } from "@/components/layout/logo";
import { Rise } from "@/components/ui/reveal";
import { HERO, TRUST_ITEMS } from "@/data/site";

const TRUST_ICONS: Record<string, React.ComponentType<IconProps>> = {
  users: IconUsers,
  shield: IconShieldLock,
  clock: IconClockCheck,
  headset: IconHeadset,
};

/**
 * Full-viewport hero: photograph, headline, search card and trust chips all live inside
 * one 100dvh frame, so nothing below shows on load. The trust chips sit on glass over
 * the photograph, which is what makes the blur read.
 */
export function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col overflow-hidden pt-[72px]">
      <Image
        src={HERO.image}
        alt={HERO.imageAlt}
        fill
        priority
        quality={85}
        sizes="100vw"
        className="hero-drift -z-10 object-cover object-center"
      />

      {/* Warm scrim: keeps the ink headline legible on the bright cloud bank. */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(90%_75%_at_50%_38%,rgba(247,242,233,0.92)_0%,rgba(247,242,233,0.55)_55%,rgba(247,242,233,0.15)_100%)]" />
      {/* Top scrim so the white nav reads against the cloud bank. */}
      <div className="absolute inset-x-0 top-0 -z-10 h-36 bg-gradient-to-b from-[#1f1a15]/45 via-[#1f1a15]/12 to-transparent" />
      {/* Eased cloud fade: many soft stops so the blend into the page has no visible edge. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-64 md:h-80"
        style={{
          background:
            "linear-gradient(to top, var(--ground) 0%, color-mix(in srgb, var(--ground) 92%, transparent) 18%, color-mix(in srgb, var(--ground) 74%, transparent) 36%, color-mix(in srgb, var(--ground) 48%, transparent) 55%, color-mix(in srgb, var(--ground) 22%, transparent) 74%, color-mix(in srgb, var(--ground) 6%, transparent) 88%, transparent 100%)",
        }}
      />

      {/* One centred block: headline, search card and trust chips together, with equal
          breathing room above and below inside the viewport. */}
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-10 py-12 md:gap-12">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-6 px-4 text-center md:px-8">
          <Rise index={0}>
            <p className="flex items-center justify-center gap-3 text-[11px] font-semibold tracking-[0.24em] text-brand-strong uppercase">
              <span className="grid size-8 place-items-center rounded-full border border-brand/40 bg-white/55 backdrop-blur-sm">
                <Mark className="h-2.5 w-5" />
              </span>
              {HERO.eyebrow}
            </p>
            {/* Sparkle line under the eyebrow; negative margin lets the headline sit into the fade. */}
            <HeroSparkles className="-mb-14 h-20 max-w-[26rem]" />
          </Rise>

          <Rise index={1}>
            <h1 className="mx-auto max-w-[24ch] font-heading text-[2.6rem] leading-[1.12] text-balance text-ink md:text-[3.4rem] lg:text-[3.8rem]">
              {HERO.headlineBefore}
              <HeroEmphasis>{HERO.headlineEmphasis}</HeroEmphasis>
              {HERO.headlineAfter}
            </h1>
          </Rise>

          <Rise index={2}>
            <p className="mx-auto max-w-[52ch] text-[15px] leading-relaxed text-ink-soft md:text-[17px]">
              {HERO.subtext}
            </p>
          </Rise>
        </div>

        <div className="w-full">
          <Rise index={3}>
            <CorridorSearch />
          </Rise>

          <Rise index={4}>
            <ul className="mx-auto mt-7 flex max-w-[1280px] flex-wrap items-center justify-center gap-3 px-4 md:gap-4 md:px-8">
              {TRUST_ITEMS.map((item) => {
                const Icon = TRUST_ICONS[item.icon] ?? IconShieldLock;
                return (
                  <li
                    key={item.label}
                    className="flex items-center gap-2.5 rounded-full border border-white/50 bg-white/35 px-4 py-2.5 shadow-[0_10px_28px_-18px_rgba(31,26,21,0.4)] backdrop-blur-md transition-colors duration-300 hover:bg-white/55"
                  >
                    <Icon size={16} stroke={1.7} className="shrink-0 text-brand-strong" />
                    <span className="text-[12.5px] font-medium text-ink">{item.label}</span>
                  </li>
                );
              })}
            </ul>
          </Rise>
        </div>
      </div>
    </section>
  );
}

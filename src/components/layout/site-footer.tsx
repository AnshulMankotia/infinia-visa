import Link from "next/link";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandYoutube,
  IconLock,
  type IconProps,
} from "@tabler/icons-react";
import { Logo } from "@/components/layout/logo";
import { Reveal } from "@/components/ui/reveal";
import { FOOTER_GROUPS, SITE, SOCIAL_LINKS } from "@/data/site";

const SOCIAL_ICONS: Record<string, React.ComponentType<IconProps>> = {
  instagram: IconBrandInstagram,
  facebook: IconBrandFacebook,
  linkedin: IconBrandLinkedin,
  youtube: IconBrandYoutube,
};

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-paper">
      {/* Hairline of brand gold along the top edge. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent"
      />

      <Reveal className="mx-auto grid max-w-[1280px] gap-12 px-4 py-16 md:px-8 lg:grid-cols-[1.5fr_repeat(4,1fr)] lg:gap-10">
        <div className="max-w-[17rem]">
          <Logo />
          <p className="mt-5 text-[13px] leading-relaxed text-ink-soft">{SITE.tagline}</p>

          <p className="mt-6 inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-[11px] font-medium text-ink-soft">
            <IconLock size={13} stroke={1.8} className="text-brand-strong" />
            Payments secured by Stripe
          </p>

          <ul className="mt-6 flex gap-2">
            {SOCIAL_LINKS.map((social) => {
              const Icon = SOCIAL_ICONS[social.icon] ?? IconBrandInstagram;
              return (
                <li key={social.name}>
                  <a
                    href={social.href}
                    aria-label={social.name}
                    className="grid size-9 place-items-center rounded-lg border border-line bg-surface text-ink-soft transition-[transform,background-color,color,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-brand hover:bg-brand hover:text-brand-ink"
                  >
                    <Icon size={16} stroke={1.7} />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {FOOTER_GROUPS.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h2 className="text-[10px] font-semibold tracking-[0.18em] text-brand-strong uppercase">
              {group.title}
            </h2>
            <ul className="mt-5 space-y-3">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center text-[13px] text-ink-soft transition-colors duration-200 hover:text-ink"
                  >
                    <span className="relative">
                      {link.label}
                      <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-brand transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Reveal>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-4 py-6 text-[11px] text-ink-soft md:flex-row md:items-center md:justify-between md:px-8">
          <p>&copy; 2026 Infinia Visa. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="rounded-lg border border-line bg-surface px-3 py-1.5 transition-colors duration-200 hover:border-brand hover:text-ink">
              English (US)
            </span>
            <span className="rounded-lg border border-line bg-surface px-3 py-1.5 transition-colors duration-200 hover:border-brand hover:text-ink">
              USD
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

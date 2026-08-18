import Link from "next/link";
import { cn } from "@/lib/utils";
import { SITE } from "@/data/site";

/** The Infinia Visa infinity mark, preserved from the live site. */
export function Mark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      className={cn("h-4 w-8", className)}
    >
      <path d="M8 8c0-3.3 2.7-6 6-6s6 2.7 6 6c0 3.3 2.7 6 6 6s6-2.7 6-6-2.7-6-6-6c-3.3 0-6 2.7-6 6 0 3.3-2.7 6-6 6S2 11.3 2 8s2.7-6 6-6c3.3 0 6 2.7 6 6" />
    </svg>
  );
}

/**
 * Stacked wordmark: the mark beside INFINIA with VISA set small underneath, letter-spaced
 * to sit under the word above it.
 */
export function Logo({
  className,
  tone = "ink",
}: {
  className?: string;
  tone?: "ink" | "light";
}) {
  return (
    <Link
      href="/"
      aria-label={`${SITE.name}, home`}
      className={cn(
        "group relative z-20 flex shrink-0 items-center gap-2.5",
        tone === "light" ? "text-white" : "text-ink",
        className,
      )}
    >
      <Mark
        className={cn(
          "transition-transform duration-300 group-hover:scale-105",
          tone === "light" ? "text-brand" : "text-brand-strong",
        )}
      />
      <span className="leading-none">
        <span className="block font-heading text-[15px] tracking-[0.16em]">
          {SITE.wordmarkTop}
        </span>
        <span
          className={cn(
            "mt-1 block text-[9px] tracking-[0.42em]",
            tone === "light" ? "text-white/70" : "text-ink-soft",
          )}
        >
          {SITE.wordmarkBottom}
        </span>
      </span>
    </Link>
  );
}

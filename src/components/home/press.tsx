import { Reveal } from "@/components/ui/reveal";
import { PRESS } from "@/data/site";

/**
 * Press row.
 *
 * Rendered as typeset wordmarks, not trademarked logo files. Swap in licensed assets
 * before this claim goes live.
 */
export function Press() {
  return (
    <section className="pb-16 md:pb-20">
      <Reveal className="mx-auto mt-14 flex max-w-[1280px] flex-col gap-6 border-t border-line px-4 pt-8 md:mt-16 md:px-8 lg:flex-row lg:items-center lg:gap-10">
        <p className="shrink-0 text-[10px] font-semibold tracking-[0.22em] text-ink-soft uppercase">
          As featured in
        </p>
        <ul className="flex flex-1 flex-wrap items-center justify-between gap-x-8 gap-y-5">
          {PRESS.map((item) => (
            <li
              key={item.name}
              className={`${item.className} text-ink/55 transition-colors duration-300 hover:text-ink`}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

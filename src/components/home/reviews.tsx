import { IconStarFilled } from "@tabler/icons-react";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { Reveal } from "@/components/ui/reveal";
import { RATING, REVIEWS } from "@/data/site";

function Stars({ size = 13 }: { size?: number }) {
  return (
    <span className="flex items-center gap-0.5 text-brand" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <IconStarFilled key={index} size={size} />
      ))}
    </span>
  );
}

export function Reviews() {
  const items = REVIEWS.map((review) => ({
    quote: review.quote,
    name: review.name,
    title: review.role,
    initials: review.initials,
  }));

  return (
    <section id="reviews" className="scroll-mt-28 pt-20 pb-20 md:pt-24 md:pb-24">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] text-brand-strong uppercase">
              Trusted by travelers
            </p>
            <h2 className="mt-3 font-heading text-[2rem] text-ink md:text-[2.6rem]">
              Rated excellent by thousands
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <span className="numeric font-heading text-[3rem] leading-none text-ink">
              {RATING.score}
            </span>
            <span>
              <Stars size={15} />
              <span className="mt-1 block text-[12px] text-ink-soft">{RATING.basis}</span>
            </span>
          </div>
        </Reveal>
      </div>

      {/* Marquee bleeds to the viewport edge; the mask fades both ends. */}
      <Reveal className="mt-8">
        <InfiniteMovingCards items={items} speed="slow" pauseOnHover className="w-full max-w-none" />
      </Reveal>
    </section>
  );
}

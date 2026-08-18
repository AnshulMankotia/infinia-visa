import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/ui/reveal";
import { FAQS } from "@/data/site";

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-28 bg-paper py-20 md:py-24">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] text-brand-strong uppercase">
              Questions? We&rsquo;ve got answers
            </p>
            <h2 className="mt-3 font-heading text-[2rem] text-ink md:text-[2.6rem]">
              Frequently asked questions
            </h2>
          </div>
          <Link
            href="/help"
            className="inline-flex items-center gap-2 rounded-lg border border-brand px-5 py-2.5 text-[13px] font-medium text-brand-strong transition-all duration-200 hover:-translate-y-px hover:bg-brand-tint active:translate-y-0 active:scale-[0.98]"
          >
            Visit Help Center
          </Link>
        </Reveal>

        <Accordion
          type="single"
          collapsible
          defaultValue={FAQS[0].question}
          className="mt-10 grid gap-3"
        >
          {FAQS.map((faq) => (
            <AccordionItem
              key={faq.question}
              value={faq.question}
              className="rounded-xl border border-line bg-surface px-5 transition-colors duration-200 hover:border-brand data-[state=open]:border-brand"
            >
              <AccordionTrigger className="py-4 text-left text-[14px] font-medium text-ink hover:no-underline md:text-[15px]">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="max-w-[80ch] pb-5 text-[13px] leading-relaxed text-ink-soft">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

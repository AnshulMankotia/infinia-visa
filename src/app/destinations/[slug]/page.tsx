import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CountryHero } from "@/components/country/country-hero";
import { ApplyRail } from "@/components/country/apply-rail";
import { AtAGlance } from "@/components/country/at-a-glance";
import { Documents } from "@/components/country/documents";
import { Rejections } from "@/components/country/rejections";
import { TravelNotes } from "@/components/country/travel-notes";
import { ProcessTimeline } from "@/components/country/process-timeline";
import { Related } from "@/components/country/related";
import { MobileApplyBar } from "@/components/country/mobile-apply-bar";
import { Faq } from "@/components/home/faq";
import { Reviews } from "@/components/home/reviews";
import { COUNTRIES, getCountry } from "@/data/countries";

export function generateStaticParams() {
  return COUNTRIES.map((country) => ({ slug: country.slug }));
}

export async function generateMetadata(
  props: PageProps<"/destinations/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const country = getCountry(slug);
  if (!country) return {};

  const title = `${country.name} Visa: Requirements & Fees | Infinia Visa`;

  return {
    title,
    description: country.summary,
    openGraph: {
      title,
      description: country.summary,
      url: `https://visaocr.netlify.app/destinations/${country.slug}`,
      siteName: "Infinia Visa",
      type: "article",
      images: [country.image],
    },
    twitter: { card: "summary_large_image", images: [country.image] },
  };
}

/**
 * Country page: corridor hero, then a two-column body (facts, documents, refusal
 * reasons, travel notes beside the sticky apply rail), then the shared process,
 * reviews, FAQ and related-destination sections.
 */
export default async function CountryPage(props: PageProps<"/destinations/[slug]">) {
  const { slug } = await props.params;
  const country = getCountry(slug);
  if (!country) notFound();

  return (
    <>
      <SiteHeader />
      <main id="main" className="pb-20 lg:pb-0">
        <CountryHero country={country} />

        <div className="mx-auto grid max-w-[1280px] gap-10 px-4 pt-16 pb-16 md:px-8 md:pt-20 md:pb-20 lg:grid-cols-[1fr_21rem] lg:gap-14">
          <div className="min-w-0">
            <AtAGlance country={country} />
            <Documents country={country} />
            <Rejections country={country} />
            <TravelNotes country={country} />
          </div>
          <ApplyRail country={country} />
        </div>

        <ProcessTimeline />
        <Reviews />
        <Faq />
        <Related slug={country.slug} />
      </main>
      <SiteFooter />
      <MobileApplyBar country={country} />
    </>
  );
}

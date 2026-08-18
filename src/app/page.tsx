import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Hero } from "@/components/home/hero";
import { Destinations } from "@/components/home/destinations";
import { HowItWorks } from "@/components/home/how-it-works";
import { Reviews } from "@/components/home/reviews";
import { Press } from "@/components/home/press";
import { Faq } from "@/components/home/faq";
import { ClosingCta } from "@/components/home/closing-cta";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Destinations />
        <HowItWorks />
        <Reviews />
        <Press />
        <Faq />
        <ClosingCta />
      </main>
      <SiteFooter />
    </>
  );
}

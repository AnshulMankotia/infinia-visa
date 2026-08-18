import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApplyWizard } from "@/components/apply/apply-wizard";
import { COUNTRIES, getCountry } from "@/data/countries";

export function generateStaticParams() {
  return COUNTRIES.map((country) => ({ slug: country.slug }));
}

export async function generateMetadata(
  props: PageProps<"/apply/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const country = getCountry(slug);
  if (!country) return {};
  return {
    title: `Apply: ${country.name} visa | Infinia Visa`,
    description: `Start your ${country.name} visa application. ${country.processing} processing.`,
    robots: { index: false },
  };
}

export default async function ApplyPage(props: PageProps<"/apply/[slug]">) {
  const { slug } = await props.params;
  const country = getCountry(slug);
  if (!country) notFound();

  return <ApplyWizard country={country} />;
}

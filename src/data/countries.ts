/**
 * Country corridor data.
 *
 * Photography comes from the live Infinia Visa image library (Supabase), keyed by ISO
 * alpha-2. Congo (DRC) and Indonesia carry the figures the live site publishes. Every
 * other corridor is marked `mock: true`: its fees and timings are sample data.
 */

export type VisaDocument = {
  name: string;
  hint: string;
};

export type RejectionReason = {
  title: string;
  body: string;
};

export type Country = {
  slug: string;
  name: string;
  /** ISO 3166-1 alpha-2, used for flag images and the corridor label. */
  iso2: string;
  image: string;
  imageAlt: string;
  visaType: string;
  entry: string;
  stayDays: number | null;
  validity: string;
  /** Decision time as shown on cards. */
  processing: string;
  processingDays: number | null;
  govFee: number | null;
  serviceFee: number | null;
  documents: VisaDocument[];
  rejections: RejectionReason[];
  notes: string[];
  summary: string;
  /** True when the figures above are sample data, not published embassy figures. */
  mock?: boolean;
};

const CDN =
  "https://mhsaogeziwsujxvkycno.supabase.co/storage/v1/object/public/country-images";

const IMAGES: Record<string, string> = {
  TH: `${CDN}/TH/feature-1775632583494.jpg`,
  AE: `${CDN}/AE/feature-1775632594472.jpg`,
  CA: `${CDN}/CA/feature-1775632457371.jpg`,
  IT: `${CDN}/IT/feature-1775632505359.jpg`,
  JP: `${CDN}/JP/feature-1775632508644.jpg`,
  FR: `${CDN}/FR/feature-1775632480234.jpg`,
  CN: `${CDN}/CN/feature-1775632461038.jpg`,
  BR: `${CDN}/BR/feature-1775632449763.jpg`,
  SG: `${CDN}/SG/feature-1775632568515.jpg`,
  GB: `${CDN}/GB/feature-1775632595349.jpg`,
  ID: `${CDN}/ID/feature-1775632501743.jpg`,
  CD: `${CDN}/CD/feature-1775632463411.jpg`,
};

const STANDARD_DOCUMENTS: VisaDocument[] = [
  { name: "Valid passport", hint: "Bio page, PDF or image" },
  { name: "Passport photo", hint: "35x45mm, white background" },
  { name: "Travel itinerary", hint: "PDF or image" },
  { name: "Hotel reservation", hint: "PDF or screenshot" },
];

const STANDARD_REJECTIONS: RejectionReason[] = [
  {
    title: "Expired passport",
    body: "Applying with a passport that has expired or expires within 6 months.",
  },
  {
    title: "Insufficient funds",
    body: "Not having enough financial means to support your trip and stay.",
  },
  {
    title: "Previous visa violations",
    body: "Having overstayed or violated the terms of a previous visa.",
  },
  {
    title: "Unconfirmed bookings",
    body: "Filing with provisional flight or hotel reservations that cannot be verified.",
  },
];

function notesFor(name: string) {
  return [
    `Always ensure your passport has at least 6 months validity before traveling to ${name}.`,
    `Keep digital and physical copies of all your travel documents, including your ${name} visa approval.`,
    `Check the latest entry requirements for ${name} before your departure as regulations may change.`,
  ];
}

export const COUNTRIES: Country[] = [
  {
    slug: "thailand",
    name: "Thailand",
    iso2: "TH",
    image: IMAGES.TH,
    imageAlt: "Temple spires above the treeline in Thailand",
    visaType: "Tourist",
    entry: "Single",
    stayDays: 60,
    validity: "3 months",
    processing: "3-5 days",
    processingDays: 4,
    govFee: 55,
    serviceFee: 14,
    documents: STANDARD_DOCUMENTS,
    rejections: STANDARD_REJECTIONS,
    notes: notesFor("Thailand"),
    summary:
      "Thailand issues a single-entry tourist visa allowing up to 60 days in the country. Apply online with Infinia Visa and we file on the day we promise.",
    mock: true,
  },
  {
    slug: "uae",
    name: "United Arab Emirates",
    iso2: "AE",
    image: IMAGES.AE,
    imageAlt: "Skyline towers at dusk in the United Arab Emirates",
    visaType: "Tourist",
    entry: "Single",
    stayDays: 30,
    validity: "2 months",
    processing: "2-4 days",
    processingDays: 3,
    govFee: 72,
    serviceFee: 17,
    documents: STANDARD_DOCUMENTS,
    rejections: STANDARD_REJECTIONS,
    notes: notesFor("the United Arab Emirates"),
    summary:
      "The United Arab Emirates issues a single-entry tourist visa allowing up to 30 days. Apply online with Infinia Visa and we file on the day we promise.",
    mock: true,
  },
  {
    slug: "canada",
    name: "Canada",
    iso2: "CA",
    image: IMAGES.CA,
    imageAlt: "Mountain lake and pine forest in Canada",
    visaType: "Visitor",
    entry: "Multiple",
    stayDays: 180,
    validity: "10 years",
    processing: "7-10 days",
    processingDays: 9,
    govFee: 105,
    serviceFee: 24,
    documents: STANDARD_DOCUMENTS,
    rejections: STANDARD_REJECTIONS,
    notes: notesFor("Canada"),
    summary:
      "Canada issues a multiple-entry visitor visa allowing stays of up to 180 days per visit. Apply online with Infinia Visa and we file on the day we promise.",
    mock: true,
  },
  {
    slug: "italy",
    name: "Italy",
    iso2: "IT",
    image: IMAGES.IT,
    imageAlt: "Cliffside village above the sea in Italy",
    visaType: "Schengen",
    entry: "Multiple",
    stayDays: 90,
    validity: "6 months",
    processing: "5-7 days",
    processingDays: 6,
    govFee: 30,
    serviceFee: 9,
    documents: STANDARD_DOCUMENTS,
    rejections: STANDARD_REJECTIONS,
    notes: notesFor("Italy"),
    summary:
      "Italy issues a Schengen visa allowing 90 days of travel in any 180-day period. Apply online with Infinia Visa and we file on the day we promise.",
    mock: true,
  },
  {
    slug: "japan",
    name: "Japan",
    iso2: "JP",
    image: IMAGES.JP,
    imageAlt: "Temple among autumn trees in Japan",
    visaType: "Tourist",
    entry: "Single",
    stayDays: 90,
    validity: "3 months",
    processing: "5-7 days",
    processingDays: 6,
    govFee: 62,
    serviceFee: 17,
    documents: STANDARD_DOCUMENTS,
    rejections: STANDARD_REJECTIONS,
    notes: notesFor("Japan"),
    summary:
      "Japan issues a single-entry tourist visa allowing up to 90 days in the country. Apply online with Infinia Visa and we file on the day we promise.",
    mock: true,
  },
  {
    slug: "france",
    name: "France",
    iso2: "FR",
    image: IMAGES.FR,
    imageAlt: "Boulevard and monument in France",
    visaType: "Schengen",
    entry: "Multiple",
    stayDays: 90,
    validity: "6 months",
    processing: "5-7 days",
    processingDays: 6,
    govFee: 80,
    serviceFee: 19,
    documents: STANDARD_DOCUMENTS,
    rejections: STANDARD_REJECTIONS,
    notes: notesFor("France"),
    summary:
      "France issues a Schengen visa allowing 90 days of travel in any 180-day period. Apply online with Infinia Visa and we file on the day we promise.",
    mock: true,
  },
  {
    slug: "china",
    name: "China",
    iso2: "CN",
    image: IMAGES.CN,
    imageAlt: "The Great Wall running along a ridge in China",
    visaType: "L Visa",
    entry: "Single",
    stayDays: 30,
    validity: "3 months",
    processing: "4-6 days",
    processingDays: 5,
    govFee: 90,
    serviceFee: 19,
    documents: STANDARD_DOCUMENTS,
    rejections: STANDARD_REJECTIONS,
    notes: notesFor("China"),
    summary:
      "China issues the L tourist visa allowing up to 30 days in the country. Apply online with Infinia Visa and we file on the day we promise.",
    mock: true,
  },
  {
    slug: "brazil",
    name: "Brazil",
    iso2: "BR",
    image: IMAGES.BR,
    imageAlt: "Hilltop view over the bay in Brazil",
    visaType: "Tourist",
    entry: "Multiple",
    stayDays: 90,
    validity: "1 year",
    processing: "5-6 days",
    processingDays: 6,
    govFee: 72,
    serviceFee: 17,
    documents: STANDARD_DOCUMENTS,
    rejections: STANDARD_REJECTIONS,
    notes: notesFor("Brazil"),
    summary:
      "Brazil issues a multiple-entry tourist visa allowing up to 90 days per visit. Apply online with Infinia Visa and we file on the day we promise.",
    mock: true,
  },
  {
    slug: "singapore",
    name: "Singapore",
    iso2: "SG",
    image: IMAGES.SG,
    imageAlt: "Waterfront skyline in Singapore",
    visaType: "Tourist",
    entry: "Multiple",
    stayDays: 30,
    validity: "2 years",
    processing: "3-5 days",
    processingDays: 4,
    govFee: 24,
    serviceFee: 9,
    documents: STANDARD_DOCUMENTS,
    rejections: STANDARD_REJECTIONS,
    notes: notesFor("Singapore"),
    summary:
      "Singapore issues a multiple-entry tourist visa allowing up to 30 days per visit. Apply online with Infinia Visa and we file on the day we promise.",
    mock: true,
  },
  {
    slug: "united-kingdom",
    name: "United Kingdom",
    iso2: "GB",
    image: IMAGES.GB,
    imageAlt: "River and clock tower in the United Kingdom",
    visaType: "Standard Visitor",
    entry: "Multiple",
    stayDays: 180,
    validity: "6 months",
    processing: "10-15 days",
    processingDays: 12,
    govFee: 145,
    serviceFee: 29,
    documents: STANDARD_DOCUMENTS,
    rejections: STANDARD_REJECTIONS,
    notes: notesFor("the United Kingdom"),
    summary:
      "The United Kingdom issues a Standard Visitor visa allowing stays of up to 180 days. Apply online with Infinia Visa and we file on the day we promise.",
    mock: true,
  },
  {
    slug: "indonesia",
    name: "Indonesia",
    iso2: "ID",
    image: IMAGES.ID,
    imageAlt: "Terraced rice fields in Indonesia",
    visaType: "Tourist",
    entry: "Single",
    stayDays: 60,
    validity: "3 months",
    processing: "4-6 days",
    processingDays: 5,
    govFee: 25,
    serviceFee: 4,
    documents: [
      { name: "Valid passport", hint: "Bio page, PDF or image" },
      { name: "Passport photo", hint: "35x45mm, white background" },
    ],
    rejections: STANDARD_REJECTIONS,
    notes: notesFor("Indonesia"),
    summary:
      "Indonesia issues a single-entry tourist visa valid for 3 months. Apply online with Infinia Visa and we file on the day we promise.",
  },
  {
    slug: "burkina-faso",
    name: "Burkina Faso",
    iso2: "BF",
    image: `${CDN}/BF/feature-1775632453421.jpg`,
    imageAlt: "Sahel landscape in Burkina Faso",
    visaType: "Tourist",
    entry: "Single",
    stayDays: 90,
    validity: "90 days",
    processing: "~10 days",
    processingDays: 10,
    govFee: 100,
    serviceFee: 10,
    documents: [
      { name: "Passport", hint: "Bio page, PDF or image" },
      { name: "Passport back page", hint: "Back page, image" },
      { name: "Passport photo", hint: "35x45mm, white background" },
    ],
    rejections: [
      {
        title: "Expired passport",
        body: "Applying with a passport that has expired or expires within 6 months.",
      },
      {
        title: "Criminal record",
        body: "Having a criminal history that disqualifies you from obtaining a visa.",
      },
      {
        title: "Previous visa violations",
        body: "Having overstayed or violated the terms of a previous visa.",
      },
      {
        title: "Insufficient funds",
        body: "Not having enough financial means to support your trip and stay.",
      },
    ],
    notes: notesFor("Burkina Faso"),
    summary:
      "Burkina Faso issues a single-entry tourist visa allowing up to 90 days in the country. Apply online with Infinia Visa and we file with the embassy on the day we promise.",
  },
  {
    slug: "congo-drc",
    name: "Congo (DRC)",
    iso2: "CD",
    image: IMAGES.CD,
    imageAlt: "River and rainforest in the Democratic Republic of the Congo",
    visaType: "Tourist (B-2)",
    entry: "Single",
    stayDays: 180,
    validity: "10 years",
    processing: "~7 days",
    processingDays: 7,
    govFee: 100,
    serviceFee: 10,
    documents: [
      { name: "Valid passport", hint: "Bio page, PDF or image" },
      { name: "Passport photo", hint: "35x45mm, white background" },
      { name: "Bank statements", hint: "Last 3 months, PDF" },
      { name: "Travel itinerary", hint: "PDF or image" },
      { name: "Hotel reservation", hint: "PDF or screenshot" },
      { name: "Employment letter", hint: "PDF or image" },
    ],
    rejections: [
      {
        title: "Expired passport",
        body: "Applying with a passport that has expired or expires within 6 months.",
      },
      {
        title: "Criminal record",
        body: "Having a criminal history that disqualifies you from obtaining a visa.",
      },
      {
        title: "Previous visa violations",
        body: "Having overstayed or violated the terms of a previous visa.",
      },
      {
        title: "Insufficient funds",
        body: "Not having enough financial means to support your trip and stay.",
      },
    ],
    notes: notesFor("Congo (DRC)"),
    summary:
      "Congo (DRC) issues a single-entry tourist visa that allows up to 180 days in the country. Apply online with Infinia Visa and we file with the embassy on the day we promise.",
  },
];

/** The eight cards shown on the homepage grid, in order. */
export const FEATURED_SLUGS = [
  "thailand",
  "uae",
  "canada",
  "italy",
  "japan",
  "france",
  "china",
  "brazil",
];

export const FEATURED_COUNTRIES = FEATURED_SLUGS.map(
  (slug) => COUNTRIES.find((country) => country.slug === slug)!,
);

export function getCountry(slug: string): Country | undefined {
  return COUNTRIES.find((country) => country.slug === slug);
}

export function relatedCountries(slug: string, count = 4): Country[] {
  return COUNTRIES.filter((country) => country.slug !== slug).slice(0, count);
}

/** Total price for one traveller, or null when the corridor publishes no government fee. */
export function totalFee(country: Country): number | null {
  if (country.govFee === null) return null;
  return country.govFee + (country.serviceFee ?? 0);
}

export function flagSrc(iso2: string): string {
  return `https://flagcdn.com/w80/${iso2.toLowerCase()}.png`;
}

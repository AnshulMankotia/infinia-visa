/**
 * Site-wide content.
 *
 * Route slugs and FAQ answers are preserved from the live Infinia Visa site. Copy edits
 * are limited to defect fixes (the wrong brand name "Vissa", em-dashes) and to the
 * headings called for by the approved homepage design.
 */

export const SITE = {
  name: "Infinia Visa",
  wordmarkTop: "INFINIA",
  wordmarkBottom: "VISA",
  tagline:
    "Premium visa assistance, designed for modern travelers. Anywhere in the world.",
};

export const NAV_LINKS = [
  { label: "Destinations", href: "/destinations" },
  { label: "How it works", href: "/#how" },
  { label: "About", href: "/about" },
  { label: "Reviews", href: "/#reviews" },
  { label: "Resources", href: "/help" },
];

export const CTA = {
  start: { label: "Get started", href: "/destinations" },
  apply: { label: "Start your application", href: "/destinations" },
  signIn: { label: "Log in", href: "/login" },
};

export const HERO = {
  eyebrow: "Premium. Personal. Trusted.",
  headlineBefore: "Apply for ",
  headlineEmphasis: "any",
  headlineAfter: " visa online, from your phone.",
  subtext:
    "Fast, secure and reliable. Our experts simplify the visa process so you can focus on your journey.",
  image:
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=2000&q=80&auto=format&fit=crop",
  imageAlt: "Aircraft wing above a cloud layer at sunrise",
};

/**
 * Closing band. Wing over a golden dusk cloudscape (Javier Quiroga, Unsplash), a
 * different frame from the hero so the page does not repeat itself.
 */
export const CLOSING = {
  image:
    "https://images.unsplash.com/photo-1638593830027-f861eb6cff00?w=2000&q=80&auto=format&fit=crop",
  stats: [
    { value: "50,000+", label: "travelers trusted us" },
    { value: "99.4%", label: "visas delivered on time" },
    { value: "4.9", label: "average review score" },
  ],
};

/** Reassurance strip directly under the search card. */
export const TRUST_ITEMS = [
  { icon: "users", label: "Trusted by 50,000+ travelers" },
  { icon: "shield", label: "Secure & encrypted" },
  { icon: "clock", label: "99.4% on-time approvals" },
  { icon: "headset", label: "24/7 expert support" },
];

export const HOW_IT_WORKS = [
  {
    title: "Select your visa",
    body: "Choose your destination and we'll guide you to the right visa.",
    icon: "compass",
  },
  {
    title: "Complete the form",
    body: "Answer a few questions and upload your documents securely.",
    icon: "form",
  },
  {
    title: "We process it",
    body: "Our experts review your application and handle the rest.",
    icon: "send",
  },
  {
    title: "Receive by email",
    body: "Get your approved visa delivered straight to your inbox.",
    icon: "mail",
  },
];

/** Country-page process, four steps with the party responsible for each. */
export const APPLICATION_STEPS = [
  {
    owner: "You",
    title: "Submit your application",
    body: "Pick your travel dates, scan your passport, and upload the required documents, all from your phone.",
  },
  {
    owner: "Our team",
    title: "We verify your documents",
    body: "Our team checks every field and document for accuracy, then submits your application to the authorities.",
  },
  {
    owner: "Embassy",
    title: "Your visa gets processed",
    body: "We track your application with the embassy or immigration until a decision is made.",
  },
  {
    owner: "You",
    title: "Receive your visa by email",
    body: "Your approved visa lands in your inbox, ready to print before you travel.",
  },
];

export type Review = {
  quote: string;
  name: string;
  initials: string;
  role: string;
};

export const RATING = {
  score: "4.9",
  basis: "Based on 8,400+ reviews",
  breakdown: [
    { label: "Excellent", percent: 95, display: "95%" },
    { label: "Great", percent: 4, display: "4%" },
    { label: "Average", percent: 1, display: "1%" },
    { label: "Poor", percent: 0.5, display: "<1%" },
  ],
};

export const REVIEWS: Review[] = [
  {
    quote:
      "Infinia Visa made my Schengen visa process effortless. Fast, clear, and super professional.",
    name: "Aarav Mehta",
    initials: "AM",
    role: "Mumbai, India",
  },
  {
    quote:
      "I got my tourist visa to Canada in 6 days. The team kept me updated at every step.",
    name: "Rehana Kapoor",
    initials: "RK",
    role: "Bangalore, India",
  },
  {
    quote:
      "Fantastic experience. Simple process and great support. Highly recommended.",
    name: "Layla Al Mansoori",
    initials: "LM",
    role: "Dubai, UAE",
  },
  {
    quote:
      "Filed for my parents and myself in one go. Three visas, one dashboard, zero stress.",
    name: "Daniel Okafor",
    initials: "DO",
    role: "London, UK",
  },
  {
    quote:
      "The document checklist told me exactly what to upload. Approved without a single follow-up question.",
    name: "Mei-Ling Chen",
    initials: "MC",
    role: "Singapore",
  },
  {
    quote:
      "Our HR team files every business visa here now. The delivery date has never slipped.",
    name: "Priya Nair",
    initials: "PN",
    role: "Sydney, Australia",
  },
];

/**
 * Press row. Rendered as typeset wordmarks rather than trademarked logo files, and the
 * heading is worded so it reads as a design placeholder until real coverage exists.
 */
export const PRESS = [
  { name: "Forbes", className: "font-heading text-2xl tracking-tight" },
  { name: "Condé Nast Traveler", className: "font-heading text-lg tracking-tight" },
  { name: "CNBC", className: "text-xl font-extrabold tracking-tight" },
  { name: "The Wall Street Journal", className: "font-heading text-sm tracking-tight" },
  { name: "Travel + Leisure", className: "text-xs font-semibold tracking-[0.2em] uppercase" },
  { name: "Bloomberg", className: "text-xl font-bold tracking-tight" },
];

export const FAQS = [
  {
    question: "How does the online visa application work?",
    answer:
      "Fill out our simple form, upload the required documents, and pay securely online. Our experts review your application and keep you updated until your visa is approved.",
  },
  {
    question: "What happens if my visa is delayed?",
    answer:
      "Every country card carries an exact guaranteed delivery timestamp. If we miss it, we refund the full fee within seven business days. There is no exception clause.",
  },
  {
    question: "Which documents do I need to apply?",
    answer:
      "It depends on the destination. Each country detail page lists the required document set up front, and our system tells you which of your stored documents satisfy each requirement. No surprises after payment.",
  },
  {
    question: "Can I track my application status online?",
    answer:
      "Yes. You receive status updates at each stage: filing, biometrics, embassy review, decision, and passport return. The dashboard shows a live timeline with timestamps.",
  },
  {
    question: "Do you handle business and family visas?",
    answer:
      "Yes. The same flow works for tourist, business, transit, and family applications. SMB administrators can manage staff filings from a single account, and family bookers can attach dependents to one submission.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Documents are stored encrypted at rest and transmitted over TLS 1.3. We retain application data only as long as required by the destination country and our compliance obligations. You can request deletion any time after the visa is issued.",
  },
];

export const FOOTER_GROUPS = [
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Careers", href: "/about" },
      { label: "Press", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "All destinations", href: "/destinations" },
      { label: "Visa types", href: "/destinations" },
      { label: "Pricing", href: "/pricing" },
      { label: "How it works", href: "/#how" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Document checklist", href: "/documents" },
      { label: "Visa requirements", href: "/help" },
      { label: "Travel advice", href: "/blog" },
      { label: "Help center", href: "/help" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of service", href: "/terms" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Refund policy", href: "/refunds" },
      { label: "Cookie policy", href: "/privacy" },
    ],
  },
];

export const SOCIAL_LINKS = [
  { name: "Instagram", href: "https://instagram.com", icon: "instagram" },
  { name: "Facebook", href: "https://facebook.com", icon: "facebook" },
  { name: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
  { name: "YouTube", href: "https://youtube.com", icon: "youtube" },
];

/** Nationalities offered by the corridor search. */
export const NATIONALITIES = [
  { code: "US", label: "United States" },
  { code: "GB", label: "United Kingdom" },
  { code: "IN", label: "India" },
  { code: "AE", label: "United Arab Emirates" },
  { code: "SG", label: "Singapore" },
  { code: "CA", label: "Canada" },
  { code: "AU", label: "Australia" },
  { code: "DE", label: "Germany" },
];

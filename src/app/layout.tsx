import type { Metadata } from "next";
import { Inter, Libre_Caslon_Text } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/smooth-scroll";

/** Headline face, preserved from the live site. */
const display = Libre_Caslon_Text({
  variable: "--font-display",
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

/** Body and UI face, preserved from the live site. */
const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

/** Fees, dates and corridor codes reuse Inter with tabular figures. */
const numeric = Inter({
  variable: "--font-numeric",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://visaocr.netlify.app"),
  title: "Infinia Visa | AI-Powered Visa Processing Made Simple",
  description:
    "Apply for visas to 50+ countries with AI passport scanning. Real embassy fees, guaranteed delivery dates, and a full refund if we miss them.",
  applicationName: "Infinia Visa",
  openGraph: {
    title: "Infinia Visa | AI-Powered Visa Processing Made Simple",
    description:
      "Apply for visas to 50+ countries with AI passport scanning. Real embassy fees, guaranteed delivery dates, and a full refund if we miss them.",
    url: "https://visaocr.netlify.app",
    siteName: "Infinia Visa",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // Theme is locked to light for the whole site. No `dark` class is ever applied.
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${body.variable} ${numeric.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-ground text-ink">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}

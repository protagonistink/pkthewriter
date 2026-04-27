import type { Metadata } from "next";
import { Caveat, Newsreader, Space_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeBoundary } from "@/components/ThemeBoundary";
import { LightSwitchHost } from "@/components/LightSwitchHost";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const caveat = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3003"),
  title: { default: "Patrick Kirkland — writer and creative director", template: "%s — Patrick Kirkland" },
  description: "Writer and creative director. Ask me what you want to see.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Patrick Kirkland — writer and creative director",
    description: "Writer and creative director. Ask me what you want to see.",
    type: "website",
    images: [{ url: "/about-patrick.jpg", width: 1200, height: 630, alt: "Patrick Kirkland" }],
  },
  twitter: { card: "summary_large_image", images: ["/about-patrick.jpg"] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${spaceMono.variable} ${caveat.variable}`}>
      <body>
        <a href="#main" className="skip-to-content">Skip to content</a>
        <ThemeBoundary />
        {children}
        <LightSwitchHost />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

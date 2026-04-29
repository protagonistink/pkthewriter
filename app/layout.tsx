import type { Metadata } from "next";
import { Caveat, Newsreader, Space_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeBoundary } from "@/components/ThemeBoundary";
import { ThemeProvider } from "@/components/ThemeProvider";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://pkthewriter.com"),
  title: { default: "Patrick Kirkland | writer and creative director", template: "%s | Patrick Kirkland" },
  description: "Patrick Kirkland | freelance writer and creative director. 20+ years. Verizon, AT&T, Chevron, Warner Bros., Airtable.",
  alternates: {
    canonical: "/",
  },
  icons: {
    shortcut: "/favicon.ico",
    icon: [
      { url: "/icon-light.png", media: "(prefers-color-scheme: light)", sizes: "64x64", type: "image/png" },
      { url: "/icon-dark.png",  media: "(prefers-color-scheme: dark)",  sizes: "64x64", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Patrick Kirkland | writer and creative director",
    description: "Patrick Kirkland | freelance writer and creative director. 20+ years. Verizon, AT&T, Chevron, Warner Bros., Airtable.",
    type: "website",
    images: [{ url: "/about-patrick.jpg", width: 1200, height: 630, alt: "Patrick Kirkland" }],
  },
  twitter: { card: "summary_large_image", images: ["/about-patrick.jpg"] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${spaceMono.variable} ${caveat.variable}`}>
      <body>
        <ThemeProvider>
          <a href="#main" className="skip-to-content">Skip to content</a>
          <ThemeBoundary />
          {children}
          <LightSwitchHost />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}

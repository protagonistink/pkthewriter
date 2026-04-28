type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pkthewriter.com";

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Patrick Kirkland",
  url: BASE,
  image: `${BASE}/about-patrick.jpg`,
  jobTitle: "Writer & Creative Director",
  description:
    "Freelance writer and creative director with 20+ years. Clients include Verizon, AT&T, Chevron, Warner Bros., and Airtable.",
  sameAs: [
    "https://www.linkedin.com/in/patrickkirkland/",
  ],
};

export const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Patrick Kirkland",
  url: BASE,
};

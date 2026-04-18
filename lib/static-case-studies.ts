/**
 * Static case-study fallbacks for slugs that don't exist in Sanity yet.
 *
 * The landing-page feature cards (lib/feature-static.ts) offer CTAs to
 * /work/verizon|apple|mercedes. If Sanity has no project at that slug we
 * still render an editorial case-study page from these fixtures, so the
 * flow never hits a 404.
 */

import type { Project } from "@/lib/sanity/types";

type StaticProject = Omit<Project, "_id" | "_type" | "slug" | "heroImage" | "mainImage" | "gallery" | "editorialScreenshots">;

const stub = {
  _id: "static",
  _type: "project" as const,
};

const VERIZON: Project = {
  ...stub,
  title: "Verizon",
  slug: { current: "verizon" },
  brand: "Verizon",
  year: "2017–2024",
  type: "Brand identity & campaign",
  role: "Creative Director · Lead Copywriter",
  context:
    "Seven years of shifting a massive telecom ship. Not a single ad — an ecosystem. The voice had to work in a thirty-second spot, in a retail window, in an onboarding screen, and in a retention email that a customer reads at 11pm. Consistency without monotony. That was the assignment.",
  disciplines: ["Brand voice", "Campaign", "UX writing", "Retail", "Retention"],
  deliverables: [
    "Brand voice guidelines",
    "TV & film (50+ spots)",
    "OOH / retail",
    "Digital / product UX",
    "CRM / retention system",
  ],
  impact: [
    "NPS +18 over seven years",
    "Retention copy A/B lift: +11%",
    "Two Effies, one Cannes shortlist",
  ],
  editorialSections: [
    {
      sectionTitle: "Finding a voice the network could trust",
      copyBlock: [
        {
          _type: "block",
          _key: "verizon-01-a",
          style: "normal",
          children: [
            {
              _type: "span",
              _key: "verizon-01-a1",
              text:
                "A telecom the size of Verizon talks to the customer in a hundred places at once. The voice had to behave across all of them — warm in a retail window, technical in an engineer's changelog, patient in a billing dispute. The first thing we did was stop writing copy and start writing rules. The voice guidelines became the spine; the ads, the UX, and the retention flow all hung off it.",
              marks: [],
            },
          ],
        },
      ],
    },
    {
      sectionTitle: "Writing the ecosystem, not the ad",
      copyBlock: [
        {
          _type: "block",
          _key: "verizon-02-a",
          style: "normal",
          children: [
            {
              _type: "span",
              _key: "verizon-02-a1",
              text:
                "A thirty-second spot is the showiest thing a writer on this account makes, and also the least interesting. The real work was in the twelve thousand strings of product UX, the onboarding flows that had to sound like the TV and feel like the app, and the retention emails that landed at 11pm when a customer was considering leaving. The ad is the front door. The ecosystem is the house.",
              marks: [],
            },
          ],
        },
      ],
    },
    {
      sectionTitle: "What seven years teaches you",
      copyBlock: [
        {
          _type: "block",
          _key: "verizon-03-a",
          style: "normal",
          children: [
            {
              _type: "span",
              _key: "verizon-03-a1",
              text:
                "Consistency is not the enemy of surprise. A brand voice held tightly enough gives you room to be strange inside it — a pun in a billing flow, a single paragraph of first-person copy in an otherwise institutional annual report. The audience notices. The brief never asks for it. Do it anyway.",
              marks: [],
            },
          ],
        },
      ],
    },
  ],
};

const APPLE: Project = {
  ...stub,
  title: "Apple",
  slug: { current: "apple" },
  brand: "Apple",
  year: "2021–2023",
  type: "UX writing & product voice",
  role: "Senior Copywriter · UX Writing",
  context:
    "Subtraction. You are not writing for the product; you are getting out of its way. A single adjective can cost you a week. A single exclamation mark can cost you your job. Restraint, as a system.",
  disciplines: ["UX writing", "Onboarding", "Product voice"],
  deliverables: ["Onboarding flows", "In-app tone system", "Launch moments"],
  impact: [
    "Onboarding drop-off −9%",
    "Support tickets for setup −14%",
  ],
  editorialSections: [
    {
      sectionTitle: "Less word, more product",
      copyBlock: [
        {
          _type: "block",
          _key: "apple-01-a",
          style: "normal",
          children: [
            {
              _type: "span",
              _key: "apple-01-a1",
              text:
                "At Apple, every word competes with the product itself. If the interface already says it, the copy shouldn't. If the interaction already feels right, the copy shouldn't announce it. The job is to notice what the product already does and get out of the way.",
              marks: [],
            },
          ],
        },
      ],
    },
  ],
};

const MERCEDES: Project = {
  ...stub,
  title: "Mercedes-Benz",
  slug: { current: "mercedes" },
  brand: "Mercedes-Benz",
  year: "2020–2022",
  type: "Film & brand voice",
  role: "Creative Director",
  context:
    "Luxury asks you to trust the audience. We built a voice that whispered where competitors shouted — long-copy print, a film series with real directors, and a brand book that treated silence as a design element.",
  disciplines: ["Brand voice", "Film", "Long-form print"],
  deliverables: ["Brand book", "Film series (3)", "Long-copy print"],
  impact: ["Brand affinity +7%", "Reel played in pitches for 18 months"],
  editorialSections: [
    {
      sectionTitle: "Trust the audience",
      copyBlock: [
        {
          _type: "block",
          _key: "mb-01-a",
          style: "normal",
          children: [
            {
              _type: "span",
              _key: "mb-01-a1",
              text:
                "The category shouts. We wrote quietly. A paragraph of long copy where the category runs a headline. A two-minute film where the category runs fifteen seconds. Given a little more room, the audience tends to lean in.",
              marks: [],
            },
          ],
        },
      ],
    },
  ],
};

const MAP: Record<string, Project> = {
  verizon: VERIZON,
  apple: APPLE,
  mercedes: MERCEDES,
};

export function staticCaseStudy(slug: string): Project | null {
  return MAP[slug] ?? null;
}

export type { StaticProject };

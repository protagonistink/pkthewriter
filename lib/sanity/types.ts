import type { PortableTextBlock } from "@portabletext/react";

export type SanityImage = {
  asset: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number };
};

export type SanityFile = {
  asset: { _ref: string; url: string };
};

export type Project = {
  _id: string;
  _type: "project";
  title: string;
  slug: { current: string };
  brand?: string;
  role?: string;
  year?: string;
  type?: string;
  featured?: boolean;
  customLayout?: "standard" | "editorial-multimedia";
  heroImage?: SanityImage;
  mainImage?: SanityImage;
  context?: string;
  // Older docs stored these as plain strings; newer ones as Portable Text.
  conflict?: string | PortableTextBlock[];
  resolution?: string | PortableTextBlock[];
  disciplines?: string[];
  deliverables?: string[];
  impact?: string[];
  videoLinks?: Array<{
    title: string;
    url: string;
    platform?: "vimeo" | "youtube";
    thumbnail?: SanityImage;
    description?: string;
    duration?: string;
  }>;
  gallery?: SanityImage[];
  editorialScreenshots?: Array<{
    image: SanityImage;
    label?: string;
    caption?: string;
    layoutType?: "full" | "split" | "grid-3" | "grid-4";
  }>;
  editorialSections?: Array<{
    sectionTitle?: string;
    copyBlock?: PortableTextBlock[];
    video?: { url: string; platform: "vimeo" | "youtube"; thumbnail?: SanityImage };
    images?: Array<{ image: SanityImage; caption?: string }>;
    backgroundColor?: "white" | "lightGray" | "beige" | "blue" | "dark";
  }>;
};

export type WritingClip = {
  _id: string;
  _type: "writingClip";
  title: string;
  outlet?: string;
  clipType?: "essay" | "story" | "column" | "interview" | "other";
  year?: string;
  url: string;
  excerpt?: string;
  featured?: boolean;
};

export type Screenplay = {
  _id: string;
  _type: "screenplay";
  title: string;
  logline?: string;
  genre?: string;
  status?: "development" | "complete" | "optioned" | "produced";
  year?: string;
  coverImage?: SanityImage;
  samplePdf?: SanityFile;
  externalUrl?: string;
};

export type AboutPage = {
  _id: string;
  _type: "aboutPage";
  headline?: string;
  bio?: PortableTextBlock[];
  photo?: SanityImage;
  resumePdf?: SanityFile;
  email?: string;
  linkedinUrl?: string;
  socialLinks?: Array<{ label: string; url: string }>;
};

export type SuggestionItem =
  | ({ _kind: "project" } & Pick<Project, "_id" | "title" | "slug" | "year" | "brand" | "mainImage"> & { excerpt?: string })
  | ({ _kind: "writingClip" } & Pick<WritingClip, "_id" | "title" | "outlet" | "clipType" | "year" | "url" | "excerpt">)
  | ({ _kind: "screenplay" } & Pick<Screenplay, "_id" | "title" | "year" | "logline" | "externalUrl">);

export type SuggestionSet = {
  _id: string;
  _type: "suggestionSet";
  items: SuggestionItem[];
};

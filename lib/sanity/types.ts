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
  conflict?: PortableTextBlock[];
  resolution?: PortableTextBlock[];
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

export type Story = {
  _id: string;
  _type: "story";
  title: string;
  slug: { current: string };
  excerpt?: string;
  body?: PortableTextBlock[];
  year?: string;
  coverImage?: SanityImage;
  featured?: boolean;
};

export type BlogPost = {
  _id: string;
  _type: "blogPost";
  title: string;
  outlet?: string;
  year?: string;
  url: string;
  excerpt?: string;
  coverImage?: SanityImage;
  featured?: boolean;
};

export type Screenplay = {
  _id: string;
  _type: "screenplay";
  title: string;
  logline?: string;
  genre?: string;
  status?: "spec" | "optioned" | "produced";
  year?: string;
  coverImage?: SanityImage;
  samplePdf?: SanityFile;
  externalUrl?: string;
};

export type AboutPage = {
  _id: string;
  _type: "aboutPage";
  bio?: PortableTextBlock[];
  photo?: SanityImage;
  resumePdf?: SanityFile;
  email?: string;
  socialLinks?: Array<{ label: string; url: string }>;
};

export type SuggestionItem =
  | ({ _kind: "project" } & Pick<Project, "_id" | "title" | "slug" | "year" | "brand" | "type" | "mainImage">)
  | ({ _kind: "story" } & Pick<Story, "_id" | "title" | "slug" | "year" | "coverImage" | "excerpt">)
  | ({ _kind: "blogPost" } & Pick<BlogPost, "_id" | "title" | "outlet" | "year" | "url" | "coverImage" | "excerpt">);

export type SuggestionSet = {
  _id: string;
  _type: "suggestionSet";
  items: SuggestionItem[];
};

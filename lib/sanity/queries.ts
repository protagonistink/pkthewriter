export const suggestionSetQuery = /* groq */ `
  *[_type == "suggestionSet"][0]{
    _id,
    _type,
    "items": coalesce(items[]->{
      _id,
      _type,
      title,
      "slug": slug,
      year,
      brand,
      outlet,
      url,
      logline,
      "excerpt": coalesce(excerpt, context, logline),
      "coverImage": coalesce(coverImage, mainImage),
      "_kind": _type
    }, [])
  }
`;

export const featuredCaseStudiesQuery = /* groq */ `
  *[_type == "project" && featured == true && defined(slug.current)] | order(year desc)[0...12]{
    _id,
    title,
    slug,
    brand,
    year,
    "mainImage": mainImage,
    "excerpt": context
  }
`;

export const caseStudyBySlugQuery = /* groq */ `
  *[_type == "project" && slug.current == $slug][0]{
    ...,
    "videoLinks": videoLinks[]{
      title, url, platform, description, duration,
      "thumbnail": thumbnail
    },
    "gallery": gallery[]{
      "asset": asset
    }
  }
`;

export const writingClipsQuery = /* groq */ `
  *[_type == "writingClip" && featured == true] | order(year desc)[0...24]{
    _id, _type, title, outlet, clipType, year, url, excerpt
  }
`;

export const screenplaysQuery = /* groq */ `
  *[_type == "screenplay"] | order(year desc){
    _id, title, logline, genre, status, year,
    "coverImage": coverImage,
    "samplePdf": samplePdf{ "asset": asset-> },
    externalUrl
  }
`;

export const aboutPageQuery = /* groq */ `
  *[_type == "aboutPage"][0]{
    ...,
    "resumePdf": resumePdf{ "asset": asset-> }
  }
`;

/**
 * Landing feature-card preload — returns a lookup of the eight brand
 * projects by their slug. Writing is intentionally excluded until a
 * writingClip doc exists; the resolver falls back to static copy.
 */
export const featureCardsQuery = /* groq */ `
  {
    "airtable":   *[_type == "project" && slug.current == "airtable"][0]   { "slug": slug.current, title, brand, year, type, "excerpt": context, "coverImage": coalesce(heroImage, mainImage) },
    "bp":         *[_type == "project" && slug.current == "bp"][0]         { "slug": slug.current, title, brand, year, type, "excerpt": context, "coverImage": coalesce(heroImage, mainImage) },
    "techsure":   *[_type == "project" && slug.current == "techsure"][0]   { "slug": slug.current, title, brand, year, type, "excerpt": context, "coverImage": coalesce(heroImage, mainImage) },
    "verizon-up": *[_type == "project" && slug.current == "verizon-up"][0] { "slug": slug.current, title, brand, year, type, "excerpt": context, "coverImage": coalesce(heroImage, mainImage) },
    "chevron":    *[_type == "project" && slug.current == "chevron"][0]    { "slug": slug.current, title, brand, year, type, "excerpt": context, "coverImage": coalesce(heroImage, mainImage) },
    "warnerbros": *[_type == "project" && slug.current == "warnerbros"][0] { "slug": slug.current, title, brand, year, type, "excerpt": context, "coverImage": coalesce(heroImage, mainImage) },
    "att":        *[_type == "project" && slug.current == "att"][0]        { "slug": slug.current, title, brand, year, type, "excerpt": context, "coverImage": coalesce(heroImage, mainImage) },
    "mpa":        *[_type == "project" && slug.current == "mpa"][0]        { "slug": slug.current, title, brand, year, type, "excerpt": context, "coverImage": coalesce(heroImage, mainImage) }
  }
`;

type RawProject = {
  slug: string;
  title: string;
  brand?: string;
  year?: string;
  type?: string;
  excerpt?: string;
  coverImage?: { asset: { _ref: string; _type: "reference" } };
};

export type FeatureCardsResult = {
  airtable: RawProject | null;
  bp: RawProject | null;
  techsure: RawProject | null;
  "verizon-up": RawProject | null;
  chevron: RawProject | null;
  warnerbros: RawProject | null;
  att: RawProject | null;
  mpa: RawProject | null;
};

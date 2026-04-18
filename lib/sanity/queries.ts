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
 * Landing feature-card preload — returns a lookup for the three brand cards
 * plus the latest featured writing clip, all in one round trip.
 */
export const featureCardsQuery = /* groq */ `
  {
    "verizon": *[_type == "project" && defined(slug.current) && lower(brand) match "verizon*"] | order(year desc)[0]{
      "slug": slug.current, title, brand, year, type, "excerpt": context,
      "coverImage": coalesce(heroImage, mainImage)
    },
    "apple": *[_type == "project" && defined(slug.current) && lower(brand) match "apple*"] | order(year desc)[0]{
      "slug": slug.current, title, brand, year, type, "excerpt": context,
      "coverImage": coalesce(heroImage, mainImage)
    },
    "mercedes": *[_type == "project" && defined(slug.current) && (lower(brand) match "mercedes*" || lower(brand) match "*benz*")] | order(year desc)[0]{
      "slug": slug.current, title, brand, year, type, "excerpt": context,
      "coverImage": coalesce(heroImage, mainImage)
    },
    "writing": *[_type == "writingClip" && featured == true] | order(year desc)[0]{
      title, outlet, clipType, year, url, excerpt
    }
  }
`;

export type FeatureCardsResult = {
  verizon: RawProject | null;
  apple: RawProject | null;
  mercedes: RawProject | null;
  writing: RawWriting | null;
};

type RawProject = {
  slug: string;
  title: string;
  brand?: string;
  year?: string;
  type?: string;
  excerpt?: string;
  coverImage?: { asset: { _ref: string; _type: "reference" } };
};

type RawWriting = {
  title: string;
  outlet?: string;
  clipType?: string;
  year?: string;
  url: string;
  excerpt?: string;
};

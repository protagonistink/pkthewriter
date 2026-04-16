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
      "excerpt": coalesce(excerpt, context),
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

export const featuredWritingQuery = /* groq */ `
  {
    "stories": *[_type == "story" && featured == true] | order(year desc)[0...12]{
      _id, _type, title, slug, year, excerpt, coverImage
    },
    "blogPosts": *[_type == "blogPost" && featured == true] | order(year desc)[0...12]{
      _id, _type, title, outlet, year, url, excerpt, coverImage
    }
  }
`;

export const storyBySlugQuery = /* groq */ `
  *[_type == "story" && slug.current == $slug][0]
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

import type { MetadataRoute } from "next";
import { sanityClient } from "@/lib/sanity/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pkthewriter.com";
  const projects = await sanityClient
    .fetch<Array<{ slug: { current: string }; _updatedAt: string }>>(
      `*[_type == "project" && defined(slug.current)]{ "slug": slug, _updatedAt }`
    )
    .catch(() => []);
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${base}/work`, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${base}/about`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${base}/writing`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${base}/screenwriting`, changeFrequency: "monthly" as const, priority: 0.6 },
  ];
  const workRoutes = projects.map((p) => ({
    url: `${base}/work/${p.slug.current}`,
    lastModified: new Date(p._updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  return [...staticRoutes, ...workRoutes];
}

import type { MetadataRoute } from "next";
import { sanityClient } from "@/lib/sanity/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3003";
  const projects = await sanityClient.fetch<Array<{ slug: { current: string } }>>(
    `*[_type == "project" && defined(slug.current)]{ "slug": slug }`
  );
  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/work",
    "/writing",
    "/about",
    "/screenwriting",
  ].map((r) => ({ url: `${base}${r}`, lastModified: new Date() }));
  const workRoutes = projects.map((p) => ({
    url: `${base}/work/${p.slug.current}`,
    lastModified: new Date(),
  }));
  return [...staticRoutes, ...workRoutes];
}

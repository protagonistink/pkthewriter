import Link from "next/link";
import { sanityClient } from "@/lib/sanity/client";
import { featuredCaseStudiesQuery } from "@/lib/sanity/queries";
import { CanvasTakeover } from "@/components/canvas/CanvasTakeover";
import { urlForImage } from "@/lib/sanity/image";
import type { Project } from "@/lib/sanity/types";

export const revalidate = 60;

export const metadata = { title: "Case studies — Patrick" };

export default async function WorkIndex() {
  const projects = await sanityClient.fetch<Project[]>(featuredCaseStudiesQuery);

  return (
    <CanvasTakeover>
      <h1 className="font-voice text-3xl mb-8">Case studies</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {projects.map((p) => (
          <li key={p._id}>
            <Link href={`/work/${p.slug.current}`} className="group block">
              {p.mainImage && (
                <div className="aspect-[4/3] bg-[var(--color-paper-surface)] border border-[var(--color-paper-border)] overflow-hidden">
                  <img
                    src={urlForImage(p.mainImage).width(800).url()}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
                  />
                </div>
              )}
              <div className="mt-3">
                <div className="font-medium">{p.title}</div>
                <div className="font-voice text-sm text-[var(--color-paper-text-muted)]">
                  {[p.brand, p.year].filter(Boolean).join(" • ")}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {projects.length === 0 && (
        <p className="font-voice text-[var(--color-paper-text-muted)]">
          No featured case studies yet. Mark some <code>project</code> docs as <code>featured: true</code> in Sanity.
        </p>
      )}
    </CanvasTakeover>
  );
}

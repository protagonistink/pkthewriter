/**
 * One-off: patches slug.current onto every existing Sanity `project` doc.
 *
 * Run: npm run sanity:backfill-slugs
 *
 * Requires SANITY_WRITE_TOKEN in .env.local (Editor role or higher).
 */

import { config } from "dotenv";
import { createClient } from "@sanity/client";

config({ path: ".env.local" });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-03-01";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, or SANITY_WRITE_TOKEN in .env.local");
  process.exit(1);
}

const SLUGS: Record<string, string> = {
  "097f287e-7d5d-471e-b9e8-2c3132eeb714": "airtable",
  "22582425-2275-4dbc-9544-94953ae90930": "bp",
  "50a7c7ad-a84e-4f86-aaff-d9573bcc7e58": "techsure",
  "7e640024-60bf-4d4c-8537-54c84ce7f6dc": "verizon-up",
  "8088ad4c-c819-4854-a6f8-cc11e00cc4f9": "chevron",
  "93255641-bb98-45bc-b0ac-99035b92afed": "warnerbros",
  "d8e8d67f-3106-46af-a0d7-6d1cad2da5b7": "att",
  "d9da289a-48c4-46dc-b045-fbf7a9757e31": "mpa",
};

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

async function main() {
  const ids = Object.keys(SLUGS);
  console.log(`Patching ${ids.length} project docs...`);

  for (const id of ids) {
    const slug = SLUGS[id];
    const result = await client
      .patch(id)
      .set({ slug: { _type: "slug", current: slug } })
      .commit();
    console.log(`  ${id.slice(0, 8)}… → slug=${slug}  (rev=${result._rev})`);
  }

  console.log("Done. Verifying...");
  const query = `*[_type == "project" && defined(slug.current)]{_id, title, "slug": slug.current} | order(slug)`;
  const verified = await client.fetch<Array<{ _id: string; title: string; slug: string }>>(query);
  for (const row of verified) {
    console.log(`  ✓ ${row.slug.padEnd(14)} — ${row.title}`);
  }
  if (verified.length !== ids.length) {
    console.error(`Expected ${ids.length} slugged projects, got ${verified.length}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

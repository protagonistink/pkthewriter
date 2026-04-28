// NEXT_PUBLIC_ vars must use direct property access so Next.js can inline
// them into client bundles at build time. Dynamic `process.env[name]` access
// defeats that static analysis and strands the browser with undefined.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-03-01";
export const readToken = process.env.SANITY_READ_TOKEN;

// Warn in dev; don't throw at module evaluation time so builds without
// Sanity env vars (e.g. Vercel Preview) can complete — routes already
// catch fetch errors and return null/empty data gracefully.
if ((!projectId || !dataset) && process.env.NODE_ENV === "development") {
  console.warn(
    "Missing Sanity env vars: NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET must be set."
  );
}

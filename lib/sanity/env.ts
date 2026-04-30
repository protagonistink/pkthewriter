// NEXT_PUBLIC_ vars must use direct property access so Next.js can inline
// them into client bundles at build time. Dynamic `process.env[name]` access
// defeats that static analysis and strands the browser with undefined.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "gz4qpupc";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "portfolio";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-03-01";
export const readToken = process.env.SANITY_READ_TOKEN;

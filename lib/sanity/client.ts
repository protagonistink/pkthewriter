import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, readToken } from "./env";

export const sanityClient = createClient({
  projectId: projectId || "placeholder",
  dataset: dataset || "production",
  apiVersion,
  useCdn: true,
  perspective: "published",
  stega: false,
});

export const sanityPreviewClient = createClient({
  projectId: projectId || "placeholder",
  dataset: dataset || "production",
  apiVersion,
  useCdn: false,
  perspective: "drafts",
  token: readToken,
  stega: false,
});

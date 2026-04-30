import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, readToken } from "./env";

const isServer = typeof document === "undefined";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: !isServer,
  token: isServer ? readToken : undefined,
  perspective: "published",
  stega: false,
});

export const sanityPreviewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "drafts",
  token: readToken,
  stega: false,
});

import { createClient } from "@sanity/client";

/*
  Sola lettura. Le query girano lato server, quindi il CORS non serve
  più per il sito: resta solo per lo Studio. La freschezza è gestita
  dall'ISR delle pagine, non dal client.
*/
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "gdqr6s88",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-07-01",
  useCdn: true,
});

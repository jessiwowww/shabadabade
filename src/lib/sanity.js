import { createClient } from "@sanity/client";

/*
  Client Sanity del sito (sola lettura, dataset pubblico).

  Da quando il sito è su Next.js le query girano LATO SERVER: il CORS
  non serve più per il sito (era un vincolo del browser), resta solo
  per lo Studio. Il projectId non è un segreto — sta in una variabile
  d'ambiente per non doverlo cercare nel codice al cambio progetto,
  con il valore attuale come default.

  useCdn: true → risposte dalla CDN di Sanity. La freschezza dei
  contenuti è gestita dall'ISR delle pagine (`export const revalidate`).
*/
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "gdqr6s88",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-07-01",
  useCdn: true,
});

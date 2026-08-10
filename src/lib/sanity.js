import { createClient } from "@sanity/client";

/*
  Client Sanity del sito (sola lettura, dataset pubblico).
  useCdn: true → risposte dalla CDN di Sanity, veloci e cache-ate.

  NOTA CORS: perché il browser possa chiamare l'API, il dominio del
  sito va aggiunto su https://www.sanity.io/manage → progetto →
  API → CORS origins (senza credenziali). Servono:
    - http://localhost:5173  (sviluppo)
    - il dominio pubblico del sito quando andrà online
  Finché il CORS non è configurato o non ci sono contenuti, il sito
  usa automaticamente i dati di esempio.
*/
export const sanityClient = createClient({
  projectId: "gdqr6s88",
  dataset: "production",
  apiVersion: "2026-07-01",
  useCdn: true,
});

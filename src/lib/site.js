/*
  Indirizzo pubblico del sito, usato per sitemap, robots e per rendere
  assoluti i link delle anteprime social.

  Ordine: la variabile esplicita, poi il dominio che Vercel assegna da
  solo, infine il dominio definitivo. Senza il secondo passaggio, finché
  il dominio vero non è attivo le anteprime punterebbero a un indirizzo
  che non risponde.
*/
const daVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (daVercel ? `https://${daVercel}` : "https://sharonbertoncello.com");

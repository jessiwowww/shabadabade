/*
  Immagine di anteprima per le condivisioni (LinkedIn, Instagram,
  WhatsApp): formato 1200×630.
  Le immagini di Sanity si ridimensionano dalla loro CDN aggiungendo i
  parametri all'URL — nessuna elaborazione a carico del nostro server.
*/
export function ogImageUrl(url) {
  if (!url) return null;
  if (!url.includes("cdn.sanity.io")) return url;
  return `${url}?w=1200&h=630&fit=crop&auto=format`;
}

// 1200×630 per le anteprime social; le immagini Sanity si
// ridimensionano dalla loro CDN, senza carico sul nostro server
export function ogImageUrl(url) {
  if (!url) return null;
  if (!url.includes("cdn.sanity.io")) return url;
  return `${url}?w=1200&h=630&fit=crop&auto=format`;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  /*
    Le immagini oggi sono <img> normali con lazy loading: la griglia
    masonry ha bisogno delle proporzioni naturali e le stiamo già
    dichiarando con width/height.
    Prossimo passo per le prestazioni: servire le immagini di Sanity
    ridimensionate dalla loro CDN (?w=&auto=format) — vedi README.
  */
};

export default nextConfig;

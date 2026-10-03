/*
  Contatore condiviso: lightbox e album possono essere aperti insieme
  (l'album si sovrappone). Senza contatore, chiudendo l'album si
  riattiverebbe lo scorrimento della pagina dietro al lightbox ancora
  aperto.
*/
let aperti = 0;

export function bloccaScroll() {
  aperti += 1;
  document.documentElement.style.overflow = "hidden";
  return () => {
    aperti = Math.max(0, aperti - 1);
    if (aperti === 0) document.documentElement.style.overflow = "";
  };
}

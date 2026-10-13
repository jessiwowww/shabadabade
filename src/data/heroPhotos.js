/*
  Temi neutri → foto al tramonto, che porta il colore. Temi colorati
  → foto in bianco e nero coi disegni di tutti i colori: quelli dello
  stesso colore del fondo sparivano, e il risultato cambiava da tema
  a tema.
*/
export const HERO_PHOTOS = {
  nero: "/hero/tramonto-bianco.jpg",
  bianco: "/hero/tramonto-viola.jpg",
};

const COLORATA = "/hero/bn-multicolore.jpg";

export function heroPhotoFor(nomePalette) {
  return HERO_PHOTOS[nomePalette] ?? COLORATA;
}

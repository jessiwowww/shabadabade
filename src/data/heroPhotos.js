/*
  Regola di Sharon: temi neutri → foto al tramonto, che porta il
  colore; temi colorati → foto in bianco e nero coi disegni dello
  stesso colore del tema, così non litiga col fondo.
  giallo e rosa non hanno disegni del loro colore: multicolore.
*/
export const HERO_PHOTOS = {
  nero: "/hero/tramonto-bianco.jpg",
  bianco: "/hero/tramonto-viola.jpg",

  blu: "/hero/bn-blu.jpg",
  viola: "/hero/bn-viola.jpg",
  verde: "/hero/bn-verde.jpg",
  mattone: "/hero/bn-rosso.jpg",
  giallo: "/hero/bn-multicolore.jpg",
  rosa: "/hero/bn-multicolore.jpg",
};

const RIPIEGO = "/hero/bn-multicolore.jpg";

export function heroPhotoFor(nomePalette) {
  return HERO_PHOTOS[nomePalette] ?? RIPIEGO;
}

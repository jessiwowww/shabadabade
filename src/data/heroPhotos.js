/*
  Foto di apertura: cambia insieme al tema.

  I file in public/hero/ seguono due assi:
    · sfondo   → `bn-` foto in bianco e nero, `tramonto-` foto al tramonto
    · disegni  → il colore nel nome (blu, viola, verde, rosso, bianco,
                 multicolore)

  L'abbinamento segue la regola di Sharon:
    · temi neutri (nero, bianco) → foto al TRAMONTO, che sul fondo
      neutro porta il colore
    · temi colorati → foto in BIANCO E NERO, con i disegni dello
      stesso colore del tema, così non litiga con il fondo

  `giallo` e `rosa` non hanno disegni del loro colore: usano la
  versione multicolore, che li contiene entrambi.
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

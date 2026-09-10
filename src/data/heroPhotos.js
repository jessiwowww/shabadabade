/*
  Foto di apertura: cambia insieme al tema.

  Abbinamento PROVVISORIO, in attesa delle versioni definitive di
  Sharon — la logica è la sua:
    · temi neutri (nero, bianco) → versione con i disegni A COLORI,
      che è quella che sui fondi neutri risalta
    · temi colorati (le tempere) → foto in BIANCO E NERO, che non
      litiga con il colore del fondo

  Servono quindi solo due file per partire:
      public/hero/colori.jpg
      public/hero/bianco-e-nero.jpg

  Quando ci saranno le varianti per singolo colore basta cambiare i
  percorsi qui sotto, uno per riga. Finché i file non esistono
  l'apertura mostra il pannello di disegni (HeroArtwork).
*/
export const HERO_PHOTOS = {
  nero: "/hero/colori.jpg",
  bianco: "/hero/colori.jpg",

  blu: "/hero/bianco-e-nero.jpg",
  viola: "/hero/bianco-e-nero.jpg",
  verde: "/hero/bianco-e-nero.jpg",
  mattone: "/hero/bianco-e-nero.jpg",
  giallo: "/hero/bianco-e-nero.jpg",
  rosa: "/hero/bianco-e-nero.jpg",
};

const RIPIEGO = "/hero/bianco-e-nero.jpg";

export function heroPhotoFor(nomePalette) {
  return HERO_PHOTOS[nomePalette] ?? RIPIEGO;
}

/*
  Nel database restano NUMERI: il significato vive qui, quindi
  rinominare una categoria non tocca i contenuti già caricati.
  Due numeri sulla stessa etichetta = due categorie accorpate senza
  rietichettare niente.
*/
export const MACRO = {
  1: "Identity",
  2: "Image",
  3: "Illustration",
  4: "Editorial",
  5: "Exploration",
  6: "Performance",
};

// una voce per etichetta, non per numero
export function macroList() {
  const perEtichetta = new Map();
  for (const [numero, etichetta] of Object.entries(MACRO)) {
    if (!perEtichetta.has(etichetta)) perEtichetta.set(etichetta, []);
    perEtichetta.get(etichetta).push(String(numero));
  }
  return [...perEtichetta.entries()].map(([etichetta, numeri]) => ({
    etichetta,
    numeri,
  }));
}

export function macroLabel(numero) {
  return MACRO[numero] ?? null;
}

// indirizzi: /identity, /illustration… per arrivare già filtrati
export function macroSlug(etichetta) {
  return etichetta.toLowerCase().replace(/\s+/g, "-");
}

export function macroDaSlug(slug) {
  return macroList().find((v) => macroSlug(v.etichetta) === slug) ?? null;
}

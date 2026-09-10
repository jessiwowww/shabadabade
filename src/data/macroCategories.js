/*
  LIVELLO 1 — le macro categorie.

  Nel database restano NUMERI ("1".."6"): il significato vive qui, nel
  sito. Così rinominare una categoria è una riga in questo file e non
  tocca un solo contenuto già caricato.

  Due numeri possono puntare alla stessa etichetta: il selettore la
  mostra una volta sola e filtra su entrambi i numeri. È il modo per
  accorpare due categorie senza rietichettare niente.

  Sopra i tag liberi (livello 2): quando una macro è attiva, i pin che
  non hanno riscontro dentro quella macro si spengono invece di
  svuotare la griglia.
*/
export const MACRO = {
  1: "Identity",
  2: "Image",
  3: "Illustration",
  4: "Editorial",
  5: "Exploration",
  6: "Performance",
};

/*
  Elenco per il selettore: una voce per ETICHETTA (non per numero),
  con i numeri che le corrispondono.
*/
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

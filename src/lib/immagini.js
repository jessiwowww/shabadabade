/*
  Sanity ritaglia e ricomprime al volo. La pagina chiede la misura che
  le serve davvero, così l'indirizzo pubblico non serve più il file di
  partenza: quello resta su Sanity, dietro il login.

  fit=max non ingrandisce mai oltre l'originale, auto=format lascia
  scegliere al browser il formato più leggero. Le GIF animate
  sopravvivono al ritaglio, i fotogrammi restano.

  Vale solo per gli indirizzi di Sanity: gli altri (dati di esempio)
  non saprebbero cosa farsene dei parametri.
*/
const SANITY = "https://cdn.sanity.io/";

export function ridotta(url, larghezza, qualita = 75) {
  if (!url || !url.startsWith(SANITY)) return url;
  const separatore = url.includes("?") ? "&" : "?";
  return `${url}${separatore}w=${larghezza}&q=${qualita}&auto=format&fit=max`;
}

/*
  Scala di misure per srcSet: il browser sceglie da solo quale
  scaricare in base a schermo e densità, così il telefono non si tira
  giù il file pensato per il desktop.
*/
export function scala(url, misure = [500, 900, 1400]) {
  if (!url || !url.startsWith(SANITY)) return undefined;
  return misure.map((w) => `${ridotta(url, w)} ${w}w`).join(", ");
}

// misure in pixel: il doppio di quanto si vede, per gli schermi fitti
export const MISURE = {
  miniatura: 160,
  griglia: 900,
  ritratto: 700,
  copertina: 1000,
  pieno: 1600,
};

import { TEMPERE } from "./themes";

// ogni disegno pesca dalla tavolozza tempere invece che dal solo
// accento, scartando i colori che sullo sfondo attivo sparirebbero

function canaliRgb(hex) {
  const n = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255);
}

function luminanza(hex) {
  const [r, g, b] = canaliRgb(hex);
  const lineare = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lineare(r) + 0.7152 * lineare(g) + 0.0722 * lineare(b);
}

function contrasto(a, b) {
  const la = luminanza(a);
  const lb = luminanza(b);
  const [chiaro, scuro] = la > lb ? [la, lb] : [lb, la];
  return (chiaro + 0.05) / (scuro + 0.05);
}

// bassa: sono disegni decorativi, non testo da leggere
const CONTRASTO_MINIMO = 2.2;

export function coloriDisegni(palette) {
  const candidati = [...TEMPERE.map((t) => t.bg), palette.accent, palette.ink];
  const buoni = candidati.filter(
    (c) => contrasto(c, palette.bg) >= CONTRASTO_MINIMO
  );
  // se lo sfondo è a metà strada e scarta tutto, l'inchiostro del tema
  // è per definizione leggibile su quel fondo
  return buoni.length > 0 ? [...new Set(buoni)] : [palette.ink];
}

export function coloreDisegnoCasuale(palette) {
  const colori = coloriDisegni(palette);
  return colori[Math.floor(Math.random() * colori.length)];
}

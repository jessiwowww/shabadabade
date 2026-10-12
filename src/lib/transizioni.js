/*
  Fa crescere un'immagine dal riquadro da cui arriva alla sua
  posizione. Si misura il disegno vero e non il box: con
  object-contain il box può essere più largo dell'immagine.
*/
export function cresciDa(el, origine, larghezza, altezza, durata = 480) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const box = el.getBoundingClientRect();
  if (!box.width || !origine?.width) return;
  const scala = Math.min(box.width / larghezza, box.height / altezza);
  const w = larghezza * scala;
  const h = altezza * scala;
  const ox = (box.width - w) / 2;
  const oy = (box.height - h) / 2;
  const s = origine.width / w;
  const dx = origine.left - box.left - ox * s;
  const dy = origine.top - box.top - oy * s;
  el.animate(
    [
      { transformOrigin: "0 0", transform: `translate(${dx}px, ${dy}px) scale(${s})` },
      { transformOrigin: "0 0", transform: "none" },
    ],
    { duration: durata, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }
  );
}

/*
  Copertina cliccata in un elenco di progetti: la pagina del progetto
  la ritrova al montaggio e la fa crescere da lì. Basta una variabile
  di modulo: la navigazione di Next non ricarica il JavaScript.
*/
let copertina = null;

export function ricordaCopertina(slug, img) {
  copertina = img ? { slug, rect: img.getBoundingClientRect() } : null;
}

export function prendiCopertina(slug) {
  const trovata = copertina?.slug === slug ? copertina.rect : null;
  copertina = null;
  return trovata;
}

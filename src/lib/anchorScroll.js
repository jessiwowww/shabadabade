/*
  Flag condiviso: mentre uno scroll programmatico verso un'ancora è in
  corso (es. click su "Contact"), la griglia NON deve auto-caricare
  altri lavori — allungherebbero la pagina e sposterebbero il bersaglio.
  Si sblocca a fine scroll ("scrollend") o comunque dopo un timeout.
*/
let suppressed = false;

export function suppressAutoload(ms = 2000) {
  suppressed = true;
  const clear = () => {
    suppressed = false;
    window.removeEventListener("scrollend", clear);
  };
  window.addEventListener("scrollend", clear);
  setTimeout(clear, ms);
}

export function isAutoloadSuppressed() {
  return suppressed;
}

/*
  Scroll a un'ancora "auto-correttivo": il layout della home può
  muoversi dopo il primo render (la masonry ricalcola le colonne,
  immagini e font arrivano dopo), quindi un solo scrollIntoView può
  mancare il bersaglio. Qui si riprova ogni ~600ms finché la sezione
  non è davvero in cima al viewport (o finiscono i tentativi).
  Se l'utente scrolla a mano, la correzione si interrompe subito.
*/
export function scrollToAnchor(anchor, { fromTop = false } = {}) {
  let cancelled = false;
  const cancel = () => (cancelled = true);
  window.addEventListener("wheel", cancel, { once: true, passive: true });
  window.addEventListener("touchstart", cancel, { once: true, passive: true });

  if (fromTop) window.scrollTo({ top: 0, behavior: "instant" });

  let lastOffset = null;
  const attempt = (left) => {
    if (cancelled) return;
    const el = document.querySelector(anchor);
    if (!el) return;
    const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    const offset = el.getBoundingClientRect().top - margin;
    if (Math.abs(offset) > 10) {
      suppressAutoload(1200);
      // se lo scroll morbido non si sta muovendo (tab in background,
      // animazioni disabilitate...), salta direttamente al punto
      const stuck = lastOffset !== null && Math.abs(offset - lastOffset) < 2;
      // "instant", non "auto": con scroll-behavior: smooth nel CSS,
      // "auto" erediterebbe comunque lo smooth
      el.scrollIntoView({ behavior: stuck ? "instant" : "smooth", block: "start" });
      lastOffset = offset;
      if (left > 0) setTimeout(() => attempt(left - 1), 600);
    }
  };
  // niente requestAnimationFrame: nei tab in background non scatta
  setTimeout(() => attempt(5), 60);
}

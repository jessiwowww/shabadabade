// durante uno scroll verso un'ancora la griglia non deve caricare
// altri lavori: allungherebbero la pagina spostando il bersaglio
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
  Auto-correttivo: il layout della home si assesta dopo il primo
  render (masonry, immagini, font), quindi un solo scrollIntoView
  manca il bersaglio. Si riprova finché la sezione non è in cima.
  Se l'utente scrolla a mano, smette.
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
    // sezione non ancora nel DOM: riprova invece di rinunciare
    if (!el) {
      if (left > 0) setTimeout(() => attempt(left - 1), 300);
      return;
    }
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
  // niente requestAnimationFrame: nei tab in background non scatta.
  // Tentativi generosi: la griglia continua ad assestarsi mentre le
  // immagini arrivano, e ogni assestamento sposta il bersaglio.
  setTimeout(() => attempt(8), 60);
}

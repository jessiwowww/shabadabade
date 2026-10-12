import { useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { NERO, BIANCO, TEMPERE } from "../data/themes";

/*
  La modalità è ricordata, il colore del random no: cambia a ogni
  refresh. Lo stato parte dai default perché il primo render del
  browser deve coincidere con quello del server (idratazione); la
  scelta vera l'ha già fatta lo script inline del layout e sta in
  window.__sbTheme — la si raccoglie invece di rifarla, o il random
  cambierebbe colore due volte al caricamento.
*/
export const STORAGE_KEY = "sb-theme-mode";
const MODES = ["nero", "bianco", "random"];

const pickTempera = () => TEMPERE[Math.floor(Math.random() * TEMPERE.length)];

function resolvePalette(mode) {
  if (mode === "bianco") return BIANCO;
  if (mode === "random") return pickTempera();
  return NERO;
}

function applyPalette(palette) {
  const root = document.documentElement.style;
  root.setProperty("--sb-bg-color", palette.bg);
  root.setProperty("--sb-surface", palette.surface);
  root.setProperty("--sb-ink", palette.ink);
  root.setProperty("--sb-ink-soft", palette.inkSoft);
  root.setProperty("--sb-accent", palette.accent);
}

export function useTheme() {
  const [mode, setModeState] = useState("nero");
  const [palette, setPalette] = useState(NERO);

  // allinea lo stato React a quello che lo script inline ha già scelto
  useEffect(() => {
    const scelto = window.__sbTheme;
    if (scelto && MODES.includes(scelto.mode)) {
      setModeState(scelto.mode);
      setPalette(scelto.palette);
    }
  }, []);

  /*
    origine = punto da cui il nuovo colore si allarga sulla pagina.
    tempera = un colore preciso (i barattoli della hero) invece di
    quello pescato a caso.
  */
  const setMode = useCallback((next, origine = null, tempera = null) => {
    const cambia = () => {
      setModeState(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // storage non disponibile: il tema vale solo per la sessione
      }
      const nuova = tempera ?? resolvePalette(next);
      setPalette(nuova);
      applyPalette(nuova);
    };

    const riduci = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!origine || riduci || !document.startViewTransition) {
      cambia();
      return;
    }

    const root = document.documentElement;
    const { x, y } = origine;
    const raggio = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );
    // senza, la fotografia del "dopo" coglierebbe la transizione CSS
    // dei colori ancora ferma al colore vecchio
    root.classList.add("sb-allagamento");
    const transizione = document.startViewTransition(() => flushSync(cambia));
    transizione.ready.then(() => {
      root.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${raggio}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 750,
          easing: "cubic-bezier(0.6, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
    transizione.finished.finally(() => root.classList.remove("sb-allagamento"));
  }, []);

  return { mode, setMode, palette };
}

import { useCallback, useEffect, useState } from "react";
import { NERO, BIANCO, TEMPERE } from "../data/themes";

/*
  Tre modalità: "nero", "bianco", "random".
  La modalità viene ricordata (localStorage), ma il colore della
  modalità random NO: a ogni refresh se ne estrae uno nuovo dalla
  palette tempera. Ricliccare "random" ri-estrae subito.

  Il tema è già applicato prima che la pagina si disegni, da uno
  script inline nel layout (niente lampo di nero su chi ha scelto il
  bianco). Quello script lascia la sua scelta in window.__sbTheme:
  qui la si raccoglie invece di rifarla, così la modalità random non
  cambia colore due volte al caricamento.

  Lo stato parte dai valori di default perché il primo render del
  browser deve coincidere con quello del server (idratazione).
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

  const setMode = useCallback((next) => {
    setModeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // storage non disponibile: il tema vale solo per la sessione
    }
    const nuova = resolvePalette(next);
    setPalette(nuova);
    applyPalette(nuova);
  }, []);

  return { mode, setMode, palette };
}

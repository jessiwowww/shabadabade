import { useCallback, useEffect, useState } from "react";
import { NERO, BIANCO, TEMPERE } from "../data/themes";

/*
  Tre modalità: "nero", "bianco", "random".
  La modalità viene ricordata (localStorage), ma il colore della
  modalità random NO: a ogni refresh se ne estrae uno nuovo dalla
  palette tempera. Ricliccare "random" ri-estrae subito.
*/
const STORAGE_KEY = "sb-theme-mode";
const MODES = ["nero", "bianco", "random"];

const pickTempera = () => TEMPERE[Math.floor(Math.random() * TEMPERE.length)];

function resolvePalette(mode) {
  if (mode === "bianco") return BIANCO;
  if (mode === "random") return pickTempera();
  return NERO;
}

function readStoredMode() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return MODES.includes(stored) ? stored : "nero";
  } catch {
    return "nero";
  }
}

export function useTheme() {
  const [mode, setModeState] = useState(readStoredMode);
  const [palette, setPalette] = useState(() => resolvePalette(readStoredMode()));

  useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty("--sb-bg-color", palette.bg);
    root.setProperty("--sb-surface", palette.surface);
    root.setProperty("--sb-ink", palette.ink);
    root.setProperty("--sb-ink-soft", palette.inkSoft);
    root.setProperty("--sb-accent", palette.accent);
  }, [palette]);

  const setMode = useCallback((next) => {
    setModeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // storage non disponibile: il tema vale solo per la sessione
    }
    setPalette(resolvePalette(next));
  }, []);

  return { mode, setMode, palette };
}

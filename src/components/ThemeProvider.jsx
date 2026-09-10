"use client";

import { createContext, useContext } from "react";
import { useTheme } from "@/hooks/useTheme.js";

/*
  Il tema deve essere UNO solo per tutta la pagina: lo switch in alto,
  il cursore e la foto di apertura devono guardare lo stesso stato.
  Chiamare useTheme() in più componenti creerebbe stati separati che
  non si parlano — da qui il context.
*/
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const theme = useTheme();
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error("useThemeContext va usato dentro <ThemeProvider>");
  }
  return theme;
}

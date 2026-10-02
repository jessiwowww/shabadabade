"use client";

import { createContext, useContext } from "react";
import { useTheme } from "@/hooks/useTheme.js";

// context e non hook diretto: useTheme() in più componenti creerebbe
// stati separati che non si parlano
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

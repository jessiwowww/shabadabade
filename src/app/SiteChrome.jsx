"use client";

import { useEffect } from "react";
import SiteNav from "@/components/SiteNav.jsx";
import CustomCursor from "@/components/CustomCursor.jsx";
import ClickBurst from "@/components/ClickBurst.jsx";
import ThemeSwitcher from "@/components/ThemeSwitcher.jsx";
import { useThemeContext } from "@/components/ThemeProvider.jsx";

export default function SiteChrome({ haProgetti }) {
  const { mode, setMode } = useThemeContext();

  /*
    Niente menù col tasto destro sulle immagini: toglie la voce
    "salva immagine", che è il modo in cui si portano via nel 99% dei
    casi. Solo sulle immagini, non su tutta la pagina: bloccare
    ovunque impedirebbe anche copiare un testo o aprire un link.
  */
  useEffect(() => {
    const blocca = (e) => {
      const t = e.target;
      if (t instanceof HTMLImageElement || t instanceof HTMLVideoElement) {
        e.preventDefault();
      }
    };
    document.addEventListener("contextmenu", blocca);
    return () => document.removeEventListener("contextmenu", blocca);
  }, []);

  return (
    <>
      <SiteNav haProgetti={haProgetti} />
      <CustomCursor />
      <ClickBurst />
      <ThemeSwitcher mode={mode} setMode={setMode} />
    </>
  );
}

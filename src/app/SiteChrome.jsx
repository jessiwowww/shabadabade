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
    Niente menù col tasto destro né trascinamento fuori dalla pagina:
    sono i due modi in cui un'immagine si porta via senza saper fare
    nulla. Solo su immagini e video, non su tutta la pagina: bloccare
    ovunque impedirebbe anche copiare un testo o aprire un link.
    Il trascinamento si blocca qui e non con `draggable="false"` tag
    per tag, che si dimentica sulla prossima immagine aggiunta.
    Resta comunque aggirabile: screenshot e indirizzo del file non si
    possono impedire, per quello serve la filigrana.
  */
  useEffect(() => {
    const blocca = (e) => {
      const t = e.target;
      if (t instanceof HTMLImageElement || t instanceof HTMLVideoElement) {
        e.preventDefault();
      }
    };
    document.addEventListener("contextmenu", blocca);
    document.addEventListener("dragstart", blocca);
    return () => {
      document.removeEventListener("contextmenu", blocca);
      document.removeEventListener("dragstart", blocca);
    };
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

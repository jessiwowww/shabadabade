import { useEffect, useState } from "react";

const QUERY = "(hover: hover) and (pointer: fine)";

/*
  true solo su dispositivi con puntatore di precisione (mouse/trackpad):
  è l'interruttore per cursore satellite e altri effetti solo-desktop.

  Parte sempre da false, anche sul desktop: il server non sa che
  puntatore ha chi visita: se il primo render del browser non
  coincidesse con quello del server, React segnalerebbe un errore di
  idratazione. Il valore vero arriva subito dopo il montaggio.
*/
export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    setIsDesktop(mq.matches);
    const onChange = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isDesktop;
}

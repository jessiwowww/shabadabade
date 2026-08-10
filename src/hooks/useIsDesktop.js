import { useEffect, useState } from "react";

const QUERY = "(hover: hover) and (pointer: fine)";

/*
  true solo su dispositivi con puntatore di precisione (mouse/trackpad):
  è l'interruttore per cursore satellite e altri effetti solo-desktop.
*/
export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isDesktop;
}

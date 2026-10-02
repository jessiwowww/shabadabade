import { useEffect, useState } from "react";

const QUERY = "(hover: hover) and (pointer: fine)";

// parte sempre da false, anche su desktop: il server non sa che
// puntatore ha chi visita, e primo render e server devono coincidere
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

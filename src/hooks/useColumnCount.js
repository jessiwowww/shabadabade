import { useEffect, useState } from "react";

/*
  Calcolato qui e non con ResponsiveMasonry: quello parte da
  window.innerWidth, che sul server non esiste — il server disegnava
  una colonna e il browser tre, e React segnalava un errore di
  idratazione. Si parte sempre da PARTENZA e si misura dopo.
*/
const BREAKPOINTS = [
  { da: 1600, colonne: 4 },
  { da: 1024, colonne: 3 },
  { da: 560, colonne: 2 },
  { da: 0, colonne: 1 },
];

// valore di compromesso fra telefono e desktop: il salto al primo
// caricamento resta di una colonna da entrambe le parti, e avviene
// sotto l'hero
const PARTENZA = 2;

export function useColumnCount() {
  const [colonne, setColonne] = useState(PARTENZA);

  useEffect(() => {
    const misura = () => {
      const larghezza = window.innerWidth;
      setColonne(BREAKPOINTS.find((b) => larghezza >= b.da).colonne);
    };
    misura();
    window.addEventListener("resize", misura);
    return () => window.removeEventListener("resize", misura);
  }, []);

  return colonne;
}

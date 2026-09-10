import { useEffect, useState } from "react";

/*
  Numero di colonne della griglia masonry.

  Lo calcoliamo qui invece di usare ResponsiveMasonry perché quello
  parte da window.innerWidth: sul server non esiste, quindi il server
  disegnava una colonna e il browser tre — e React segnalava un errore
  di idratazione. Server e primo render del browser devono coincidere,
  perciò si parte sempre da PARTENZA e si misura dopo il montaggio.
*/
const BREAKPOINTS = [
  { da: 1600, colonne: 4 },
  { da: 1024, colonne: 3 },
  { da: 560, colonne: 2 },
  { da: 0, colonne: 1 },
];

// valore di compromesso: il salto al primo caricamento resta di una
// colonna sia su telefono che su desktop, e avviene sotto l'hero
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

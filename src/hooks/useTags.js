import { useMemo } from "react";

/*
  Tag (livello 2) letti DENTRO il contesto della macro attiva.

  La lista resta sempre completa — presa da tutti i lavori — ma il
  conteggio è quello del contesto: un tag che nella macro attiva non
  ha riscontro arriva con count 0, e la sidebar lo mostra spento con
  la ✕ invece di farlo sparire. Così si capisce che quel tag esiste,
  ma non qui.
*/
export function useScopedTags(tuttiIProgetti, nelContesto) {
  return useMemo(() => {
    const conteggi = new Map();
    for (const p of nelContesto) {
      for (const tag of p.tags ?? []) {
        conteggi.set(tag, (conteggi.get(tag) ?? 0) + 1);
      }
    }

    const tutti = new Set();
    for (const p of tuttiIProgetti) {
      for (const tag of p.tags ?? []) tutti.add(tag);
    }

    return [...tutti]
      .map((name) => ({ name, count: conteggi.get(name) ?? 0 }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [tuttiIProgetti, nelContesto]);
}

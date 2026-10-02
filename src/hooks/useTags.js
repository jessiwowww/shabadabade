import { useMemo } from "react";

// lista completa, conteggio dentro la macro attiva: i tag senza
// riscontro arrivano con count 0 e la sidebar li barra invece di
// farli sparire
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

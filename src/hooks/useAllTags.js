import { useMemo } from "react";

/*
  Estrae dai progetti la lista unica di tag con frequenza d'uso,
  ordinata dal più usato. La lista tag non è mai hardcodata:
  nuovi tag inventati da Sharon su Sanity compaiono qui da soli.
*/
export function useAllTags(projects) {
  return useMemo(() => {
    const counts = new Map();
    for (const p of projects) {
      for (const tag of p.tags ?? []) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [projects]);
}

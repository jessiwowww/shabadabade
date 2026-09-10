"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { scrollToAnchor } from "@/lib/anchorScroll.js";
import TagSidebar from "@/components/TagSidebar.jsx";
import Hero from "@/components/Hero.jsx";
import Grid from "@/components/Grid.jsx";
import Lightbox from "@/components/Lightbox.jsx";
import ChiSono from "@/components/ChiSono.jsx";
import Commissioni from "@/components/Commissioni.jsx";
import Contatti from "@/components/Contatti.jsx";
import { useAllTags } from "@/hooks/useAllTags.js";

/*
  Parte interattiva della home: filtro a pin, griglia e lightbox.
  I contenuti arrivano già pronti dal server (src/app/page.js) — qui
  non si fa nessuna chiamata di rete.
*/
export default function HomeClient({ projects, about }) {
  const tags = useAllTags(projects);

  // Filtro multi-selezione in OR: basta un tag attivo in comune
  const [activeTags, setActiveTags] = useState(() => new Set());
  const [lightboxIndex, setLightboxIndex] = useState(null);

  /*
    Ancore (#chi-sono, #contatti): il layout della home si assesta dopo
    il primo render — la griglia masonry ricalcola le colonne — quindi
    un solo salto mancherebbe il bersaglio. scrollToAnchor si
    autocorregge finché la sezione non è davvero in cima.
    Arrivando da un'altra pagina si riparte dall'alto e si scorre.
  */
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && !hash.startsWith("#/")) {
      scrollToAnchor(hash, { fromTop: true });
    }

    const onHashChange = () => {
      const next = window.location.hash;
      if (next && !next.startsWith("#/")) {
        scrollToAnchor(next, { fromTop: false });
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const filtered = useMemo(() => {
    if (activeTags.size === 0) return projects;
    return projects.filter((p) => p.tags.some((t) => activeTags.has(t)));
  }, [projects, activeTags]);

  const toggleTag = useCallback((tag) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }, []);

  const clearTags = useCallback(() => setActiveTags(new Set()), []);

  // Da "What you can commission": attiva il tag e scorri alla griglia
  const pickCategory = useCallback((tag) => {
    setActiveTags((prev) => (prev.has(tag) ? prev : new Set(prev).add(tag)));
    document.getElementById("lavori")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const openProject = useCallback(
    (project) => setLightboxIndex(filtered.indexOf(project)),
    [filtered]
  );

  // Da un tag nel lightbox: attiva/disattiva il filtro, chiudi e
  // torna alla griglia (la lista su cui il lightbox naviga cambia)
  const pickTagFromLightbox = useCallback((tag) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
    setLightboxIndex(null);
    document.getElementById("lavori")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const navigateLightbox = useCallback(
    (dir) => {
      setLightboxIndex((i) => {
        if (i == null || filtered.length === 0) return i;
        return (i + dir + filtered.length) % filtered.length;
      });
    },
    [filtered]
  );

  return (
    <>
      <TagSidebar
        tags={tags}
        activeTags={activeTags}
        onToggle={toggleTag}
        onClear={clearTags}
      />

      <Hero />
      <Grid projects={filtered} loading={false} onOpen={openProject} />
      <ChiSono about={about} />
      <Commissioni onPick={pickCategory} />
      <Contatti />

      <Lightbox
        projects={filtered}
        index={lightboxIndex}
        activeTags={activeTags}
        onClose={() => setLightboxIndex(null)}
        onNavigate={navigateLightbox}
        onTagPick={pickTagFromLightbox}
      />
    </>
  );
}

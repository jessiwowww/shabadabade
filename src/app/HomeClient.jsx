"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { scrollToAnchor } from "@/lib/anchorScroll.js";
import TagSidebar from "@/components/TagSidebar.jsx";
import Hero from "@/components/Hero.jsx";
import Grid from "@/components/Grid.jsx";
import Lightbox from "@/components/Lightbox.jsx";
import AlbumViewer from "@/components/AlbumViewer.jsx";
import ChiSono from "@/components/ChiSono.jsx";
import Commissioni from "@/components/Commissioni.jsx";
import Contatti from "@/components/Contatti.jsx";
import { useScopedTags } from "@/hooks/useTags.js";
import { macroList, macroLabel } from "@/data/macroCategories";

/*
  Parte interattiva della home: filtro a pin, griglia e lightbox.
  I contenuti arrivano già pronti dal server (src/app/page.js) — qui
  non si fa nessuna chiamata di rete.
*/
export default function HomeClient({ projects, about }) {
  // LIVELLO 1: etichetta della macro attiva (null = tutte)
  const [macro, setMacro] = useState(null);
  // Filtro multi-selezione in OR: basta un tag attivo in comune
  const [activeTags, setActiveTags] = useState(() => new Set());
  const [lightboxIndex, setLightboxIndex] = useState(null);
  // lavoro di cui è aperto l'album (livello 3)
  const [albumProject, setAlbumProject] = useState(null);

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

  /*
    Un'etichetta può corrispondere a più numeri (due categorie
    accorpate sotto lo stesso nome): il filtro tiene tutti i numeri.
  */
  const numeriMacro = useMemo(() => {
    if (!macro) return null;
    const voce = macroList().find((v) => v.etichetta === macro);
    return voce ? new Set(voce.numeri) : null;
  }, [macro]);

  // i lavori dentro la macro attiva: è il contesto di tutto il resto
  const nelContesto = useMemo(
    () =>
      numeriMacro
        ? projects.filter((p) => numeriMacro.has(String(p.macro)))
        : projects,
    [projects, numeriMacro]
  );

  const conteggiMacro = useMemo(() => {
    const conteggi = new Map();
    for (const p of projects) {
      const etichetta = macroLabel(p.macro);
      if (etichetta) conteggi.set(etichetta, (conteggi.get(etichetta) ?? 0) + 1);
    }
    return conteggi;
  }, [projects]);

  const tags = useScopedTags(projects, nelContesto);

  /*
    La macro domina i tag: un tag attivo che dentro questo contesto non
    ha riscontro viene ignorato invece di svuotare la griglia — resta
    segnato con la ✕ nella sidebar.
  */
  const filtered = useMemo(() => {
    const validi = [...activeTags].filter((t) =>
      nelContesto.some((p) => p.tags?.includes(t))
    );
    if (validi.length === 0) return nelContesto;
    return nelContesto.filter((p) => p.tags.some((t) => validi.includes(t)));
  }, [nelContesto, activeTags]);

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
        macro={macro}
        onPickMacro={setMacro}
        conteggiMacro={conteggiMacro}
        totaleLavori={projects.length}
      />

      <Hero />
      <Grid
        projects={filtered}
        loading={false}
        onOpen={openProject}
        onOpenAlbum={setAlbumProject}
        macro={macro}
        onPickMacro={setMacro}
        conteggiMacro={conteggiMacro}
        totaleLavori={projects.length}
      />
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
        onOpenAlbum={(p) => {
          // l'album prende il posto del lightbox, non ci si accavalla
          setLightboxIndex(null);
          setAlbumProject(p);
        }}
      />

      <AlbumViewer
        project={albumProject}
        onClose={() => setAlbumProject(null)}
      />
    </>
  );
}

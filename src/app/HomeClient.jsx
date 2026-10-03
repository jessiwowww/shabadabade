"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

export default function HomeClient({ projects, about }) {
  // LIVELLO 1: etichetta della macro attiva (null = tutte)
  const [macro, setMacro] = useState(null);
  // Filtro multi-selezione in OR: basta un tag attivo in comune
  const [activeTags, setActiveTags] = useState(() => new Set());
  // il lightbox tiene l'ID, non la posizione: cambiando filtro la
  // posizione cambierebbe sotto i piedi e salteresti a un altro lavoro
  const [lightboxId, setLightboxId] = useState(null);
  // lavoro di cui è aperto l'album (livello 3)
  const [albumProject, setAlbumProject] = useState(null);

  // arrivando da un'altra pagina si riparte dall'alto e si scorre
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

  // un'etichetta può valere più numeri: il filtro li tiene tutti
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

  // la macro domina i tag: un tag senza riscontro qui viene ignorato
  // invece di svuotare la griglia
  const tagApplicati = useMemo(
    () =>
      [...activeTags].filter((t) =>
        nelContesto.some((p) => p.tags?.includes(t))
      ),
    [nelContesto, activeTags]
  );

  const filtered = useMemo(() => {
    if (tagApplicati.length === 0) return nelContesto;
    return nelContesto.filter((p) =>
      p.tags.some((t) => tagApplicati.includes(t))
    );
  }, [nelContesto, tagApplicati]);

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

  const lightboxIndex = useMemo(() => {
    if (!lightboxId) return null;
    const i = filtered.findIndex((p) => p.id === lightboxId);
    return i >= 0 ? i : null;
  }, [filtered, lightboxId]);

  const ultimaPosizione = useRef(0);
  useEffect(() => {
    if (lightboxIndex != null) ultimaPosizione.current = lightboxIndex;
  }, [lightboxIndex]);

  /*
    Il lavoro aperto è uscito dalla selezione — succede togliendo il
    tag per cui ci stava. Invece di buttare fuori, resta nello
    slideshow sul vicino: si chiude solo se non resta niente.
  */
  useEffect(() => {
    if (!lightboxId || lightboxIndex !== null) return;
    if (filtered.length === 0) {
      setLightboxId(null);
      return;
    }
    const i = Math.min(ultimaPosizione.current, filtered.length - 1);
    setLightboxId(filtered[i].id);
  }, [lightboxId, lightboxIndex, filtered]);

  const openProject = useCallback((project) => setLightboxId(project.id), []);

  // Da un tag nel lightbox: attiva/disattiva il filtro, chiudi e
  // torna alla griglia (la lista su cui il lightbox naviga cambia)
  // filtra senza chiudere: resti sul lavoro che stavi guardando,
  // cambia solo la selezione che stai sfogliando
  const pickTagFromLightbox = useCallback((tag) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }, []);

  const navigateLightbox = useCallback(
    (dir) => {
      if (lightboxIndex == null || filtered.length === 0) return;
      const i = (lightboxIndex + dir + filtered.length) % filtered.length;
      setLightboxId(filtered[i].id);
    },
    [filtered, lightboxIndex]
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
        tagApplicati={tagApplicati}
        macro={macro}
        onClose={() => setLightboxId(null)}
        onNavigate={navigateLightbox}
        onSetIndex={(i) => setLightboxId(filtered[i]?.id ?? null)}
        onTagPick={pickTagFromLightbox}
        onPickMacro={setMacro}
        onOpenAlbum={(p) => {
          // l'album prende il posto del lightbox, non ci si accavalla
          setLightboxId(null);
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

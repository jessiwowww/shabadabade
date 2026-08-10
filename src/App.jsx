import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { scrollToAnchor } from "./lib/anchorScroll.js";
import CustomCursor from "./components/CustomCursor.jsx";
import ThemeSwitcher from "./components/ThemeSwitcher.jsx";
import ClickBurst from "./components/ClickBurst.jsx";
import TagSidebar from "./components/TagSidebar.jsx";
import Hero from "./components/Hero.jsx";
import Grid from "./components/Grid.jsx";
import Lightbox from "./components/Lightbox.jsx";
import ChiSono from "./components/ChiSono.jsx";
import Commissioni from "./components/Commissioni.jsx";
import Contatti from "./components/Contatti.jsx";
import Progetti from "./components/Progetti.jsx";
import ProgettoDettaglio from "./components/ProgettoDettaglio.jsx";
import { useCaseStudies } from "./hooks/useCaseStudies.js";
import { useProjects } from "./hooks/useProjects.js";
import { useAllTags } from "./hooks/useAllTags.js";
import { useTheme } from "./hooks/useTheme.js";

/*
  Routing hash minimale (due pagine, niente dipendenze):
  "#/projects"      → elenco progetti completi
  "#/projects/<id>" → dettaglio di un progetto
  qualsiasi altro hash ("#lavori", "#contatti"...) → home + ancora
*/
function parseRoute(hash) {
  const m = hash.match(/^#\/projects(?:\/([\w-]+))?\/?$/);
  if (m) return { page: "projects", id: m[1] ?? null };
  return { page: "home", id: null };
}

function useHashRoute() {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));
  // Ancora (#contatti, #chi-sono...) da raggiungere quando la home è
  // montata E i dati sono caricati — non prima, o il layout sotto i
  // piedi si allunga e lo scroll manca il bersaglio.
  const pendingAnchor = useRef(
    window.location.hash && !window.location.hash.startsWith("#/")
      ? { hash: window.location.hash, fromTop: false }
      : null
  );
  const prevPage = useRef(parseRoute(window.location.hash).page);

  useEffect(() => {
    const onHash = () => {
      const next = parseRoute(window.location.hash);
      const hash = window.location.hash;
      if (next.page === "projects") {
        window.scrollTo({ top: 0 });
      } else if (hash && !hash.startsWith("#/")) {
        // arrivando da un'altra pagina: riparti dall'alto della home
        // e poi scorri fino alla sezione
        pendingAnchor.current = { hash, fromTop: prevPage.current !== "home" };
      }
      prevPage.current = next.page;
      setRoute(next);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return { route, pendingAnchor };
}

export default function App() {
  const { route, pendingAnchor } = useHashRoute();
  const { mode, setMode } = useTheme();
  const { projects, loading } = useProjects();
  const { caseStudies, loading: loadingCaseStudies } = useCaseStudies();

  // Scroll all'ancora in sospeso: solo in home, a dati caricati, un
  // frame dopo il render. Sospende l'auto-load della griglia mentre
  // lo scroll è in corso.
  useEffect(() => {
    if (route.page !== "home" || loading) return;
    const pending = pendingAnchor.current;
    if (!pending) return;
    pendingAnchor.current = null;
    scrollToAnchor(pending.hash, { fromTop: pending.fromTop });
  }, [route, loading, pendingAnchor]);
  const tags = useAllTags(projects);

  // Filtro multi-selezione in OR: basta un tag attivo in comune
  const [activeTags, setActiveTags] = useState(() => new Set());
  const [lightboxIndex, setLightboxIndex] = useState(null);

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

  // Da "Cosa puoi commissionarmi": attiva il tag e scorri alla griglia
  const pickCategory = useCallback((tag) => {
    setActiveTags((prev) => (prev.has(tag) ? prev : new Set(prev).add(tag)));
    document.getElementById("lavori")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const openProject = useCallback(
    (project) => {
      setLightboxIndex(filtered.indexOf(project));
    },
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
    <div className="min-h-screen bg-sb-bg text-sb-ink">
      <CustomCursor />
      <ClickBurst />
      <ThemeSwitcher mode={mode} setMode={setMode} />

      <TagSidebar
        page={route.page}
        tags={tags}
        activeTags={activeTags}
        onToggle={toggleTag}
        onClear={clearTags}
      />

      <main className="lg:pl-52">
        {route.page === "projects" ? (
          route.id ? (
            <ProgettoDettaglio
              caseStudy={caseStudies.find((cs) => cs.id === route.id)}
              loading={loadingCaseStudies}
            />
          ) : (
            <Progetti caseStudies={caseStudies} loading={loadingCaseStudies} />
          )
        ) : (
          <>
            <Hero />
            <Grid projects={filtered} loading={loading} onOpen={openProject} />
            <ChiSono />
            <Commissioni onPick={pickCategory} />
            <Contatti />
          </>
        )}
      </main>

      <Lightbox
        projects={filtered}
        index={lightboxIndex}
        activeTags={activeTags}
        onClose={() => setLightboxIndex(null)}
        onNavigate={navigateLightbox}
        onTagPick={pickTagFromLightbox}
      />
    </div>
  );
}

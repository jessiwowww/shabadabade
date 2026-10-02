import { useEffect, useMemo, useRef, useState } from "react";
import Masonry from "react-responsive-masonry";
import { motion } from "framer-motion";
import { isAutoloadSuppressed } from "../lib/anchorScroll";
import { useColumnCount } from "../hooks/useColumnCount";
import MacroSelector from "./MacroSelector.jsx";

// uscita in due tempi: prima la dissolvenza, poi la rimozione, o i
// superstiti si riposizionano prima che gli altri siano spariti
const EXIT_MS = 240;

// la home resta una vetrina anche con centinaia di lavori: il resto
// arriva scorrendo
const BATCH = 12;

function useFilterTransition(filtered) {
  const [displayed, setDisplayed] = useState(filtered);
  const [leavingIds, setLeavingIds] = useState(() => new Set());
  const displayedRef = useRef(displayed);
  displayedRef.current = displayed;

  useEffect(() => {
    const keep = new Set(filtered.map((p) => p.id));
    const toLeave = displayedRef.current.filter((p) => !keep.has(p.id));

    if (toLeave.length === 0) {
      setDisplayed(filtered);
      setLeavingIds(new Set());
      return;
    }

    setLeavingIds(new Set(toLeave.map((p) => p.id)));
    const t = setTimeout(() => {
      setDisplayed(filtered);
      setLeavingIds(new Set());
    }, EXIT_MS);
    return () => clearTimeout(t);
  }, [filtered]);

  return { displayed, leavingIds };
}

function ProjectCard({ project, leaving, onOpen, onOpenAlbum }) {
  const { immagine } = project;
  const album = project.album ?? [];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={
        leaving ? { opacity: 0, scale: 0.88 } : { opacity: 1, scale: 1 }
      }
      transition={{
        layout: { type: "spring", stiffness: 260, damping: 30 },
        duration: EXIT_MS / 1000,
      }}
    >
      {/* div e non bottone: dentro c'è il pulsante album, e un bottone
          dentro un bottone non è HTML valido */}
      <div className="group relative overflow-hidden rounded-xl bg-sb-surface">
      <button
        type="button"
        data-interactive
        onClick={() => onOpen(project)}
        className="block w-full text-left"
        aria-label={`Open project: ${project.titolo}`}
      >
        {project.video ? (
          <video
            src={project.video.url}
            poster={immagine.url}
            width={project.video.larghezza}
            height={project.video.altezza}
            muted
            loop
            autoPlay
            playsInline
            preload="metadata"
            className="block h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <img
            src={immagine.url}
            alt={project.titolo}
            width={immagine.larghezza}
            height={immagine.altezza}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        )}
        {/* bianco fisso e non token: il gradiente sotto è sempre nero */}
        <span className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/75 via-black/10 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span>
            <span className="block font-display text-lg font-semibold text-white">
              {project.titolo}
            </span>
            <span className="mt-0.5 block text-xs text-white/70">
              {project.tags.join(" · ")}
            </span>
          </span>
        </span>
      </button>

      {album.length > 0 && (
        <button
          type="button"
          data-interactive
          onClick={() => onOpenAlbum(project)}
          aria-label={`Open the album of ${project.titolo} — ${album.length} items`}
          className="absolute right-2 top-2 flex min-h-9 items-center gap-1.5 rounded-full bg-sb-bg/80 px-2.5 py-1 text-xs font-semibold text-sb-ink backdrop-blur transition-colors hover:bg-sb-bg hover:text-sb-accent"
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="4.5" y="1.5" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <path d="M11.5 14.5h-8a2 2 0 0 1-2-2v-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          {album.length}
        </button>
      )}
      </div>
    </motion.div>
  );
}

export default function Grid({
  projects,
  loading,
  onOpen,
  onOpenAlbum,
  macro,
  onPickMacro,
  conteggiMacro,
  totaleLavori = 0,
}) {
  const [visibleCount, setVisibleCount] = useState(BATCH);
  const sentinelRef = useRef(null);
  const colonne = useColumnCount();

  // nuovo elenco (filtri cambiati o dati arrivati): riparti dal primo blocco
  useEffect(() => setVisibleCount(BATCH), [projects]);

  const hasMore = visibleCount < projects.length;
  // memo obbligatorio: un'identità nuova a ogni render farebbe
  // ripartire all'infinito la transizione di uscita del filtro
  // (card a opacità zero mai rimosse = buchi nella griglia)
  const visible = useMemo(
    () => projects.slice(0, visibleCount),
    [projects, visibleCount]
  );
  const { displayed, leavingIds } = useFilterTransition(visible);

  useEffect(() => {
    if (!hasMore || !sentinelRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !isAutoloadSuppressed()) {
          setVisibleCount((c) => Math.min(c + BATCH, projects.length));
        }
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, [hasMore, projects.length]);

  return (
    <section id="lavori" className="scroll-mt-12 px-5 py-14 sm:px-8 lg:px-12">
      <h2 className="sr-only">Work</h2>

      {onPickMacro && (
        <div className="mb-8 max-w-4xl">
          <MacroSelector
            attiva={macro}
            onPick={onPickMacro}
            conteggi={conteggiMacro}
          />
        </div>
      )}

      {loading ? (
        <p className="text-sb-ink-soft">Loading…</p>
      ) : displayed.length === 0 ? (
        <p className="text-sb-ink-soft">Nothing with these tags (yet).</p>
      ) : (
        <>
          <Masonry columnsCount={colonne} gutter="1.1rem">
            {displayed.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                leaving={leavingIds.has(project.id)}
                onOpen={onOpen}
                onOpenAlbum={onOpenAlbum}
              />
            ))}
          </Masonry>
          {hasMore && (
            <div ref={sentinelRef} aria-hidden="true" className="h-1" />
          )}
        </>
      )}
    </section>
  );
}

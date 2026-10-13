import { useEffect, useMemo, useRef, useState } from "react";
import Masonry from "react-responsive-masonry";
import { AnimatePresence, motion } from "framer-motion";
import { isAutoloadSuppressed } from "../lib/anchorScroll";
import { useColumnCount } from "../hooks/useColumnCount";
import { useIsDesktop } from "../hooks/useIsDesktop";
import MacroSelector from "./MacroSelector.jsx";
import TagFilters from "./TagFilters.jsx";
import IndexView from "./IndexView.jsx";
import DeskView from "./DeskView.jsx";

// uscita in due tempi: prima la dissolvenza, poi la rimozione, o i
// superstiti si riposizionano prima che gli altri siano spariti
const EXIT_MS = 240;

// la home resta una vetrina anche con centinaia di lavori: il resto
// arriva scorrendo
const BATCH = 12;

const VISTE = [
  { id: "griglia", label: "Grid" },
  { id: "indice", label: "Index" },
  // il tavolo vuole un mouse: col dito si trascinerebbe invece di scorrere
  { id: "tavolo", label: "Desk", soloDesktop: true },
];

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

export function AlbumIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="4.5" y="1.5" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M11.5 14.5h-8a2 2 0 0 1-2-2v-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ProjectCard({ project, leaving, onOpen, onOpenAlbum }) {
  const { immagine } = project;
  const album = project.album ?? [];
  const media = useRef(null);
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
      <div className="group relative overflow-hidden rounded-[3px] bg-sb-surface">
      <button
        type="button"
        data-interactive
        onClick={() => onOpen(project, media.current?.getBoundingClientRect())}
        className="block w-full text-left"
        aria-label={`Open project: ${project.titolo}`}
      >
        {project.video ? (
          <video
            ref={media}
            src={project.video.url}
            poster={immagine.url}
            width={project.video.larghezza}
            height={project.video.altezza}
            muted
            loop
            autoPlay
            playsInline
            preload="metadata"
            className="block h-auto w-full"
          />
        ) : (
          <img
            ref={media}
            src={immagine.url}
            alt={project.titolo}
            width={immagine.larghezza}
            height={immagine.altezza}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full"
          />
        )}
        {/* etichetta come un adesivo appena attaccato */}
        <span className="pointer-events-none absolute bottom-3 left-3 max-w-[85%] -rotate-2 translate-y-3 bg-sb-accent px-2.5 py-1.5 text-sb-bg opacity-0 shadow-md transition-[opacity,transform] duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
          <span className="block font-display text-base font-bold leading-tight">
            {project.titolo}
          </span>
          <span className="block text-[0.7rem] opacity-75">
            {project.tags.join(" · ")}
          </span>
        </span>
      </button>

      {album.length > 0 && (
        <button
          type="button"
          data-interactive
          onClick={() => onOpenAlbum(project)}
          aria-label={`Open the album of ${project.titolo} — ${album.length} items`}
          className="absolute right-2 top-2 flex min-h-9 items-center gap-1.5 rounded-full bg-sb-bg px-2.5 py-1 text-xs font-semibold text-sb-ink transition-colors hover:text-sb-accent"
        >
          <AlbumIcon />
          {album.length}
        </button>
      )}
      </div>
    </motion.div>
  );
}

function Masonria({ projects, onOpen, onOpenAlbum }) {
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
      {hasMore && <div ref={sentinelRef} aria-hidden="true" className="h-1" />}
    </>
  );
}

export default function Grid({
  projects,
  onOpen,
  onOpenAlbum,
  macro,
  onPickMacro,
  conteggiMacro,
  tags,
  activeTags,
  onToggleTag,
  onClearTags,
}) {
  const isDesktop = useIsDesktop();
  // si parte sempre dalla griglia, anche se l'ultima volta era un'altra
  const [vista, setVista] = useState("griglia");
  const [filtriAperti, setFiltriAperti] = useState(false);

  const disponibili = VISTE.filter((v) => !v.soloDesktop || isDesktop);
  const vistaEffettiva = disponibili.some((v) => v.id === vista) ? vista : "griglia";

  return (
    <section id="lavori" className="scroll-mt-20 px-5 py-14 sm:px-8 lg:px-12">
      <h2 className="sr-only">Work</h2>

      <div className="mb-8 flex flex-col gap-4">
        <MacroSelector attiva={macro} onPick={onPickMacro} conteggi={conteggiMacro} />

        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-sb-ink/15 pt-3">
          <button
            type="button"
            data-interactive
            onClick={() => setFiltriAperti((a) => !a)}
            aria-expanded={filtriAperti}
            aria-controls="sb-filtri"
            className="inline-flex min-h-11 items-center gap-2 text-sm text-sb-ink-soft transition-colors hover:text-sb-ink"
          >
            <span aria-hidden="true" className={`inline-block transition-transform ${filtriAperti ? "rotate-45" : ""}`}>
              +
            </span>
            Filter by tag
            {activeTags.size > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sb-accent px-1.5 text-[0.7rem] font-semibold text-sb-bg">
                {activeTags.size}
              </span>
            )}
          </button>

          <div role="group" aria-label="View" className="flex items-center gap-1">
            {disponibili.map((v) => (
              <button
                key={v.id}
                type="button"
                data-interactive
                onClick={() => setVista(v.id)}
                aria-pressed={vistaEffettiva === v.id}
                className={`inline-flex min-h-11 items-center px-2.5 text-sm transition-colors ${
                  vistaEffettiva === v.id
                    ? "font-semibold text-sb-accent underline decoration-2 underline-offset-8"
                    : "text-sb-ink-soft hover:text-sb-ink"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence initial={false}>
          {filtriAperti && (
            <motion.div
              id="sb-filtri"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="max-w-4xl pb-4 pl-1 pt-2">
                <TagFilters
                  tags={tags}
                  activeTags={activeTags}
                  onToggle={onToggleTag}
                  onClear={onClearTags}
                  macro={macro}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {projects.length === 0 ? (
        <p className="text-sb-ink-soft">Nothing with these tags (yet).</p>
      ) : vistaEffettiva === "indice" ? (
        <IndexView projects={projects} onOpen={onOpen} />
      ) : vistaEffettiva === "tavolo" ? (
        <DeskView projects={projects} onOpen={onOpen} />
      ) : (
        <Masonria projects={projects} onOpen={onOpen} onOpenAlbum={onOpenAlbum} />
      )}
    </section>
  );
}

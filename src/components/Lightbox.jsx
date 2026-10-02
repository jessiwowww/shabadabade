"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

// striscia con aggancio nativo invece di drag a mano: così si vedono
// entrare le immagini vicine e l'inerzia su telefono è quella di sistema
export default function Lightbox({
  projects,
  index,
  activeTags,
  tagApplicati,
  macro,
  onClose,
  onNavigate,
  onSetIndex,
  onTagPick,
  onPickMacro,
  onOpenAlbum,
}) {
  const project = index != null ? projects[index] : null;
  const striscia = useRef(null);
  const ignoraScroll = useRef(false);
  const attesaScroll = useRef(null);
  const appenaAperto = useRef(true);

  useEffect(() => {
    if (!project) {
      appenaAperto.current = true;
      return;
    }
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate(1);
      if (e.key === "ArrowLeft") onNavigate(-1);
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [project, onClose, onNavigate]);

  // indice cambiato da fuori (apertura, frecce): all'apertura senza
  // animazione, o si vedrebbe scorrere da capo
  useEffect(() => {
    const el = striscia.current;
    if (!el || index == null) return;
    const bersaglio = index * el.offsetWidth;
    if (Math.abs(el.scrollLeft - bersaglio) < 4) return;

    ignoraScroll.current = true;
    el.scrollTo({
      left: bersaglio,
      behavior: appenaAperto.current ? "instant" : "smooth",
    });
    appenaAperto.current = false;
    const t = setTimeout(() => (ignoraScroll.current = false), 450);
    return () => clearTimeout(t);
  }, [index, project]);

  // scorrimento col dito: aggiorna l'indice quando si è fermato
  const alloScroll = () => {
    if (ignoraScroll.current) return;
    clearTimeout(attesaScroll.current);
    attesaScroll.current = setTimeout(() => {
      const el = striscia.current;
      if (!el || !el.offsetWidth) return;
      const nuovo = Math.round(el.scrollLeft / el.offsetWidth);
      if (nuovo !== index && nuovo >= 0 && nuovo < projects.length) {
        onSetIndex(nuovo);
      }
    }, 120);
  };

  // solo i filtri che stanno davvero agendo: quelli selezionati ma
  // ignorati qui si vedono barrati nella sidebar, non serve ripeterli
  const contesto = [
    ...(macro ? [{ etichetta: macro, rimuovi: () => onPickMacro(null) }] : []),
    ...(tagApplicati ?? []).map((tag) => ({
      etichetta: tag,
      rimuovi: () => onTagPick(tag),
    })),
  ];

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col bg-sb-bg/95 backdrop-blur-sm lg:items-center lg:justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={project.titolo}
          data-interactive
        >
          <div
            className="absolute inset-x-0 top-0 z-20 flex items-center gap-2 px-4 py-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sb-strip flex flex-1 items-center gap-1.5 overflow-x-auto">
              {contesto.length > 0 ? (
                contesto.map((voce) => (
                  <button
                    key={voce.etichetta}
                    type="button"
                    data-interactive
                    onClick={voce.rimuovi}
                    aria-label={`Remove filter: ${voce.etichetta}`}
                    className="flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border border-sb-accent/50 bg-sb-accent/10 px-3 text-[0.7rem] text-sb-accent transition-colors hover:bg-sb-accent/20"
                  >
                    {voce.etichetta}
                    <span aria-hidden="true" className="text-sb-accent/60">
                      ✕
                    </span>
                  </button>
                ))
              ) : (
                <span className="text-[0.7rem] text-sb-ink-soft">All work</span>
              )}
            </div>
            <span className="shrink-0 text-[0.7rem] tabular-nums text-sb-ink-soft">
              {index + 1} / {projects.length}
            </span>
            <button
              type="button"
              data-interactive
              onClick={onClose}
              aria-label="Close"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sb-surface/80 text-sb-ink hover:text-sb-accent"
            >
              ✕
            </button>
          </div>

          {/* Frecce: solo desktop, su mobile si scorre col dito */}
          <button
            type="button"
            data-interactive
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(-1);
            }}
            aria-label="Previous project"
            className="absolute left-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-sb-surface/80 text-sb-ink hover:text-sb-accent lg:flex"
          >
            ←
          </button>
          <button
            type="button"
            data-interactive
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(1);
            }}
            aria-label="Next project"
            className="absolute right-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-sb-surface/80 text-sb-ink hover:text-sb-accent lg:flex"
          >
            →
          </button>

          <motion.div
            className="flex h-full w-full flex-col overflow-y-auto pt-16 lg:h-auto lg:max-h-[86vh] lg:w-auto lg:max-w-5xl lg:flex-row lg:items-center lg:gap-8 lg:overflow-visible lg:px-8 lg:pt-0"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              ref={striscia}
              onScroll={alloScroll}
              className="sb-strip flex w-full shrink-0 snap-x snap-mandatory overflow-x-auto lg:w-[60vw] lg:max-w-3xl"
            >
              {projects.map((p, i) => (
                <div
                  key={p.id}
                  className="flex w-full shrink-0 snap-center items-center justify-center px-1"
                  aria-hidden={i !== index}
                >
                  {p.video ? (
                    <video
                      src={p.video.url}
                      poster={p.immagine.url}
                      width={p.video.larghezza}
                      height={p.video.altezza}
                      controls
                      loop
                      playsInline
                      preload={i === index ? "auto" : "none"}
                      className="max-h-[58vh] w-full select-none object-contain lg:max-h-[80vh]"
                    />
                  ) : (
                    <img
                      src={p.immagine.url}
                      alt={p.titolo}
                      width={p.immagine.larghezza}
                      height={p.immagine.altezza}
                      loading={i === index ? "eager" : "lazy"}
                      decoding="async"
                      className="max-h-[58vh] w-full select-none object-contain lg:max-h-[80vh]"
                      draggable="false"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="px-6 py-6 lg:flex lg:w-72 lg:shrink-0 lg:flex-col lg:justify-center lg:px-0">
              <h3 className="font-display text-2xl font-bold tracking-tight">
                {project.titolo}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.tags.map((tag) => {
                  const active = activeTags?.has(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      data-interactive
                      onClick={(e) => {
                        e.stopPropagation();
                        onTagPick(tag);
                      }}
                      className={`min-h-11 rounded-full border px-3 py-1 text-xs transition-colors ${
                        active
                          ? "border-sb-accent bg-sb-accent/15 text-sb-accent"
                          : "border-sb-ink/25 text-sb-ink-soft hover:border-sb-accent hover:text-sb-accent"
                      }`}
                      aria-pressed={!!active}
                      aria-label={`Filter work by tag: ${tag}`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
              {(project.album?.length ?? 0) > 0 && (
                <button
                  type="button"
                  data-interactive
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenAlbum(project);
                  }}
                  className="mt-4 inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-sb-ink/25 px-4 text-sm transition-colors hover:border-sb-accent hover:text-sb-accent"
                >
                  See the album
                  <span className="text-sb-ink-soft">{project.album.length}</span>
                </button>
              )}

              <p className="mt-4 text-sm leading-relaxed text-sb-ink-soft">
                {project.descrizione}
              </p>
              <p className="mt-4 text-xs text-sb-ink-soft/70">
                {new Date(project.data).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

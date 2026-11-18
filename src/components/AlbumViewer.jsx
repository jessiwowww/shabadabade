"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { bloccaScroll } from "@/lib/scrollLock";

// l'anteprima di un video è il suo poster; senza poster resta il
// riquadro col triangolo, che è comunque cliccabile
export const anteprimaVoce = (voce) =>
  voce.tipo === "video" ? voce.poster?.url : voce.immagine?.url;

export function Play({ className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none flex h-8 w-8 items-center justify-center rounded-full bg-sb-bg/70 text-xs text-sb-ink ${className}`}
    >
      ▶
    </span>
  );
}

export default function AlbumViewer({ project, indiceIniziale = null, onClose }) {
  const voci = project?.album ?? [];
  const [indice, setIndice] = useState(0);
  const striscia = useRef(null);
  const ignoraScroll = useRef(false);
  const attesaScroll = useRef(null);
  const appenaAperto = useRef(true);

  useEffect(() => {
    if (!project) {
      appenaAperto.current = true;
      return;
    }
    setIndice(indiceIniziale ?? 0);
    return bloccaScroll();
  }, [project, indiceIniziale]);

  const vai = useCallback(
    (dir) => {
      if (voci.length === 0) return;
      setIndice((i) => (i + dir + voci.length) % voci.length);
    },
    [voci.length]
  );

  useEffect(() => {
    if (!project) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") vai(1);
      if (e.key === "ArrowLeft") vai(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, onClose, vai]);

  /*
    L'indice cambiato da fuori (frecce, miniature) muove la striscia.
    All'apertura senza animazione, o si vedrebbe scorrere da capo.
  */
  useLayoutEffect(() => {
    const el = striscia.current;
    if (!el || !project) return;
    const bersaglio = indice * el.offsetWidth;
    if (appenaAperto.current) {
      el.scrollTo({ left: bersaglio, behavior: "instant" });
      appenaAperto.current = false;
      return;
    }
    if (Math.abs(el.scrollLeft - bersaglio) < 4) return;
    ignoraScroll.current = true;
    el.scrollTo({ left: bersaglio, behavior: "smooth" });
    const t = setTimeout(() => (ignoraScroll.current = false), 450);
    return () => clearTimeout(t);
  }, [indice, project]);

  // scorrimento col dito: l'indice si aggiorna quando si è fermato
  const alloScroll = () => {
    if (ignoraScroll.current) return;
    clearTimeout(attesaScroll.current);
    attesaScroll.current = setTimeout(() => {
      const el = striscia.current;
      if (!el || !el.offsetWidth) return;
      const nuovo = Math.round(el.scrollLeft / el.offsetWidth);
      if (nuovo !== indice && nuovo >= 0 && nuovo < voci.length) {
        setIndice(nuovo);
      }
    }, 120);
  };

  const corrente = voci[indice];

  return (
    <AnimatePresence>
      {project && voci.length > 0 && (
        <motion.div
          /* sopra il lightbox, che resta aperto sotto */
          className="fixed inset-0 z-[60] flex flex-col bg-sb-bg/95 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={project.titolo ? `Album: ${project.titolo}` : "Album"}
          data-interactive
        >
          <div
            className="flex shrink-0 items-baseline justify-between gap-4 px-4 pb-3 pt-5 sm:px-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="min-w-0">
              {project.titolo && (
                <h2 className="truncate font-display text-lg font-bold tracking-tight sm:text-xl">
                  {project.titolo}
                </h2>
              )}
              <p className="mt-0.5 text-xs tabular-nums text-sb-ink-soft">
                {indice + 1} / {voci.length}
              </p>
            </div>
            <button
              type="button"
              data-interactive
              onClick={onClose}
              aria-label="Close album"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sb-surface/80 text-sb-ink hover:text-sb-accent"
            >
              ✕
            </button>
          </div>

          <div
            className="relative flex min-h-0 flex-1 items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {voci.length > 1 && (
              <>
                <button
                  type="button"
                  data-interactive
                  onClick={() => vai(-1)}
                  aria-label="Previous item"
                  className="absolute left-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-sb-surface/80 text-sb-ink hover:text-sb-accent lg:flex"
                >
                  ←
                </button>
                <button
                  type="button"
                  data-interactive
                  onClick={() => vai(1)}
                  aria-label="Next item"
                  className="absolute right-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-sb-surface/80 text-sb-ink hover:text-sb-accent lg:flex"
                >
                  →
                </button>
              </>
            )}

            <div
              ref={striscia}
              onScroll={alloScroll}
              className="sb-strip flex h-full w-full snap-x snap-mandatory overflow-x-auto"
            >
              {voci.map((voce, i) => (
                <figure
                  key={i}
                  aria-hidden={i !== indice}
                  /* w-full e object-contain: il contenuto si adatta
                     allo schermo invece di sbordare di lato */
                  className="flex h-full w-full shrink-0 snap-center flex-col items-center justify-center gap-3 px-4 sm:px-14"
                >
                  {voce.tipo === "video" ? (
                    <video
                      src={voce.url}
                      poster={voce.poster?.url}
                      controls
                      controlsList="nodownload noplaybackrate"
                      disablePictureInPicture
                      loop
                      playsInline
                      preload={i === indice ? "metadata" : "none"}
                      className="max-h-full w-full object-contain"
                    />
                  ) : (
                    <img
                      src={voce.immagine.url}
                      alt={voce.didascalia ?? project.titolo ?? ""}
                      width={voce.immagine.larghezza}
                      height={voce.immagine.altezza}
                      loading={i === indice ? "eager" : "lazy"}
                      decoding="async"
                      draggable="false"
                      className="max-h-full w-full select-none object-contain"
                    />
                  )}
                </figure>
              ))}
            </div>
          </div>

          <div
            className="shrink-0 px-4 pb-5 pt-3 sm:px-8"
            onClick={(e) => e.stopPropagation()}
          >
            {corrente?.didascalia && (
              <p className="mx-auto mb-3 max-w-2xl text-center text-xs leading-relaxed text-sb-ink-soft">
                {corrente.didascalia}
              </p>
            )}

            {voci.length > 1 && (
              <ul className="sb-strip mx-auto flex max-w-3xl gap-2 overflow-x-auto">
                {voci.map((voce, i) => {
                  const src = anteprimaVoce(voce);
                  const attiva = i === indice;
                  return (
                    <li key={i} className="shrink-0">
                      <button
                        type="button"
                        data-interactive
                        onClick={() => setIndice(i)}
                        aria-label={`Item ${i + 1} of ${voci.length}`}
                        aria-current={attiva ? "true" : undefined}
                        className={`relative block h-14 w-14 overflow-hidden rounded-[3px] bg-sb-surface transition-opacity sm:h-16 sm:w-16 ${
                          attiva
                            ? "opacity-100 ring-2 ring-sb-accent"
                            : "opacity-50 hover:opacity-100"
                        }`}
                      >
                        {src && (
                          <img
                            src={src}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            draggable="false"
                            className="h-full w-full select-none object-cover"
                          />
                        )}
                        {voce.tipo === "video" && (
                          <Play className="absolute inset-0 m-auto h-6 w-6" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

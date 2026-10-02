"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function AlbumViewer({ project, onClose }) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [project, onClose]);

  const voci = project?.album ?? [];

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col bg-sb-bg/95 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Album: ${project.titolo}`}
          data-interactive
        >
          <div
            className="flex items-baseline justify-between gap-4 px-5 pb-4 pt-6 sm:px-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight">
                {project.titolo}
              </h2>
              <p className="mt-1 text-xs text-sb-ink-soft">
                {voci.length} in this album — scroll sideways
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
            className="sb-scroll flex flex-1 snap-x snap-mandatory items-center gap-4 overflow-x-auto px-5 pb-10 sm:gap-6 sm:px-8"
            onClick={(e) => e.stopPropagation()}
          >
            {voci.map((voce, i) => (
              <figure
                key={i}
                className="flex h-full max-h-[70vh] shrink-0 snap-center flex-col justify-center"
              >
                {voce.tipo === "video" ? (
                  <video
                    src={voce.url}
                    poster={voce.poster?.url}
                    controls
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    className="max-h-[62vh] w-auto rounded-xl"
                  />
                ) : (
                  <img
                    src={voce.immagine.url}
                    alt={voce.didascalia ?? project.titolo}
                    width={voce.immagine.larghezza}
                    height={voce.immagine.altezza}
                    loading="lazy"
                    decoding="async"
                    className="max-h-[62vh] w-auto rounded-xl"
                  />
                )}
                {voce.didascalia && (
                  <figcaption className="mt-3 max-w-xs text-xs text-sb-ink-soft">
                    {voce.didascalia}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

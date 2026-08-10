import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

/*
  Lightbox progetto.
  Desktop: overlay centrato, immagine grande + pannello dettagli laterale,
  frecce per navigare.
  Mobile: fullscreen, swipe orizzontale (drag gesture) per passare
  al progetto precedente/successivo.
*/

const SWIPE_THRESHOLD = 70;

export default function Lightbox({
  projects,
  index,
  activeTags,
  onClose,
  onNavigate,
  onTagPick,
}) {
  const project = index != null ? projects[index] : null;

  useEffect(() => {
    if (!project) return;
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

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-sb-bg/95 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={project.titolo}
          data-interactive
        >
          <button
            type="button"
            data-interactive
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-sb-surface/80 text-sb-ink hover:text-sb-accent"
          >
            ✕
          </button>

          {/* Frecce: solo desktop, su mobile si naviga con lo swipe */}
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

          {/* Niente key={project.id}: rimontare questo nodo durante la
              navigazione orfana l'animazione di exit di AnimatePresence
              (il dialog resterebbe bloccato a opacity 0). */}
          <motion.div
            className="flex h-full w-full flex-col overflow-y-auto lg:h-auto lg:max-h-[86vh] lg:w-auto lg:max-w-5xl lg:flex-row lg:gap-8 lg:overflow-visible lg:px-8"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={(_, info) => {
              if (info.offset.x < -SWIPE_THRESHOLD) onNavigate(1);
              else if (info.offset.x > SWIPE_THRESHOLD) onNavigate(-1);
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {project.video ? (
              <video
                src={project.video.url}
                poster={project.immagine.url}
                width={project.video.larghezza}
                height={project.video.altezza}
                controls
                loop
                autoPlay
                playsInline
                className="h-auto max-h-[62vh] w-full select-none object-contain lg:max-h-[86vh] lg:w-auto lg:max-w-[60vw]"
              />
            ) : (
              <img
                src={project.immagine.url}
                alt={project.titolo}
                width={project.immagine.larghezza}
                height={project.immagine.altezza}
                className="h-auto max-h-[62vh] w-full select-none object-contain lg:max-h-[86vh] lg:w-auto lg:max-w-[60vw]"
                draggable="false"
              />
            )}
            <div className="px-6 py-6 lg:flex lg:w-72 lg:shrink-0 lg:flex-col lg:justify-center lg:px-0">
              <h3 className="font-display text-2xl font-bold tracking-tight">
                {project.titolo}
              </h3>
              {/* Tag cliccabili: attivano il filtro, chiudono il lightbox
                  e portano alla griglia filtrata */}
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
              <p className="mt-4 text-sm leading-relaxed text-sb-ink-soft">
                {project.descrizione}
              </p>
              <p className="mt-4 text-xs text-sb-ink-soft/70">
                {new Date(project.data).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
              <p className="mt-6 text-xs text-sb-ink-soft/60 lg:hidden">
                Swipe left or right for the next project
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

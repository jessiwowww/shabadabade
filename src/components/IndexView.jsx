import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useIsDesktop } from "../hooks/useIsDesktop";

const anno = (data) => (data ? new Date(data).getFullYear() : "");

// l'anteprima segue il puntatore: col dito non c'è passaggio, quindi
// su telefono la miniatura sta fissa nella riga
export default function IndexView({ projects, onOpen }) {
  const isDesktop = useIsDesktop();
  const [sopra, setSopra] = useState(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 26 });
  const sy = useSpring(y, { stiffness: 220, damping: 26 });

  useEffect(() => {
    if (!isDesktop) return;
    const onMove = (e) => {
      x.set(e.clientX + 24);
      y.set(e.clientY - 120);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [isDesktop, x, y]);

  return (
    <>
      <ul className="border-t border-sb-ink/15" onPointerLeave={() => setSopra(null)}>
        <AnimatePresence initial={false}>
          {projects.map((p, i) => (
            <motion.li
              key={p.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="border-b border-sb-ink/15"
            >
              <button
                type="button"
                data-interactive
                onClick={() => onOpen(p, null)}
                onPointerEnter={() => setSopra(p)}
                onFocus={() => setSopra(null)}
                className="group grid w-full grid-cols-[1fr_auto] items-center gap-x-4 py-4 text-left sm:grid-cols-[1fr_minmax(0,16rem)_4rem] sm:py-5"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <img
                    src={p.immagine.url}
                    alt=""
                    width={p.immagine.larghezza}
                    height={p.immagine.altezza}
                    loading="lazy"
                    decoding="async"
                    className="h-12 w-12 shrink-0 rounded-[3px] object-cover sm:hidden"
                  />
                  <span className="truncate font-display text-xl font-bold tracking-tight transition-[color,transform] duration-300 group-hover:translate-x-2 group-hover:text-sb-accent sm:text-3xl lg:text-4xl">
                    {p.titolo}
                  </span>
                </span>
                <span className="hidden truncate text-sm text-sb-ink-soft sm:block">
                  {p.tags.join(" · ")}
                </span>
                <span className="text-right text-sm tabular-nums text-sb-ink-soft">
                  {anno(p.data)}
                </span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {isDesktop && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-20 w-64"
          style={{ x: sx, y: sy }}
        >
          <AnimatePresence>
            {sopra && (
              <motion.img
                key={sopra.id}
                src={sopra.immagine.url}
                alt=""
                className="absolute left-0 top-0 w-full rounded-[3px] shadow-2xl"
                initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
                animate={{ opacity: 1, scale: 1, rotate: 2 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.22 }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </>
  );
}

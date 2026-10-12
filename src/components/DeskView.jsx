import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

// oltre, il tavolo diventa un mucchio: per il resto c'è la griglia
const MASSIMO = 40;

function casuale(seme) {
  let s = seme >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function hash(testo) {
  let h = 0;
  for (let i = 0; i < testo.length; i++) h = (h * 31 + testo.charCodeAt(i)) | 0;
  return h;
}

function disponi(projects, larghezza, mescolata) {
  const w = Math.min(280, Math.max(180, larghezza * 0.19));
  const colonne = Math.max(2, Math.floor(larghezza / (w * 0.9)));
  const passoX = (larghezza - w) / Math.max(1, colonne - 1);
  const passoY = w * 0.95;
  const posizioni = projects.map((p, i) => {
    const r = casuale(hash(p.id) + mescolata * 7919);
    const colonna = i % colonne;
    const riga = Math.floor(i / colonne);
    return {
      id: p.id,
      w,
      x: Math.min(larghezza - w, Math.max(0, colonna * passoX + (r() - 0.5) * w * 0.5)),
      y: riga * passoY + (colonna % 2) * passoY * 0.35 + (r() - 0.5) * 60,
      rotate: (r() - 0.5) * 14,
    };
  });
  const righe = Math.ceil(projects.length / colonne);
  return { posizioni, altezza: righe * passoY + w * 1.2 };
}

export default function DeskView({ projects, onOpen }) {
  const tavolo = useRef(null);
  const [larghezza, setLarghezza] = useState(0);
  const [mescolata, setMescolata] = useState(0);
  const [inCima, setInCima] = useState({});
  const prossimo = useRef(1);
  const trascinato = useRef(false);

  useEffect(() => {
    const el = tavolo.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setLarghezza(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const sul = useMemo(() => projects.slice(0, MASSIMO), [projects]);
  const { posizioni, altezza } = useMemo(
    () => disponi(sul, larghezza, mescolata),
    [sul, larghezza, mescolata]
  );

  const portaSopra = (id) => setInCima((z) => ({ ...z, [id]: ++prossimo.current }));

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4 text-sm text-sb-ink-soft">
        <p>Drag things around. Click one to open it.</p>
        <button
          type="button"
          data-interactive
          onClick={() => setMescolata((m) => m + 1)}
          className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-sb-accent"
        >
          Shuffle the desk
        </button>
      </div>

      <div
        ref={tavolo}
        className="relative"
        style={{ height: larghezza ? altezza : "60vh" }}
      >
        {larghezza > 0 &&
          sul.map((p, i) => {
            const pos = posizioni[i];
            return (
              <motion.div
                key={`${p.id}-${mescolata}`}
                drag
                dragConstraints={tavolo}
                dragElastic={0.15}
                onPointerDown={() => {
                  trascinato.current = false;
                  portaSopra(p.id);
                }}
                onDragStart={() => (trascinato.current = true)}
                initial={{ opacity: 0, scale: 0.6, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: pos.rotate }}
                whileHover={{ scale: 1.03 }}
                whileDrag={{ scale: 1.08, rotate: 0, cursor: "grabbing" }}
                transition={{ delay: Math.min(i * 0.03, 0.6), type: "spring", stiffness: 200, damping: 20 }}
                className="absolute left-0 top-0 cursor-grab touch-none"
                style={{ x: pos.x, y: pos.y, width: pos.w, zIndex: inCima[p.id] ?? 1 }}
              >
                <button
                  type="button"
                  data-interactive
                  onClick={(e) => {
                    if (trascinato.current) return;
                    onOpen(p, e.currentTarget.querySelector("img")?.getBoundingClientRect());
                  }}
                  aria-label={`Open project: ${p.titolo}`}
                  className="block w-full bg-sb-surface p-2 pb-7 text-left shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
                >
                  <img
                    src={p.immagine.url}
                    alt={p.titolo}
                    width={p.immagine.larghezza}
                    height={p.immagine.altezza}
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                    className="pointer-events-none block h-auto w-full select-none"
                  />
                  <span className="mt-2 block truncate text-xs text-sb-ink-soft">
                    {p.titolo}
                  </span>
                </button>
              </motion.div>
            );
          })}
      </div>

      {projects.length > MASSIMO && (
        <p className="mt-6 text-sm text-sb-ink-soft">
          {MASSIMO} of {projects.length} on the desk — the grid has them all.
        </p>
      )}
    </div>
  );
}

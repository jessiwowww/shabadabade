"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TEMPERE } from "@/data/themes";

// spicchi dei colori veri delle tempere: li prende da themes.js, così
// aggiungendone una cambia anche il pallino
const RUOTA = `conic-gradient(${TEMPERE.map(
  (t, i) =>
    `${t.bg} ${(i * 100) / TEMPERE.length}% ${((i + 1) * 100) / TEMPERE.length}%`
).join(", ")})`;

/*
  Switch tema: nero / bianco / colore random.

  Sta chiuso, mostrando solo il cerchio in uso; al click si apre e
  compaiono gli altri due. Aperto sempre occupava troppo spazio, e su
  telefono si scontrava con la navigazione.
  Si richiude scegliendo, cliccando fuori o con Esc.
*/
const OPZIONI = [
  { mode: "nero", label: "Black", colore: "#000000" },
  { mode: "bianco", label: "White", colore: "#f7f4ec" },
  { mode: "random", label: "Random colour", ruota: true },
];

export default function ThemeSwitcher({ mode, setMode }) {
  const [aperto, setAperto] = useState(false);
  const contenitore = useRef(null);

  useEffect(() => {
    if (!aperto) return;
    const fuori = (e) => {
      if (!contenitore.current?.contains(e.target)) setAperto(false);
    };
    const esc = (e) => e.key === "Escape" && setAperto(false);
    document.addEventListener("pointerdown", fuori);
    window.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", fuori);
      window.removeEventListener("keydown", esc);
    };
  }, [aperto]);

  const attiva = OPZIONI.find((o) => o.mode === mode) ?? OPZIONI[0];

  // un pallino e basta: è un comando, non un disegno
  const Cerchio = ({ opt, attivo }) => (
    <span
      className="block h-5 w-5 rounded-full"
      style={{
        background: opt.ruota ? RUOTA : opt.colore,
        boxShadow: `inset 0 0 0 ${attivo ? 2 : 1}px ${
          attivo
            ? "var(--sb-accent)"
            : "color-mix(in srgb, var(--sb-ink) 45%, transparent)"
        }`,
      }}
    />
  );

  return (
    <motion.div
      ref={contenitore}
      layout
      /*
        Su telefono in alto non ci sta insieme alla navigazione:
        sotto a sinistra è libero e comodo col pollice.
      */
      className="fixed bottom-5 left-5 z-40 flex items-center gap-1 rounded-full border border-sb-ink/15 bg-sb-surface/80 p-1 backdrop-blur lg:bottom-auto lg:left-auto lg:right-4 lg:top-2.5"
      role="group"
      aria-label="Site colour"
    >
      {!aperto && (
        <motion.button
          layout
          type="button"
          data-interactive
          onClick={() => setAperto(true)}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.88 }}
          aria-label={`Site colour: ${attiva.label}. Change it`}
          aria-expanded={false}
          className="flex h-9 w-9 items-center justify-center"
        >
          <Cerchio opt={attiva} />
        </motion.button>
      )}

      <AnimatePresence initial={false}>
        {aperto &&
          OPZIONI.map((opt) => {
            const isAttiva = mode === opt.mode;
            return (
              <motion.button
                key={opt.mode}
                layout
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.18 }}
                type="button"
                data-interactive
                onClick={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  setMode(opt.mode, {
                    x: r.left + r.width / 2,
                    y: r.top + r.height / 2,
                  });
                  setAperto(false);
                }}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.88 }}
                aria-label={`${opt.label} theme`}
                aria-pressed={isAttiva}
                className="flex h-9 w-9 items-center justify-center"
              >
                <Cerchio opt={opt} attivo={isAttiva} />
              </motion.button>
            );
          })}
      </AnimatePresence>
    </motion.div>
  );
}

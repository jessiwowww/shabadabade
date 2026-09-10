"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/*
  Switch tema: nero / bianco / colore random.

  Sta chiuso, mostrando solo il cerchio in uso; al click si apre e
  compaiono gli altri due. Aperto sempre occupava troppo spazio, e su
  telefono si scontrava con la navigazione.
  Si richiude scegliendo, cliccando fuori o con Esc.
*/
const OPZIONI = [
  { mode: "nero", label: "Black", swatch: "#000000", border: true },
  { mode: "bianco", label: "White", swatch: "#f7f4ec", border: true },
  {
    mode: "random",
    label: "Random colour",
    swatch:
      "conic-gradient(#2e4fb7, #6c4ab0, #e884a8, #c4472f, #f5c842, #3e7c55, #2e4fb7)",
    border: false,
  },
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

  const Cerchio = ({ opt }) => (
    <span
      aria-hidden="true"
      className={`block h-5 w-5 rounded-full ${
        opt.border ? "border border-sb-ink/40" : ""
      }`}
      style={{ background: opt.swatch }}
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
      className="fixed bottom-5 left-5 z-40 flex items-center gap-1 rounded-full border border-sb-ink/15 bg-sb-surface/80 p-1 backdrop-blur lg:bottom-auto lg:left-auto lg:right-4 lg:top-4"
      role="group"
      aria-label="Site colour"
    >
      {!aperto && (
        <motion.button
          layout
          type="button"
          data-interactive
          onClick={() => setAperto(true)}
          whileTap={{ scale: 0.88 }}
          aria-label={`Site colour: ${attiva.label}. Change it`}
          aria-expanded={false}
          className="flex h-9 w-9 items-center justify-center rounded-full ring-2 ring-sb-accent"
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
                onClick={() => {
                  setMode(opt.mode);
                  setAperto(false);
                }}
                whileTap={{ scale: 0.88 }}
                aria-label={`${opt.label} theme`}
                aria-pressed={isAttiva}
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-shadow ${
                  isAttiva
                    ? "ring-2 ring-sb-accent"
                    : "hover:ring-2 hover:ring-sb-ink/30"
                }`}
              >
                <Cerchio opt={opt} />
              </motion.button>
            );
          })}
      </AnimatePresence>
    </motion.div>
  );
}

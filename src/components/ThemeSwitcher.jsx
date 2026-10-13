"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TEMPERE } from "@/data/themes";
import { Macchia } from "@/data/macchia";

// mimetica coi colori veri delle tempere: li prende da themes.js, così
// aggiungendo una tempera cambia anche il simbolo
const MACCHIE = [
  "M-2,-2 C9,-5 15,4 10,11 C5,17 -3,14 -5,8 Z",
  "M27,-5 C37,-7 45,3 40,11 C35,19 26,16 24,8 Z",
  "M-5,23 C4,19 13,26 10,33 C7,41 -3,43 -7,34 Z",
  "M28,21 C39,19 45,29 40,37 C35,45 25,42 23,33 Z",
  "M12,13 C21,9 29,14 26,22 C23,30 13,30 9,23 Z",
];

function mimetica(colori) {
  const [fondo, ...macchie] = colori;
  return (
    <>
      <rect width="40" height="40" fill={fondo} />
      {MACCHIE.map((d, i) => (
        <path key={i} d={d} fill={macchie[i % macchie.length]} />
      ))}
    </>
  );
}

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
  { mode: "random", label: "Random colour", mimetica: true, border: false },
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

  const Cerchio = ({ opt, attivo }) => (
    <Macchia
      className="h-7 w-7"
      colore={opt.swatch}
      riempimento={opt.mimetica ? mimetica(TEMPERE.map((t) => t.bg)) : null}
      bordo={attivo ? "var(--sb-accent)" : opt.border ? "color-mix(in srgb, var(--sb-ink) 45%, transparent)" : null}
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
          whileHover={{ rotate: -14, scale: 1.08 }}
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
                whileHover={{ rotate: -14, scale: 1.08 }}
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

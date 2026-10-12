"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NERO, BIANCO } from "@/data/themes";
import { Cuffie, Fiore, Sorriso, Skate } from "@/data/illustrations";

/*
  Foto e bio arrivano dal server (documento "About" su Sanity, con
  fallback ai contenuti di default): vedi src/lib/content.js.

  Giorno e notte sono le due metà del lavoro di Sharon. La sezione
  ridefinisce le variabili del tema solo per sé, quindi tutto quello
  che c'è dentro cambia colore senza toccare il resto della pagina.
*/
const MOMENTI = {
  giorno: {
    palette: BIANCO,
    etichetta: "By day",
    titolo: "Presentations and visuals for the healthcare world.",
  },
  notte: {
    palette: NERO,
    etichetta: "By night",
    titolo: "Logos, tattoos and t-shirts for people and places I care about.",
  },
};

const variabili = (p) => ({
  "--sb-bg-color": p.bg,
  "--sb-surface": p.surface,
  "--sb-ink": p.ink,
  "--sb-ink-soft": p.inkSoft,
  "--sb-accent": p.accent,
});

const DISEGNI_NOTTE = [
  { Illo: Cuffie, className: "left-[4%] top-[8%] w-14 -rotate-12" },
  { Illo: Fiore, className: "right-[6%] top-[14%] w-10 rotate-6" },
  { Illo: Skate, className: "right-[18%] bottom-[10%] w-16 -rotate-6" },
  { Illo: Sorriso, className: "left-[40%] bottom-[6%] w-10 rotate-12" },
];

export default function ChiSono({ about }) {
  const { foto, bio } = about;
  const [momento, setMomento] = useState("notte");

  // si apre sull'ora di chi guarda: di giorno il giorno, di sera la notte
  useEffect(() => {
    const ora = new Date().getHours();
    setMomento(ora >= 7 && ora < 19 ? "giorno" : "notte");
  }, []);

  const m = MOMENTI[momento];

  return (
    <section
      id="chi-sono"
      style={variabili(m.palette)}
      className="relative scroll-mt-16 overflow-hidden bg-sb-bg px-5 py-20 text-sb-ink transition-colors duration-500 sm:px-8 lg:px-12 lg:py-28"
    >
      <AnimatePresence>
        {momento === "notte" &&
          DISEGNI_NOTTE.map(({ Illo, className }, i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              className={`pointer-events-none absolute hidden text-sb-accent md:block ${className}`}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 0.9, scale: 1 }}
              exit={{ opacity: 0, scale: 0.4 }}
              transition={{ delay: i * 0.06 }}
            >
              <Illo size="100%" />
            </motion.span>
          ))}
      </AnimatePresence>

      <div className="relative mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            About
          </h2>

          <div
            role="group"
            aria-label="Day or night"
            className="flex rounded-full border border-sb-ink/25 p-1"
          >
            {Object.entries(MOMENTI).map(([chiave, v]) => {
              const attivo = momento === chiave;
              return (
                <button
                  key={chiave}
                  type="button"
                  aria-pressed={attivo}
                  data-interactive
                  onClick={() => setMomento(chiave)}
                  className="relative inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold"
                >
                  {attivo && (
                    <motion.span
                      layoutId="sb-momento"
                      className="absolute inset-0 rounded-full bg-sb-ink"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span
                    aria-hidden="true"
                    className={`relative ${attivo ? "text-sb-bg" : "text-sb-ink-soft"}`}
                  >
                    {chiave === "giorno" ? "☀" : "☾"}
                  </span>
                  <span className={`relative ${attivo ? "text-sb-bg" : "text-sb-ink-soft"}`}>
                    {v.etichetta}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-12 grid gap-12 md:grid-cols-[1fr_16rem] md:items-start lg:grid-cols-[1fr_18rem]">
          <div>
            <AnimatePresence mode="wait">
              <motion.p
                key={momento}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="max-w-2xl font-display text-3xl font-bold leading-tight tracking-tight text-sb-accent sm:text-4xl"
              >
                {m.titolo}
              </motion.p>
            </AnimatePresence>

            <p className="mt-8 max-w-2xl text-lg leading-relaxed">{bio}</p>

            <AnimatePresence mode="wait">
              {momento === "giorno" ? (
                <motion.ul
                  key="giorno"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-10 space-y-4 border-l border-sb-ink/20 pl-6 text-sm"
                >
                  <li>
                    <span className="block font-semibold">
                      Presentation Specialist — Ogilvy Health
                    </span>
                    <span className="text-sb-ink-soft">London, current</span>
                  </li>
                  <li>
                    <span className="block font-semibold">Previously — WPP group</span>
                    <span className="text-sb-ink-soft">Design & visual communication</span>
                  </li>
                </motion.ul>
              ) : (
                <motion.ul
                  key="notte"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-10 space-y-4 border-l border-sb-ink/20 pl-6 text-sm"
                >
                  <li>
                    <span className="block font-semibold">shabadabade</span>
                    <span className="text-sb-ink-soft">
                      Logos, illustrations, local graphics, invitations
                    </span>
                  </li>
                  <li>
                    <span className="block font-semibold">Based in London</span>
                    <span className="text-sb-ink-soft">
                      Available for commissions anywhere
                    </span>
                  </li>
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          <motion.img
            src={foto.url}
            alt="Portrait of Sharon Bertoncello"
            width={foto.larghezza}
            height={foto.altezza}
            loading="lazy"
            decoding="async"
            animate={{ rotate: momento === "giorno" ? -2 : 3 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            className="w-52 bg-sb-surface p-2 pb-8 shadow-[0_16px_40px_rgba(0,0,0,0.3)] md:w-full"
          />
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cuffie, Fiore, Sorriso, Skate } from "@/data/illustrations";

/*
  Foto e bio arrivano dal server (documento "About" su Sanity, con
  fallback ai contenuti di default): vedi src/lib/content.js.

  Le due metà del lavoro di Sharon. Si apre su shabadabade, che è il
  motivo del sito; il lavoro fisso c'è, ma con toni più quieti: la
  sezione prende il colore di superficie e l'accento diventa
  inchiostro, in qualunque tema.
*/
const LATI = {
  studio: {
    etichetta: "shabadabade",
    titolo: "Logos, illustrations, local graphics and invitations, drawn by hand for people and places I care about.",
    voci: [
      ["shabadabade", "Design & illustration, London"],
      ["Commissions", "Available anywhere"],
    ],
    stile: undefined,
  },
  agenzia: {
    etichetta: "Ogilvy Health",
    titolo: "Presentations and visuals for the healthcare world.",
    voci: [
      ["Presentation Specialist — Ogilvy Health", "London, current"],
      ["Previously — WPP group", "Design & visual communication"],
    ],
    stile: {
      "--sb-bg-color": "var(--sb-surface)",
      "--sb-accent": "var(--sb-ink)",
    },
  },
};

const DISEGNI = [
  { Illo: Cuffie, className: "left-[4%] top-[8%] w-14 -rotate-12" },
  { Illo: Fiore, className: "right-[6%] top-[14%] w-10 rotate-6" },
  { Illo: Skate, className: "right-[18%] bottom-[10%] w-16 -rotate-6" },
  { Illo: Sorriso, className: "left-[40%] bottom-[6%] w-10 rotate-12" },
];

export default function ChiSono({ about }) {
  const { foto, bio } = about;
  const [lato, setLato] = useState("studio");
  const l = LATI[lato];

  return (
    <section
      id="chi-sono"
      style={l.stile}
      className="relative scroll-mt-16 overflow-hidden bg-sb-bg px-5 py-20 text-sb-ink transition-colors duration-500 sm:px-8 lg:px-12 lg:py-28"
    >
      <AnimatePresence>
        {lato === "studio" &&
          DISEGNI.map(({ Illo, className }, i) => (
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
            aria-label="Which side of my work"
            className="flex rounded-full border border-sb-ink/25 p-1"
          >
            {Object.entries(LATI).map(([chiave, v]) => {
              const attivo = lato === chiave;
              return (
                <button
                  key={chiave}
                  type="button"
                  aria-pressed={attivo}
                  data-interactive
                  onClick={() => setLato(chiave)}
                  className={`relative inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold ${
                    chiave === "studio" ? "font-nome font-normal" : ""
                  }`}
                >
                  {attivo && (
                    <motion.span
                      layoutId="sb-lato"
                      className="absolute inset-0 rounded-full bg-sb-ink"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
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
                key={lato}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className={`max-w-2xl font-display font-bold leading-tight tracking-tight text-sb-accent ${
                  lato === "studio" ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"
                }`}
              >
                {l.titolo}
              </motion.p>
            </AnimatePresence>

            <p className="mt-8 max-w-2xl text-lg leading-relaxed">{bio}</p>

            <AnimatePresence mode="wait">
              <motion.ul
                key={lato}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-10 space-y-4 border-l border-sb-ink/20 pl-6 text-sm"
              >
                {l.voci.map(([titolo, nota]) => (
                  <li key={titolo}>
                    <span className="block font-semibold">{titolo}</span>
                    <span className="text-sb-ink-soft">{nota}</span>
                  </li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>

          <motion.img
            src={foto.url}
            alt="Portrait of Sharon Bertoncello"
            width={foto.larghezza}
            height={foto.altezza}
            loading="lazy"
            decoding="async"
            animate={{ rotate: lato === "studio" ? 3 : -2 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            className="w-52 bg-sb-surface p-2 pb-8 shadow-[0_16px_40px_rgba(0,0,0,0.3)] md:w-full"
          />
        </div>
      </div>
    </section>
  );
}

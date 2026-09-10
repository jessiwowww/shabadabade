"use client";

import { motion } from "framer-motion";
import { macroList } from "@/data/macroCategories";

/*
  LIVELLO 1: il selettore delle macro categorie, sopra i pin dei tag.
  Sceglierne una restringe la griglia E il contesto dei pin.

  Volutamente diverso dai pin: qui sono voci di elenco, non spille —
  perché è una scelta strutturale, non un filtro alla pari.
  `conteggi` è una mappa etichetta → quanti lavori, per spegnere le
  categorie ancora vuote invece di portare a una griglia deserta.
*/
export default function MacroSelector({
  attiva,
  onPick,
  conteggi,
  totale,
  orizzontale = false,
}) {
  const voci = macroList();

  const classi = (isAttiva, isVuota) =>
    `inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 text-[0.82rem] transition-colors ${
      isAttiva
        ? "bg-sb-accent/15 font-semibold text-sb-accent"
        : isVuota
          ? "cursor-not-allowed text-sb-ink-soft/40"
          : "text-sb-ink-soft hover:text-sb-accent"
    }`;

  return (
    <div
      className={
        orizzontale
          ? "sb-scroll -mx-5 flex snap-x gap-1 overflow-x-auto px-5 pb-1"
          : "-ml-3 flex flex-col items-start gap-0.5"
      }
      role="group"
      aria-label="Categories"
    >
      <motion.button
        type="button"
        data-interactive
        whileTap={{ scale: 0.96 }}
        onClick={() => onPick(null)}
        aria-pressed={attiva === null}
        className={`${classi(attiva === null, false)} shrink-0`}
      >
        All
        <span className="text-sb-ink-soft/70">{totale}</span>
      </motion.button>

      {voci.map(({ etichetta }) => {
        const quanti = conteggi.get(etichetta) ?? 0;
        const vuota = quanti === 0;
        return (
          <motion.button
            key={etichetta}
            type="button"
            data-interactive
            whileTap={vuota ? undefined : { scale: 0.96 }}
            onClick={() => !vuota && onPick(etichetta)}
            disabled={vuota}
            aria-pressed={attiva === etichetta}
            className={`${classi(attiva === etichetta, vuota)} shrink-0`}
          >
            {etichetta}
            <span
              className={
                attiva === etichetta ? "text-sb-accent/70" : "text-sb-ink-soft/70"
              }
            >
              {quanti}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

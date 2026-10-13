"use client";

import { motion } from "framer-motion";
import { macroList } from "@/data/macroCategories";

// prendono il posto del titolo della sezione: non sono un filtro fra
// i tanti, sono le parole che dicono di che lavoro si tratta.
// Niente "All": si torna a tutto ricliccando quella attiva
export default function MacroSelector({ attiva, onPick, conteggi }) {
  const voci = macroList();

  return (
    <div
      className="flex flex-wrap items-baseline gap-x-5 gap-y-1 sm:gap-x-7"
      role="group"
      aria-label="Categories"
    >
      {voci.map(({ etichetta }) => {
        const conteggio = conteggi.get(etichetta) ?? 0;
        const vuota = conteggio === 0;
        const isAttiva = attiva === etichetta;
        return (
          <motion.button
            key={etichetta}
            type="button"
            data-interactive
            whileTap={vuota ? undefined : { scale: 0.97 }}
            onClick={() => !vuota && onPick(isAttiva ? null : etichetta)}
            disabled={vuota}
            aria-pressed={isAttiva}
            className={`font-display text-3xl font-bold tracking-tight transition-colors sm:text-4xl lg:text-5xl ${
              isAttiva
                ? "text-sb-accent"
                : vuota
                  ? "cursor-not-allowed text-sb-ink-soft/25"
                  : "text-sb-ink-soft hover:text-sb-ink"
            }`}
          >
            {etichetta}
            <sup className="ml-0.5 align-super text-xs font-semibold tabular-nums opacity-70 sm:text-sm">
              {conteggio}
            </sup>
          </motion.button>
        );
      })}
    </div>
  );
}

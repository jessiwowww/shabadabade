"use client";

import { motion } from "framer-motion";
import { macroList } from "@/data/macroCategories";
import { MACCHIA } from "@/data/macchia";

// prendono il posto del titolo della sezione: non sono un filtro fra
// i tanti, sono le parole che dicono di che lavoro si tratta
export default function MacroSelector({ attiva, onPick, conteggi }) {
  const totale = [...conteggi.values()].reduce((a, b) => a + b, 0);
  const voci = [
    { etichetta: "All", valore: null, conteggio: totale },
    ...macroList().map(({ etichetta }) => ({
      etichetta,
      valore: etichetta,
      conteggio: conteggi.get(etichetta) ?? 0,
    })),
  ];

  return (
    <div
      className="-ml-2 flex flex-wrap items-baseline gap-x-2 gap-y-1 sm:gap-x-3"
      role="group"
      aria-label="Categories"
    >
      {voci.map(({ etichetta, valore, conteggio }) => {
        const vuota = conteggio === 0;
        const isAttiva = attiva === valore;
        return (
          <motion.button
            key={etichetta}
            type="button"
            data-interactive
            whileTap={vuota ? undefined : { scale: 0.96 }}
            // ricliccare quella attiva torna a mostrare tutto
            onClick={() => !vuota && onPick(isAttiva ? null : valore)}
            disabled={vuota}
            aria-pressed={isAttiva}
            className={`relative px-2 py-1 font-display text-3xl font-bold tracking-tight transition-colors sm:text-4xl lg:text-5xl ${
              isAttiva
                ? "text-sb-bg"
                : vuota
                  ? "cursor-not-allowed text-sb-ink-soft/25"
                  : "text-sb-ink hover:text-sb-accent"
            }`}
          >
            {isAttiva && (
              <motion.svg
                layoutId="sb-macro-attiva"
                viewBox="0 0 40 40"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="absolute -inset-x-1 -inset-y-1 h-[calc(100%+0.5rem)] w-[calc(100%+0.5rem)] fill-sb-accent"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              >
                <path d={MACCHIA} />
              </motion.svg>
            )}
            <span className="relative">{etichetta}</span>
            <sup
              className={`relative ml-0.5 align-super text-xs font-semibold tabular-nums sm:text-sm ${
                isAttiva ? "text-sb-bg/70" : "text-sb-ink-soft"
              }`}
            >
              {conteggio}
            </sup>
          </motion.button>
        );
      })}
    </div>
  );
}

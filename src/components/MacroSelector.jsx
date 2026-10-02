"use client";

import { motion } from "framer-motion";
import { macroList } from "@/data/macroCategories";

// prendono il posto del titolo della sezione: non sono un filtro fra
// i tanti, sono le parole che dicono di che lavoro si tratta
export default function MacroSelector({ attiva, onPick, conteggi }) {
  const voci = macroList();

  return (
    <div
      className="flex flex-wrap items-baseline gap-x-5 gap-y-1"
      role="group"
      aria-label="Categories"
    >
      {voci.map(({ etichetta }) => {
        const vuota = (conteggi.get(etichetta) ?? 0) === 0;
        const isAttiva = attiva === etichetta;
        return (
          <motion.button
            key={etichetta}
            type="button"
            data-interactive
            whileTap={vuota ? undefined : { scale: 0.97 }}
            // ricliccare quella attiva torna a mostrare tutto
            onClick={() => !vuota && onPick(isAttiva ? null : etichetta)}
            disabled={vuota}
            aria-pressed={isAttiva}
            className={`font-display text-xl font-bold tracking-tight transition-colors sm:text-2xl ${
              isAttiva
                ? "text-sb-accent"
                : vuota
                  ? "cursor-not-allowed text-sb-ink-soft/25"
                  : "text-sb-ink-soft hover:text-sb-ink"
            }`}
          >
            {etichetta}
          </motion.button>
        );
      })}
    </div>
  );
}

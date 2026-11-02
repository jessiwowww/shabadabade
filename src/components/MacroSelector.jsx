"use client";

import { motion } from "framer-motion";
import { macroList } from "@/data/macroCategories";

// prendono il posto del titolo della sezione: non sono un filtro fra
// i tanti, sono le parole che dicono di che lavoro si tratta.
// Niente "All": si torna a tutto ricliccando quella attiva
export default function MacroSelector({ attiva, onPick, conteggi }) {
  // le categorie senza contenuti non si mostrano affatto: una parola
  // spenta che non si può premere è solo una promessa non mantenuta
  const voci = macroList().filter((v) => (conteggi.get(v.etichetta) ?? 0) > 0);
  if (voci.length === 0) return null;

  return (
    <div
      className="flex flex-wrap items-baseline gap-x-5 gap-y-1 sm:gap-x-7"
      role="group"
      aria-label="Categories"
    >
      {voci.map(({ etichetta }) => {
        const isAttiva = attiva === etichetta;
        return (
          <motion.button
            key={etichetta}
            type="button"
            data-interactive
            whileTap={{ scale: 0.97 }}
            onClick={() => onPick(isAttiva ? null : etichetta)}
            aria-pressed={isAttiva}
            className={`font-display text-3xl font-bold tracking-tight transition-colors sm:text-4xl lg:text-5xl ${
              isAttiva
                ? "text-sb-accent"
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

import { motion } from "framer-motion";

/*
  Categorie commissionabili: ogni card attiva il tag corrispondente
  e porta alla griglia. `tag` deve esistere nei dati progetti perché
  il filtro mostri qualcosa.
*/
const CATEGORIE = [
  { label: "Logos", tag: "logo", nota: "for businesses that want a face" },
  { label: "Illustrations", tag: "illustration", nota: "editorial, covers, gifts" },
  { label: "T-shirts", tag: "t-shirt", nota: "graphics you can wear" },
  { label: "Invitations", tag: "invitation", nota: "weddings, parties, occasions" },
  { label: "Tattoos", tag: "tattoo", nota: "flash and custom designs" },
  { label: "Local graphics", tag: "local graphics", nota: "posters, signs, markets" },
];

export default function Commissioni({ onPick }) {
  return (
    <section id="commissioni" className="scroll-mt-12 px-5 py-14 sm:px-8 lg:px-12">
      <h2 className="mb-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
        What you can commission
      </h2>
      <p className="mb-8 max-w-xl text-sb-ink-soft">
        Tap a category to see that kind of work. Then write to me.
      </p>

      <div className="grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3">
        {CATEGORIE.map((cat) => (
          <motion.button
            key={cat.tag}
            type="button"
            data-interactive
            onClick={() => onPick(cat.tag)}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.97 }}
            className="min-h-11 rounded-xl border border-sb-ink/15 bg-sb-surface p-5 text-left transition-colors hover:border-sb-accent"
          >
            <span className="block font-display text-lg font-semibold text-sb-ink">
              {cat.label}
            </span>
            <span className="mt-1 block text-xs text-sb-ink-soft">{cat.nota}</span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

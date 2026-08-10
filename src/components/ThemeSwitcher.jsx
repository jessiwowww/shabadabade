import { motion } from "framer-motion";

/*
  Switch tema in alto a destra: nero / bianco / colore random.
  I primi due sono pallini pieni, il terzo un pallino "tempera"
  multicolore. Ricliccare random ri-estrae un colore al volo.
*/
const OPZIONI = [
  { mode: "nero", label: "Black theme", swatch: "#000000", border: true },
  { mode: "bianco", label: "White theme", swatch: "#f7f4ec", border: true },
  {
    mode: "random",
    label: "Random colour theme",
    swatch:
      "conic-gradient(#2e4fb7, #6c4ab0, #e884a8, #c4472f, #f5c842, #3e7c55, #2e4fb7)",
    border: false,
  },
];

export default function ThemeSwitcher({ mode, setMode }) {
  return (
    <div
      className="fixed right-4 top-4 z-40 flex items-center gap-1 rounded-full border border-sb-ink/15 bg-sb-surface/80 px-1.5 py-1 backdrop-blur"
      role="group"
      aria-label="Site colour"
    >
      {OPZIONI.map((opt) => {
        const active = mode === opt.mode;
        return (
          <motion.button
            key={opt.mode}
            type="button"
            data-interactive
            onClick={() => setMode(opt.mode)}
            whileTap={{ scale: 0.88 }}
            aria-label={opt.label}
            aria-pressed={active}
            title={opt.mode === "random" ? "Random colour (different every time)" : opt.label}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-shadow ${
              active ? "ring-2 ring-sb-accent" : "hover:ring-2 hover:ring-sb-ink/30"
            }`}
          >
            <span
              aria-hidden="true"
              className={`block h-5 w-5 rounded-full ${
                opt.border ? "border border-sb-ink/40" : ""
              }`}
              style={{ background: opt.swatch }}
            />
          </motion.button>
        );
      })}
    </div>
  );
}

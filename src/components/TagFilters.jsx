"use client";

import { motion } from "framer-motion";

// deterministica per tag: una rotazione casuale cambierebbe a ogni render
function pinRotation(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return (Math.abs(hash) % 9) - 4; // da -4 a +4 gradi
}

function Pin({ tag, maxCount, active, onToggle, compact = false }) {
  // senza riscontro nella macro attiva: resta visibile e barrato
  // invece di sparire, altrimenti sembra che il tag non esista
  const nonDisponibile = tag.count === 0;
  const weight = maxCount > 1 ? (tag.count - 1) / (maxCount - 1) : 1;
  const fontSize = compact
    ? `${(0.68 + weight * 0.22).toFixed(2)}rem`
    : `${(0.78 + weight * 0.3).toFixed(2)}rem`;
  const opacity = active ? 1 : 0.55 + weight * 0.45;

  return (
    <motion.button
      type="button"
      data-interactive
      onClick={() => !nonDisponibile && onToggle(tag.name)}
      disabled={nonDisponibile}
      aria-pressed={active}
      whileHover={nonDisponibile ? undefined : { scale: 1.08, rotate: 0 }}
      whileTap={nonDisponibile ? undefined : { scale: 0.94 }}
      className={`relative inline-flex items-center gap-1.5 rounded-full border font-sans transition-colors ${
        compact ? "min-h-7 px-2.5 py-0.5" : "min-h-11 px-3.5 py-1.5"
      } ${
        nonDisponibile
          ? active
            ? // tiene il colore di "attivo": senza, sembrerebbe che
              // non l'avevi mai selezionato
              "cursor-not-allowed border-dashed border-sb-accent bg-sb-accent/10 text-sb-accent line-through decoration-sb-accent/60"
            : "cursor-not-allowed border-dashed border-sb-ink/20 bg-transparent text-sb-ink-soft"
          : active
            ? "border-sb-accent bg-sb-accent/15 text-sb-accent"
            : "border-sb-ink/25 bg-sb-surface text-sb-ink hover:border-sb-ink/60"
      }`}
      style={{
        fontSize,
        opacity: nonDisponibile ? (active ? 0.85 : 0.45) : opacity,
        rotate: `${pinRotation(tag.name)}deg`,
      }}
    >
      <span
        aria-hidden="true"
        className={`absolute -left-1 -top-1 rounded-full border-2 border-sb-bg shadow ${
          compact ? "h-2.5 w-2.5" : "h-3 w-3"
        } ${
          nonDisponibile
            ? active
              ? "bg-sb-accent/60"
              : "bg-sb-ink/25"
            : active
              ? "bg-sb-accent"
              : "bg-sb-ink/70"
        }`}
      />
      {tag.name}
      <span className={active ? "text-sb-accent/70" : "text-sb-ink-soft"}>
        {nonDisponibile ? "✕" : tag.count}
      </span>
    </motion.button>
  );
}

export default function TagFilters({
  tags,
  activeTags,
  onToggle,
  onClear,
  macro,
  compact = false,
}) {
  const maxCount = Math.max(1, ...tags.map((t) => t.count));
  // detto anche a parole: il solo pin barrato può sfuggire
  const ignorati = tags.filter((t) => t.count === 0 && activeTags.has(t.name));
  return (
    <>
      <div
        className={
          compact
            ? "flex flex-wrap gap-x-2 gap-y-2.5"
            : "flex flex-wrap gap-x-3 gap-y-3.5"
        }
      >
        {tags.map((tag) => (
          <Pin
            key={tag.name}
            tag={tag}
            maxCount={maxCount}
            active={activeTags.has(tag.name)}
            onToggle={onToggle}
            compact={compact}
          />
        ))}
      </div>
      {ignorati.length > 0 && (
        <p
          className={`text-sb-accent ${compact ? "mt-4 text-[0.7rem]" : "mt-5 text-xs"}`}
        >
          {ignorati.length === 1
            ? `“${ignorati[0].name}” isn't`
            : `${ignorati.length} selected tags aren't`}{" "}
          in {macro ?? "this category"} — ignored here.
        </p>
      )}

      {activeTags.size > 0 && (
        <button
          type="button"
          data-interactive
          onClick={onClear}
          className={`text-sb-ink-soft underline underline-offset-4 hover:text-sb-accent ${
            compact ? "mt-4 min-h-8 text-xs" : "mt-5 min-h-11 text-sm"
          }`}
        >
          show all
        </button>
      )}
    </>
  );
}

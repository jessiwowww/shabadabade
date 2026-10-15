import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ricordaCopertina } from "@/lib/transizioni";
import { pezzi, anno } from "@/components/Progetti.jsx";

const INCLINA = [-5, 2, -2, 4];

function Polaroid({ cs, i }) {
  const copertina = useRef(null);
  return (
    <li className="w-[72vw] max-w-72 shrink-0 snap-center sm:w-auto sm:max-w-none">
      <motion.div
        initial={{ opacity: 0, y: 40, rotate: 0 }}
        whileInView={{ opacity: 1, y: 0, rotate: INCLINA[i % INCLINA.length] }}
        viewport={{ once: true, margin: "-60px" }}
        whileHover={{ rotate: 0, y: -10, scale: 1.03 }}
        transition={{ type: "spring", stiffness: 160, damping: 16, delay: i * 0.08 }}
      >
        <Link
          href={`/projects/${cs.slug}`}
          data-interactive
          onClick={() => ricordaCopertina(cs.slug, copertina.current)}
          className="group block bg-sb-surface p-2.5 shadow-[0_18px_45px_rgba(0,0,0,0.32)]"
        >
          {/* proporzioni vere: la copertina deve combaciare con quella
              della pagina del progetto, da cui cresce */}
          <img
            ref={copertina}
            src={cs.copertina.url}
            alt=""
            width={cs.copertina.larghezza}
            height={cs.copertina.altezza}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full"
          />
          <span className="block px-1 pb-1 pt-3">
            <span className="block font-display text-lg font-bold leading-tight tracking-tight transition-colors group-hover:text-sb-accent">
              {cs.titolo}
            </span>
            <span className="mt-1 block text-xs text-sb-ink-soft">
              {anno(cs) ? `${anno(cs)} · ` : ""}
              {pezzi(cs)} pieces
            </span>
          </span>
        </Link>
      </motion.div>
    </li>
  );
}

// i progetti completi sono il contenuto più profondo del sito: senza
// questo richiamo si raggiungevano solo dal menu
export default function ProgettiTeaser({ caseStudies }) {
  if (!caseStudies?.length) return null;
  const mostrati = caseStudies.slice(0, 4);

  return (
    <section
      id="progetti"
      className="scroll-mt-16 overflow-hidden border-t border-sb-ink/15 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-sb-ink-soft">Projects</p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
            Some work needs the whole story.
          </h2>
        </div>
        <Link
          href="/projects"
          data-interactive
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline-offset-4 hover:text-sb-accent hover:underline"
        >
          All projects <span aria-hidden="true">→</span>
        </Link>
      </div>

      {/* su telefono una fila da scorrere col dito */}
      <ul className={`sb-strip -mx-5 mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-8 pt-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:items-start sm:gap-8 sm:overflow-visible sm:px-0 lg:gap-12 ${mostrati.length > 3 ? "lg:grid-cols-4" : ""}`}>
        {mostrati.map((cs, i) => (
          <Polaroid key={cs.id} cs={cs} i={i} />
        ))}
      </ul>
    </section>
  );
}

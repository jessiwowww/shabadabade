"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ricordaCopertina } from "@/lib/transizioni";

const INCLINA = [3, -2.5, 2, -3.5];

export const pezzi = (cs) => cs.contenuti.filter((b) => b.tipo !== "testo").length;
// la data è facoltativa in Sanity: senza, non si stampa niente
export const anno = (cs) => (cs.data ? new Date(cs.data).getFullYear() : null);

function Voce({ cs, i }) {
  const copertina = useRef(null);
  const inclina = INCLINA[i % INCLINA.length];

  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className="border-b border-sb-ink/15"
    >
      <Link
        href={`/projects/${cs.slug}`}
        data-interactive
        onClick={() => ricordaCopertina(cs.slug, copertina.current)}
        className="group grid gap-6 py-10 md:grid-cols-[4rem_1fr_minmax(0,20rem)] md:items-center md:gap-10 lg:grid-cols-[5rem_1fr_minmax(0,24rem)] lg:py-14"
      >
        <span className="font-nome text-3xl text-sb-accent md:self-start md:pt-2">
          {String(i + 1).padStart(2, "0")}
        </span>

        <span className="md:order-none order-last block">
          <span className="block font-display text-4xl font-bold leading-[1.02] tracking-tight transition-colors group-hover:text-sb-accent sm:text-5xl lg:text-6xl">
            {cs.titolo}
          </span>
          <span className="mt-5 block max-w-xl leading-relaxed text-sb-ink-soft">
            {cs.descrizione}
          </span>
          <span className="mt-6 inline-flex items-center gap-3 text-sm">
            <span className="text-sb-ink-soft">
              {anno(cs) ? `${anno(cs)} · ` : ""}
              {pezzi(cs)} pieces
            </span>
            <span
              aria-hidden="true"
              className="font-semibold transition-transform duration-300 group-hover:translate-x-2"
            >
              Read →
            </span>
          </span>
        </span>

        <span
          className="block w-[min(82%,22rem)] justify-self-center bg-sb-surface p-2.5 pb-9 shadow-[0_18px_45px_rgba(0,0,0,0.32)] transition-transform duration-500 ease-out group-hover:rotate-0 group-hover:scale-[1.03] md:w-full"
          style={{ rotate: `${inclina}deg` }}
        >
          <img
            ref={copertina}
            src={cs.copertina.url}
            alt=""
            width={cs.copertina.larghezza}
            height={cs.copertina.altezza}
            loading={i < 2 ? "eager" : "lazy"}
            decoding="async"
            className="block h-auto w-full"
          />
        </span>
      </Link>
    </motion.li>
  );
}

export default function Progetti({ caseStudies }) {
  return (
    <section className="min-h-screen px-5 pb-20 pt-28 sm:px-8 lg:px-12 lg:pt-32">
      <p className="text-xs uppercase tracking-[0.25em] text-sb-ink-soft">
        Projects
      </p>
      <h1 className="mt-3 max-w-4xl font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl">
        The whole story.
      </h1>
      <p className="mt-5 max-w-xl text-lg text-sb-ink-soft">
        Full projects, told properly: process, final pieces and everything
        in between.
      </p>

      <ol className="mt-14 border-t border-sb-ink/15">
        {caseStudies.map((cs, i) => (
          <Voce key={cs.id} cs={cs} i={i} />
        ))}
      </ol>
    </section>
  );
}

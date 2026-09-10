"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/*
  Pagina "Projects": i lavori completi (case study), ognuno con la sua
  copertina scelta da Sharon. Ogni progetto ha il suo indirizzo
  (/projects/<slug>), quindi si può condividere singolarmente.
*/
export default function Progetti({ caseStudies }) {
  return (
    <section className="min-h-screen px-5 pb-14 pt-24 sm:px-8 lg:px-12 lg:pt-14">
      <h1 className="mb-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
        Projects
      </h1>
      <p className="mb-8 max-w-xl text-sb-ink-soft">
        Full projects, told properly: process, final pieces and everything
        in between.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {caseStudies.map((cs, i) => (
          <motion.div
            key={cs.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
          >
            <Link
              href={`/projects/${cs.slug}`}
              data-interactive
              className="group block overflow-hidden rounded-xl bg-sb-surface"
            >
              <span className="block overflow-hidden">
                <img
                  src={cs.copertina.url}
                  alt={cs.titolo}
                  width={cs.copertina.larghezza}
                  height={cs.copertina.altezza}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[3/2] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
              </span>
              <span className="block p-4">
                <span className="block font-display text-lg font-semibold">
                  {cs.titolo}
                </span>
                <span className="mt-1 block text-xs text-sb-ink-soft">
                  {new Date(cs.data).getFullYear()} ·{" "}
                  {cs.contenuti.filter((b) => b.tipo !== "testo").length} pieces
                </span>
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

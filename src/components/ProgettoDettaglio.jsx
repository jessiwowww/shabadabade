"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const SOGLIA_TRASCINAMENTO = 80;

function Blocco({ blocco }) {
  if (blocco.tipo === "testo") {
    return (
      <div className="max-w-2xl">
        {blocco.titolo && (
          <h2 className="mb-3 font-display text-xl font-bold tracking-tight">
            {blocco.titolo}
          </h2>
        )}
        <p className="leading-relaxed">{blocco.corpo}</p>
      </div>
    );
  }

  if (blocco.tipo === "immagine") {
    return (
      <figure>
        <img
          src={blocco.immagine.url}
          alt={blocco.didascalia ?? ""}
          width={blocco.immagine.larghezza}
          height={blocco.immagine.altezza}
          loading="lazy"
          decoding="async"
          className="h-auto w-full rounded-xl"
        />
        {blocco.didascalia && (
          <figcaption className="mt-2 text-sm text-sb-ink-soft">
            {blocco.didascalia}
          </figcaption>
        )}
      </figure>
    );
  }

  if (blocco.tipo === "video") {
    return (
      <figure>
        <video
          src={blocco.url}
          poster={blocco.poster?.url}
          width={blocco.poster?.larghezza}
          height={blocco.poster?.altezza}
          controls
          loop
          muted
          playsInline
          preload="metadata"
          className="h-auto w-full rounded-xl"
        />
        {blocco.didascalia && (
          <figcaption className="mt-2 text-sm text-sb-ink-soft">
            {blocco.didascalia}
          </figcaption>
        )}
      </figure>
    );
  }

  return null;
}

export default function ProgettoDettaglio({
  caseStudy,
  precedente,
  successivo,
}) {
  const router = useRouter();

  return (
    <motion.article
      key={caseStudy.slug}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      /* trascinamento laterale per passare al progetto vicino;
         dragDirectionLock perché non rubi lo scorrimento verticale */
      drag="x"
      dragDirectionLock
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.15}
      onDragEnd={(_, info) => {
        if (info.offset.x < -SOGLIA_TRASCINAMENTO && successivo) {
          router.push(`/projects/${successivo.slug}`);
        } else if (info.offset.x > SOGLIA_TRASCINAMENTO && precedente) {
          router.push(`/projects/${precedente.slug}`);
        }
      }}
      className="min-h-screen px-5 pb-14 pt-24 sm:px-8 lg:px-12 lg:pt-14"
    >
      <Link
        href="/projects"
        data-interactive
        className="inline-flex min-h-11 items-center text-sm text-sb-ink-soft hover:text-sb-accent"
      >
        ← All projects
      </Link>

      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
        {caseStudy.titolo}
      </h1>
      <p className="mt-2 text-xs text-sb-ink-soft">
        {new Date(caseStudy.data).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "long",
        })}
      </p>
      <p className="mt-5 max-w-2xl leading-relaxed">
        {caseStudy.descrizione}
      </p>

      <div className="mt-12 flex max-w-3xl flex-col gap-10">
        {caseStudy.contenuti.map((blocco, i) => (
          <Blocco key={i} blocco={blocco} />
        ))}
      </div>

      {(precedente || successivo) && (
        <nav className="mt-16 flex max-w-3xl items-start justify-between gap-6 border-t border-sb-ink/15 pt-6">
          {precedente ? (
            <Link
              href={`/projects/${precedente.slug}`}
              data-interactive
              className="group max-w-[45%]"
            >
              <span className="block text-[0.7rem] uppercase tracking-[0.2em] text-sb-ink-soft">
                ← Previous
              </span>
              <span className="mt-1 block font-display font-semibold group-hover:text-sb-accent">
                {precedente.titolo}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {successivo && (
            <Link
              href={`/projects/${successivo.slug}`}
              data-interactive
              className="group max-w-[45%] text-right"
            >
              <span className="block text-[0.7rem] uppercase tracking-[0.2em] text-sb-ink-soft">
                Next →
              </span>
              <span className="mt-1 block font-display font-semibold group-hover:text-sb-accent">
                {successivo.titolo}
              </span>
            </Link>
          )}
        </nav>
      )}

      <p className="mt-6 text-xs text-sb-ink-soft/60 lg:hidden">
        Swipe left or right for the next project
      </p>
    </motion.article>
  );
}

import { motion } from "framer-motion";

/*
  Dettaglio di un progetto completo: titolo, intro e contenuti a
  blocchi (testo / immagine / video) nell'ordine deciso da Sharon —
  lo stesso argomento sviscerato alternando racconto e tavole.
*/
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
export default function ProgettoDettaglio({ caseStudy, loading }) {
  if (!caseStudy) {
    return (
      <section className="min-h-screen px-5 pb-14 pt-24 sm:px-8 lg:px-12 lg:pt-14">
        <p className="text-sb-ink-soft">
          {loading ? "Loading project…" : "Project not found."}
        </p>
        {!loading && (
          <a
            href="#/projects"
            data-interactive
            className="mt-4 inline-flex min-h-11 items-center text-sm text-sb-ink underline underline-offset-4 hover:text-sb-accent"
          >
            ← All projects
          </a>
        )}
      </section>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen px-5 pb-14 pt-24 sm:px-8 lg:px-12 lg:pt-14"
    >
      <a
        href="#/projects"
        data-interactive
        className="inline-flex min-h-11 items-center text-sm text-sb-ink-soft hover:text-sb-accent"
      >
        ← All projects
      </a>

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
    </motion.article>
  );
}

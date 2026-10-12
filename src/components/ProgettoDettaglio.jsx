"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { bloccaScroll } from "@/lib/scrollLock";
import { cresciDa, prendiCopertina, ricordaCopertina } from "@/lib/transizioni";
import { pezzi, anno } from "@/components/Progetti.jsx";

const SOGLIA_TRASCINAMENTO = 80;

const formato = (b) => (b.tipo === "video" ? b.poster : b.immagine);
const verticale = (b) => {
  const f = formato(b);
  return b.tipo === "immagine" && f && f.altezza > f.larghezza * 1.05;
};

/*
  L'impaginazione nasce dal contenuto, non da Sharon: le immagini
  verticali consecutive si affiancano (tre poster stanno in fila
  invece che uno sotto l'altro), quelle orizzontali e i video vanno
  a tutta larghezza, le quadrate si alternano a destra e a sinistra.
*/
function raggruppa(contenuti) {
  const gruppi = [];
  for (const b of contenuti) {
    const ultimo = gruppi.at(-1);
    if (verticale(b) && ultimo?.tipo === "fila" && ultimo.blocchi.length < 3) {
      ultimo.blocchi.push(b);
    } else if (verticale(b)) {
      gruppi.push({ tipo: "fila", blocchi: [b] });
    } else {
      gruppi.push({ tipo: "singolo", blocco: b });
    }
  }
  return gruppi;
}

const entra = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] },
};

function Didascalia({ testo }) {
  if (!testo) return null;
  return <figcaption className="mt-3 text-sm text-sb-ink-soft">{testo}</figcaption>;
}

function Immagine({ blocco, onZoom, className = "" }) {
  const img = useRef(null);
  return (
    <motion.figure {...entra} className={className}>
      <button
        type="button"
        data-interactive
        onClick={() => onZoom(blocco, img.current)}
        aria-label={`Enlarge${blocco.didascalia ? `: ${blocco.didascalia}` : " image"}`}
        className="block w-full cursor-zoom-in"
      >
        <img
          ref={img}
          src={blocco.immagine.url}
          alt={blocco.didascalia ?? ""}
          width={blocco.immagine.larghezza}
          height={blocco.immagine.altezza}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full"
        />
      </button>
      <Didascalia testo={blocco.didascalia} />
    </motion.figure>
  );
}

function Testo({ blocco }) {
  return (
    <motion.div {...entra} className="grid gap-4 lg:grid-cols-[16rem_1fr] lg:gap-12">
      <div>
        {blocco.titolo && (
          <h2 className="font-display text-2xl font-bold tracking-tight lg:sticky lg:top-24">
            {blocco.titolo}
          </h2>
        )}
      </div>
      <p className="max-w-2xl text-lg leading-relaxed sm:text-xl">{blocco.corpo}</p>
    </motion.div>
  );
}

function Singolo({ blocco, lato, onZoom }) {
  if (blocco.tipo === "testo") return <Testo blocco={blocco} />;

  if (blocco.tipo === "video") {
    return (
      <motion.figure {...entra}>
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
          className="block h-auto w-full"
        />
        <Didascalia testo={blocco.didascalia} />
      </motion.figure>
    );
  }

  if (blocco.tipo === "immagine") {
    const f = blocco.immagine;
    const orizzontale = f.larghezza > f.altezza * 1.05;
    return (
      <Immagine
        blocco={blocco}
        onZoom={onZoom}
        className={
          orizzontale
            ? "w-full"
            : `w-full md:w-[68%] ${lato ? "md:ml-auto" : ""}`
        }
      />
    );
  }

  return null;
}

// ingrandimento a schermo intero, cresce dall'immagine cliccata
function Zoom({ zoom, onClose }) {
  const img = useRef(null);

  useLayoutEffect(() => {
    if (!zoom || !img.current) return;
    const f = zoom.blocco.immagine;
    cresciDa(img.current, zoom.rect, f.larghezza, f.altezza, 420);
  }, [zoom]);

  useEffect(() => {
    if (!zoom) return;
    const sblocca = bloccaScroll();
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => {
      sblocca();
      window.removeEventListener("keydown", esc);
      zoom.ritorno?.focus({ preventScroll: true });
    };
  }, [zoom, onClose]);

  return (
    <AnimatePresence>
      {zoom && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={zoom.blocco.didascalia ?? "Image"}
          className="fixed inset-0 z-50 flex cursor-zoom-out flex-col items-center justify-center p-4 sm:p-8"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          data-interactive
        >
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-sb-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          />
          <img
            ref={img}
            src={zoom.blocco.immagine.url}
            alt={zoom.blocco.didascalia ?? ""}
            width={zoom.blocco.immagine.larghezza}
            height={zoom.blocco.immagine.altezza}
            className="relative max-h-[86vh] w-auto max-w-full object-contain"
          />
          {zoom.blocco.didascalia && (
            <p className="relative mt-4 text-sm text-sb-ink-soft">{zoom.blocco.didascalia}</p>
          )}
          <button
            type="button"
            autoFocus
            data-interactive
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-sb-surface text-sb-ink hover:text-sb-accent"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Prossimo({ successivo, precedente }) {
  const copertina = useRef(null);
  if (!successivo) return null;
  return (
    <nav aria-label="More projects" className="mt-28 border-t border-sb-ink/15 pt-10">
      <Link
        href={`/projects/${successivo.slug}`}
        data-interactive
        onClick={() => ricordaCopertina(successivo.slug, copertina.current)}
        className="group grid gap-8 md:grid-cols-[1fr_minmax(0,18rem)] md:items-center"
      >
        <span>
          <span className="block text-xs uppercase tracking-[0.25em] text-sb-ink-soft">
            Next project
          </span>
          <span className="mt-3 block font-display text-4xl font-bold leading-[1.02] tracking-tight transition-colors group-hover:text-sb-accent sm:text-6xl">
            {successivo.titolo}{" "}
            <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-3">
              →
            </span>
          </span>
        </span>
        <span className="block w-[min(70%,16rem)] -rotate-3 bg-sb-surface p-2 pb-7 shadow-[0_18px_45px_rgba(0,0,0,0.32)] transition-transform duration-500 group-hover:rotate-0 md:w-full">
          <img
            ref={copertina}
            src={successivo.copertina.url}
            alt=""
            width={successivo.copertina.larghezza}
            height={successivo.copertina.altezza}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full"
          />
        </span>
      </Link>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 text-sm">
        <Link
          href="/projects"
          data-interactive
          className="inline-flex min-h-11 items-center text-sb-ink-soft hover:text-sb-accent"
        >
          ← All projects
        </Link>
        {precedente && (
          <Link
            href={`/projects/${precedente.slug}`}
            data-interactive
            className="inline-flex min-h-11 items-center text-sb-ink-soft hover:text-sb-accent"
          >
            Previous: {precedente.titolo}
          </Link>
        )}
      </div>
    </nav>
  );
}

export default function ProgettoDettaglio({ caseStudy, precedente, successivo }) {
  const router = useRouter();
  const isDesktop = useIsDesktop();
  const copertina = useRef(null);
  const [zoom, setZoom] = useState(null);
  const chiudiZoom = useCallback(() => setZoom(null), []);
  const apriZoom = useCallback(
    (blocco, el) =>
      setZoom({ blocco, rect: el.getBoundingClientRect(), ritorno: el.closest("button") }),
    []
  );
  const { scrollYProgress } = useScroll();
  const avanzamento = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  useLayoutEffect(() => {
    const rect = prendiCopertina(caseStudy.slug);
    if (rect && copertina.current) {
      // Next riporterebbe in cima dopo questa misura: lo si fa prima,
      // o la copertina partirebbe dal punto sbagliato
      window.scrollTo({ top: 0, behavior: "instant" });
      const f = caseStudy.copertina;
      cresciDa(copertina.current, rect, f.larghezza, f.altezza, 560);
    }
  }, [caseStudy]);

  const gruppi = raggruppa(caseStudy.contenuti);
  let alternanza = 0;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-16 z-30 h-0.5 origin-left bg-sb-accent"
        style={{ scaleX: avanzamento }}
      />

      <motion.article
        key={caseStudy.slug}
        // col dito si scorre al progetto vicino; col mouse no, il
        // trascinamento rubava la selezione del testo
        drag={isDesktop ? false : "x"}
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
        className="min-h-screen px-5 pb-16 pt-28 sm:px-8 lg:px-12"
      >
        <Link
          href="/projects"
          data-interactive
          className="inline-flex min-h-11 items-center text-sm text-sb-ink-soft hover:text-sb-accent"
        >
          ← All projects
        </Link>

        <header className="mt-6 grid gap-10 lg:grid-cols-[1fr_minmax(0,34rem)] lg:items-end lg:gap-16">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl"
            >
              {caseStudy.titolo}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 max-w-xl text-lg leading-relaxed sm:text-xl"
            >
              {caseStudy.descrizione}
            </motion.p>
            <motion.dl
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex gap-10 text-sm"
            >
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-sb-ink-soft">Year</dt>
                <dd className="mt-1 font-semibold">{anno(caseStudy)}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-sb-ink-soft">Pieces</dt>
                <dd className="mt-1 font-semibold">{pezzi(caseStudy)}</dd>
              </div>
            </motion.dl>
          </div>

          <img
            ref={copertina}
            src={caseStudy.copertina.url}
            alt=""
            width={caseStudy.copertina.larghezza}
            height={caseStudy.copertina.altezza}
            fetchPriority="high"
            className="block max-h-[78vh] w-full object-contain"
          />
        </header>

        <div className="mt-24 flex flex-col gap-16 sm:gap-24">
          {gruppi.map((g, i) =>
            g.tipo === "fila" ? (
              <div
                key={i}
                className={`grid gap-6 ${
                  g.blocchi.length === 3
                    ? "sm:grid-cols-3"
                    : g.blocchi.length === 2
                      ? "sm:grid-cols-2"
                      : "sm:w-[52%] " + (alternanza++ % 2 ? "sm:ml-auto" : "")
                }`}
              >
                {g.blocchi.map((b, j) => (
                  <Immagine key={j} blocco={b} onZoom={apriZoom} />
                ))}
              </div>
            ) : (
              <Singolo
                key={i}
                blocco={g.blocco}
                lato={g.blocco.tipo === "immagine" && alternanza++ % 2 === 1}
                onZoom={apriZoom}
              />
            )
          )}
        </div>

        <Prossimo successivo={successivo} precedente={precedente} />

        <p className="mt-8 text-xs text-sb-ink-soft/60 lg:hidden">
          Swipe left or right for the next project
        </p>
      </motion.article>

      <Zoom zoom={zoom} onClose={chiudiZoom} />
    </>
  );
}

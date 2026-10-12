"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EMAIL, SOCIAL, mailto } from "@/data/contatti";

/*
  Contatti come una cartolina: nessun form, solo email diretta e
  social. L'email si copia con un clic, perché non tutti hanno un
  programma di posta collegato al browser.
*/
export default function Contatti() {
  const [copiata, setCopiata] = useState(false);
  const timer = useRef(null);

  const copia = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopiata(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopiata(false), 2200);
    } catch {
      window.location.href = mailto();
    }
  };

  return (
    <section id="contatti" className="scroll-mt-16 px-5 pb-16 pt-20 sm:px-8 lg:px-12 lg:pt-28">
      <h2 className="sr-only">Contact</h2>

      <motion.div
        initial={{ rotate: 0, y: 30, opacity: 0 }}
        whileInView={{ rotate: -1.5, y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ type: "spring", stiffness: 80, damping: 14 }}
        className="relative mx-auto grid max-w-4xl bg-sb-surface text-sb-ink shadow-[0_24px_60px_rgba(0,0,0,0.35)] md:grid-cols-2"
      >
        <div className="p-7 sm:p-10 md:border-r md:border-dashed md:border-sb-ink/25">
          <p className="font-nome text-3xl sm:text-4xl">Hello!</p>
          <p className="mt-5 text-lg leading-relaxed">
            Got a logo, an invitation or an order in mind? Drop me a line —
            I answer personally.
          </p>
          <p className="mt-6 text-sm text-sb-ink-soft">— Sharon</p>
        </div>

        <div className="relative p-7 pt-0 sm:p-10 md:pt-10">
          {/* francobolli: i social */}
          <ul className="flex justify-end gap-3">
            {SOCIAL.map((s, i) => (
              <li key={s.label}>
                <motion.a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  data-interactive
                  whileHover={{ rotate: 0, y: -4 }}
                  style={{ rotate: i % 2 ? 4 : -3 }}
                  className="flex h-20 w-16 flex-col items-center justify-center gap-1 border-2 border-dotted border-sb-ink/50 bg-sb-bg p-1 text-center text-sb-ink transition-colors hover:border-sb-accent hover:text-sb-accent"
                >
                  <span className="font-nome text-xl leading-none">{s.label[0]}</span>
                  <span className="text-[0.6rem] leading-tight">{s.label}</span>
                  <span className="sr-only">{s.value}</span>
                </motion.a>
              </li>
            ))}
          </ul>

          <div className="mt-10 space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-sb-ink-soft">To</p>
            <a
              href={mailto()}
              data-interactive
              className="block break-all border-b border-sb-ink/30 pb-2 font-display text-xl font-bold tracking-tight underline-offset-4 hover:text-sb-accent sm:text-2xl"
            >
              {EMAIL}
            </a>
            <p className="border-b border-sb-ink/30 pb-2 text-sm text-sb-ink-soft">
              London, UK
            </p>
          </div>

          <button
            type="button"
            data-interactive
            onClick={copia}
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-sb-ink px-5 text-sm font-semibold text-sb-bg transition-colors hover:bg-sb-accent"
          >
            Copy the address
          </button>
          <p role="status" className="sr-only">
            {copiata ? "Email address copied" : ""}
          </p>

          <AnimatePresence>
            {copiata && (
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-6 right-6 flex h-24 w-24 items-center justify-center rounded-full border-[3px] border-sb-accent text-center text-xs font-bold uppercase leading-tight tracking-widest text-sb-accent"
                initial={{ scale: 1.8, opacity: 0, rotate: -30 }}
                animate={{ scale: 1, opacity: 1, rotate: -12 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 18 }}
              >
                Copied
                <br />
                London
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <p className="mt-16 text-center text-xs text-sb-ink-soft/60">
        © {new Date().getFullYear()} Sharon Bertoncello — London
      </p>
    </section>
  );
}

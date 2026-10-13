"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { bloccaScroll } from "@/lib/scrollLock";
import { scrollToAnchor } from "@/lib/anchorScroll";

// scroll={false}: ci pensa scrollToAnchor, o Next salta in cima e
// annulla lo scorrimento verso la sezione
// Projects solo se ce n'è almeno uno: una voce che porta a una
// pagina vuota non deve esistere
const vociMenu = (haProgetti) => [
  { label: "Work", href: "/#lavori", scroll: false },
  ...(haProgetti ? [{ label: "Projects", href: "/projects" }] : []),
  { label: "About & contact", href: "/#chi-sono", scroll: false },
];

/*
  Se la sezione è già nella pagina ci si scorre e basta: il router di
  Next cambierebbe l'indirizzo senza scorrere (niente hashchange), o
  da una categoria rimonterebbe la home perdendo il filtro.
*/
function vaiAllaSezione(e, href) {
  const hash = href.slice(href.indexOf("#"));
  if (!href.includes("#") || !document.querySelector(hash)) return;
  e.preventDefault();
  window.history.replaceState(null, "", window.location.pathname + hash);
  scrollToAnchor(hash);
}

export default function SiteNav({ haProgetti = false }) {
  const VOCI = vociMenu(haProgetti);
  const pathname = usePathname();
  const suProgetti = pathname?.startsWith("/projects") ?? false;
  const [menuAperto, setMenuAperto] = useState(false);
  const [staccata, setStaccata] = useState(false);
  const bottoneMenu = useRef(null);
  const primaVoce = useRef(null);

  useEffect(() => {
    const onScroll = () => setStaccata(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuAperto) return;
    const sblocca = bloccaScroll();
    primaVoce.current?.focus();
    const esc = (e) => e.key === "Escape" && setMenuAperto(false);
    window.addEventListener("keydown", esc);
    const bottone = bottoneMenu.current;
    return () => {
      sblocca();
      window.removeEventListener("keydown", esc);
      bottone?.focus();
    };
  }, [menuAperto]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between bg-sb-bg px-5 transition-[border-color] sm:px-8 lg:pl-12 lg:pr-24 ${
          staccata ? "border-b border-sb-ink/10" : "border-b border-transparent"
        }`}
      >
        <Link
          href="/"
          data-interactive
          className="inline-flex min-h-11 items-center font-nome text-lg text-sb-ink"
        >
          <span className="text-sb-accent">sha</span>badabade
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {VOCI.map((v) => {
              const attiva = v.href === "/projects" && suProgetti;
              return (
                <li key={v.label}>
                  <Link
                    href={v.href}
                    scroll={v.scroll}
                    data-interactive
                    aria-current={attiva ? "page" : undefined}
                    onClick={(e) => vaiAllaSezione(e, v.href)}
                    className={`inline-flex min-h-11 items-center px-3 text-sm transition-colors ${
                      attiva
                        ? "font-semibold text-sb-accent"
                        : "text-sb-ink-soft hover:text-sb-accent"
                    }`}
                  >
                    {v.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          ref={bottoneMenu}
          type="button"
          data-interactive
          onClick={() => setMenuAperto(true)}
          aria-expanded={menuAperto}
          aria-controls="sb-menu"
          className="inline-flex min-h-11 items-center px-1 text-sm font-semibold text-sb-ink lg:hidden"
        >
          Menu
        </button>
      </header>

      <AnimatePresence>
        {menuAperto && (
          <motion.div
            id="sb-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-50 flex flex-col bg-sb-bg px-5 pb-10 pt-4 sm:px-8 lg:hidden"
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.45, ease: [0.6, 0, 0.2, 1] }}
          >
            <div className="flex h-12 items-center justify-end">
              <button
                type="button"
                data-interactive
                onClick={() => setMenuAperto(false)}
                className="inline-flex min-h-11 items-center px-1 text-sm font-semibold text-sb-ink"
              >
                Close
              </button>
            </div>
            <nav aria-label="Main" className="mt-6 flex-1">
              <ul className="space-y-1">
                {VOCI.map((v, i) => (
                  <motion.li
                    key={v.label}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 + i * 0.05, duration: 0.4 }}
                  >
                    <Link
                      ref={i === 0 ? primaVoce : undefined}
                      href={v.href}
                      scroll={v.scroll}
                      data-interactive
                      onClick={(e) => {
                        setMenuAperto(false);
                        vaiAllaSezione(e, v.href);
                      }}
                      className="inline-flex min-h-14 items-center font-nome text-4xl text-sb-ink transition-colors hover:text-sb-accent sm:text-5xl"
                    >
                      {v.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <a
              href="mailto:hello@sharonbertoncello.com"
              data-interactive
              className="inline-flex min-h-11 items-center text-sm text-sb-ink-soft underline underline-offset-4"
            >
              hello@sharonbertoncello.com
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

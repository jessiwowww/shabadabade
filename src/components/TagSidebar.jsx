"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

/*
  Sidebar dei tag come "pin/spille" (feature signature) + navigazione.
  Desktop: colonna fissa a sinistra sempre visibile (nav + pin).
  Mobile: mini-nav fissa in alto a sinistra; bottone filtro flottante
  che apre un drawer dal basso (solo in home, dove c'è la griglia).
  I pin sono generati dinamicamente dai tag dei progetti; dimensione e
  opacità crescono con la frequenza d'uso (tag cloud sottile).

  La pagina corrente si ricava dall'indirizzo (usePathname): le pagine
  dei progetti montano la sidebar senza passare nulla.
*/

const NESSUN_TAG_ATTIVO = new Set();

// rotazione leggera ma deterministica per tag, così non cambia a ogni render
function pinRotation(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return (Math.abs(hash) % 9) - 4; // da -4 a +4 gradi
}

function Pin({ tag, maxCount, active, onToggle, compact = false }) {
  const weight = maxCount > 1 ? (tag.count - 1) / (maxCount - 1) : 1;
  // versione compatta (sidebar desktop): scala tipografica ridotta;
  // nel drawer mobile restano i touch target da 44px
  const fontSize = compact
    ? `${(0.68 + weight * 0.22).toFixed(2)}rem`
    : `${(0.78 + weight * 0.3).toFixed(2)}rem`;
  const opacity = active ? 1 : 0.55 + weight * 0.45;

  return (
    <motion.button
      type="button"
      data-interactive
      onClick={() => onToggle(tag.name)}
      aria-pressed={active}
      whileHover={{ scale: 1.08, rotate: 0 }}
      whileTap={{ scale: 0.94 }}
      className={`relative inline-flex items-center gap-1.5 rounded-full border font-sans transition-colors ${
        compact ? "min-h-7 px-2.5 py-0.5" : "min-h-11 px-3.5 py-1.5"
      } ${
        active
          ? "border-sb-accent bg-sb-accent/15 text-sb-accent"
          : "border-sb-ink/25 bg-sb-surface text-sb-ink hover:border-sb-ink/60"
      }`}
      style={{ fontSize, opacity, rotate: `${pinRotation(tag.name)}deg` }}
    >
      {/* testa della spilla */}
      <span
        aria-hidden="true"
        className={`absolute -left-1 -top-1 rounded-full border-2 border-sb-bg shadow ${
          compact ? "h-2.5 w-2.5" : "h-3 w-3"
        } ${active ? "bg-sb-accent" : "bg-sb-ink/70"}`}
      />
      {tag.name}
      <span className={active ? "text-sb-accent/70" : "text-sb-ink-soft"}>
        {tag.count}
      </span>
    </motion.button>
  );
}

function PinList({ tags, activeTags, onToggle, onClear, compact = false }) {
  const maxCount = Math.max(1, ...tags.map((t) => t.count));
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

// La home non ha bisogno di una voce: è "S.B." stesso.
// "About & contact" scende sotto le immagini: bio, commissioni, contatti.
function NavLinks({ suProgetti, vertical = false }) {
  const links = [
    { label: "Projects", href: "/projects", active: suProgetti },
    // scroll={false}: allo scroll ci pensa scrollToAnchor (parte
    // dall'alto e scende), altrimenti Next salta in cima e lo annulla
    { label: "About & contact", href: "/#chi-sono", active: false, scroll: false },
  ];
  return (
    <nav
      className={
        vertical ? "flex flex-col text-sm" : "flex items-center gap-0.5 text-sm"
      }
    >
      {links.map((l) => (
        <Link
          key={l.label}
          href={l.href}
          scroll={l.scroll}
          data-interactive
          aria-current={l.active ? "page" : undefined}
          className={`inline-flex min-h-8 items-center rounded-full px-3 text-[0.82rem] transition-colors ${
            l.active
              ? "font-semibold text-sb-accent"
              : "text-sb-ink-soft hover:text-sb-accent"
          }`}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}

export default function TagSidebar({
  tags = [],
  activeTags = NESSUN_TAG_ATTIVO,
  onToggle,
  onClear,
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const suProgetti = pathname?.startsWith("/projects") ?? false;
  // i filtri esistono solo dove c'è la griglia
  const conFiltri = !suProgetti && tags.length > 0;

  return (
    <>
      {/* Desktop: sidebar fissa con nav + pin, volutamente discreta */}
      <aside className="sb-scroll fixed inset-y-0 left-0 z-20 hidden w-52 flex-col overflow-y-auto border-r border-sb-ink/10 bg-sb-bg px-5 py-8 lg:flex">
        <Link
          href="/"
          data-interactive
          className="font-display text-base font-bold tracking-tight text-sb-ink"
        >
          shabadabade
        </Link>

        <div className="-ml-3 mt-3">
          <NavLinks suProgetti={suProgetti} vertical />
        </div>

        {conFiltri && (
          <>
            <h2 className="mb-5 mt-8 text-[0.65rem] uppercase tracking-[0.2em] text-sb-ink-soft">
              Filter by tag
            </h2>
            <PinList
              tags={tags}
              activeTags={activeTags}
              onToggle={onToggle}
              onClear={onClear}
              compact
            />
          </>
        )}
      </aside>

      {/* Mobile: mini-nav fissa in alto a sinistra */}
      <div className="fixed left-4 top-4 z-40 flex items-center gap-0.5 rounded-full border border-sb-ink/15 bg-sb-surface/80 px-1.5 py-1 backdrop-blur lg:hidden">
        <Link
          href="/"
          data-interactive
          className="inline-flex min-h-10 items-center px-2 font-display text-[0.8rem] font-bold tracking-tight text-sb-ink"
        >
          shabadabade
        </Link>
        <Link
          href="/projects"
          data-interactive
          aria-current={suProgetti ? "page" : undefined}
          className={`inline-flex min-h-10 items-center rounded-full px-2 text-[0.8rem] ${
            suProgetti ? "font-semibold text-sb-accent" : "text-sb-ink-soft"
          }`}
        >
          Projects
        </Link>
        <Link
          href="/#chi-sono"
          scroll={false}
          data-interactive
          className="inline-flex min-h-10 items-center rounded-full px-2 text-[0.8rem] text-sb-ink-soft"
        >
          {/* su schermo stretto il nome lungo prende già spazio */}
          About
        </Link>
      </div>

      {/* Mobile: bottone flottante + drawer dal basso (solo con la griglia) */}
      {conFiltri && (
        <>
          <button
            type="button"
            data-interactive
            onClick={() => setDrawerOpen(true)}
            aria-label="Open filters"
            className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-sb-ink text-sb-bg shadow-lg lg:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 6h16M7 12h10M10 18h4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            {activeTags.size > 0 && (
              <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-sb-accent text-xs font-semibold text-sb-bg">
                {activeTags.size}
              </span>
            )}
          </button>

          <AnimatePresence>
            {drawerOpen && (
              <>
                <motion.div
                  className="fixed inset-0 z-40 bg-black/70 lg:hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setDrawerOpen(false)}
                />
                <motion.div
                  className="sb-scroll fixed inset-x-0 bottom-0 z-50 max-h-[75vh] overflow-y-auto rounded-t-3xl border-t border-sb-ink/15 bg-sb-surface px-6 pb-10 pt-5 lg:hidden"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 32 }}
                >
                  <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-sb-ink/25" />
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xs uppercase tracking-[0.2em] text-sb-ink-soft">
                      Filter by tag
                    </h2>
                    <button
                      type="button"
                      data-interactive
                      onClick={() => setDrawerOpen(false)}
                      aria-label="Close filters"
                      className="flex h-11 w-11 items-center justify-center rounded-full text-sb-ink-soft hover:text-sb-ink"
                    >
                      ✕
                    </button>
                  </div>
                  <PinList
                    tags={tags}
                    activeTags={activeTags}
                    onToggle={onToggle}
                    onClear={onClear}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </>
  );
}

"use client";

import { Libro, Cane, Nuvola, Fiore, Cuffie, Skate, Sorriso } from "@/data/illustrations";

/*
  Pannello di apertura provvisorio: si vede finché in public/hero/ non
  ci sono le foto vere (vedi src/data/heroPhotos.js).

  Non è un segnaposto grigio: usa i disegni veri di Sharon disposti
  come nel suo collage, con il nome in tondo al centro. Prende i colori
  dal tema, quindi cambia insieme al resto del sito.
*/
const DISEGNI = [
  { Illo: Libro, left: "9%", top: "8%", w: "17%" },
  { Illo: Cane, left: "66%", top: "5%", w: "20%" },
  { Illo: Fiore, left: "4%", top: "34%", w: "12%" },
  { Illo: Skate, left: "37%", top: "26%", w: "22%" },
  { Illo: Cuffie, left: "82%", top: "31%", w: "14%" },
  { Illo: Nuvola, left: "12%", top: "62%", w: "19%" },
  { Illo: Sorriso, left: "70%", top: "72%", w: "15%" },
];

export default function HeroArtwork() {
  return (
    <div
      className="relative aspect-square w-full overflow-hidden rounded-2xl border border-sb-ink/15 bg-sb-surface text-sb-accent"
      role="img"
      aria-label="Disegni di Sharon Bertoncello — al posto della foto di apertura"
    >
      {DISEGNI.map(({ Illo, left, top, w }, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="absolute aspect-square"
          style={{ left, top, width: w }}
        >
          <Illo size="100%" />
        </span>
      ))}

      {/* il nome in tondo, come nel collage */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full fill-sb-ink"
        aria-hidden="true"
      >
        <defs>
          <path
            id="sb-cerchio"
            fill="none"
            d="M 50,50 m -27,0 a 27,27 0 1,1 54,0 a 27,27 0 1,1 -54,0"
          />
        </defs>
        <text fontSize="6.4" fontWeight="700" letterSpacing="1.1">
          <textPath href="#sb-cerchio" startOffset="50%" textAnchor="middle">
            SHABADABADE · SHAZZA · SHAZMANIA · SHASHA ·
          </textPath>
        </text>
      </svg>
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useAnimationControls } from "framer-motion";
import { useThemeContext } from "@/components/ThemeProvider.jsx";
import HeroArtwork from "@/components/HeroArtwork.jsx";
import { heroPhotoFor } from "@/data/heroPhotos";
import { NOME } from "@/data/nomeLettere";
import { NERO, BIANCO, TEMPERE } from "@/data/themes";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { Macchia } from "@/data/macchia";

const COLORI = [
  { palette: NERO, mode: "nero" },
  { palette: BIANCO, mode: "bianco" },
  ...TEMPERE.map((t) => ({ palette: t, mode: "random" })),
];

// inclinazione fissa: a caso cambierebbe a ogni render
const INCLINA = [-6, 4, -3, 7, -5, 3, -7, 5, -4, 6, -3];
const RUOTA_MACCHIA = [0, 140, 60, 210, 300, 30, 250, 110];

function Lettera({ lettera, i, trascinabile, onSposta }) {
  const contenuto = lettera.svg ? (
    lettera.multicolore ? (
      <img src={lettera.svg} alt="" draggable="false" className="h-[0.8em] w-auto" />
    ) : (
      // maschera: il disegno prende il colore del tema come i caratteri
      <span
        className="block h-[0.8em] w-[0.6em] bg-current"
        style={{
          mask: `url(${lettera.svg}) center / contain no-repeat`,
          WebkitMask: `url(${lettera.svg}) center / contain no-repeat`,
        }}
      />
    )
  ) : (
    lettera.char
  );

  /*
    Il salto parte all'ingresso del puntatore e arriva sempre in fondo:
    legato al passaggio (whileHover) si vedeva solo fermandosi sopra,
    passando veloce sembrava che non succedesse niente. Così una
    passata sul nome fa l'onda. Sta in uno span interno perché lo
    spostamento del trascinamento vive su quello esterno.
  */
  const salto = useAnimationControls();
  const salta = () =>
    salto.start({
      y: ["0%", "-16%", "0%"],
      rotate: [0, INCLINA[i % INCLINA.length], 0],
      transition: { duration: 0.45, ease: "easeOut" },
    });

  return (
    <motion.span
      aria-hidden="true"
      className={`inline-block select-none ${lettera.accento ? "text-sb-accent" : ""} ${
        trascinabile ? "cursor-grab active:cursor-grabbing" : ""
      }`}
      initial={{ opacity: 0, y: "40%", rotate: INCLINA[i % INCLINA.length] }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ delay: 0.1 + i * 0.045, type: "spring", stiffness: 260, damping: 18 }}
      onHoverStart={salta}
      onTapStart={salta}
      // niente dragConstraints: ridimensionando la finestra la libreria
      // ricalcola la posizione dentro i limiti e sposta anche le lettere
      // mai toccate. La sezione taglia quello che esce
      drag={trascinabile}
      dragMomentum
      dragTransition={{ power: 0.15, timeConstant: 160 }}
      whileDrag={{ scale: 1.12, rotate: INCLINA[i % INCLINA.length] * 2, zIndex: 10 }}
      onDragEnd={onSposta}
    >
      <motion.span className="inline-block" animate={salto}>
        {contenuto}
      </motion.span>
    </motion.span>
  );
}

export default function Hero() {
  const { palette, setMode } = useThemeContext();
  const isDesktop = useIsDesktop();
  const [fotoMancante, setFotoMancante] = useState(false);
  // cambiando chiave le lettere ripartono dal loro posto
  const [giro, setGiro] = useState(0);
  const [spostate, setSpostate] = useState(false);
  const foto = heroPhotoFor(palette.nome);

  const dipingi = (b, e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setMode(b.mode, { x: r.left + r.width / 2, y: r.top + r.height / 2 }, b.palette);
  };

  return (
    <section
      id="top"
      className="relative flex min-h-[92svh] flex-col justify-center overflow-hidden px-5 pb-14 pt-24 sm:px-8 lg:px-12"
    >
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-xs uppercase tracking-[0.25em] text-sb-ink-soft"
      >
        Sharon Bertoncello — London
      </motion.p>

      {/* niente font-bold né spaziatura negativa: Caprasimo ha un solo
          peso e una spaziatura sua, forzarli impasta le lettere */}
      <h1
        aria-label="shabadabade"
        className="relative z-10 mt-2 whitespace-nowrap font-nome text-[clamp(3.2rem,13.6vw,14rem)] leading-[1.05]"
      >
        {NOME.map((lettera, i) => (
          <Lettera
            key={`${giro}-${i}`}
            lettera={lettera}
            i={i}
            trascinabile={isDesktop}
            onSposta={() => setSpostate(true)}
          />
        ))}
      </h1>

      <div className="mt-6 grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
        <div className="relative z-10 max-w-md">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-lg text-sb-ink sm:text-xl"
          >
            Designer &amp; illustrator. I draw things that stick.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            // su telefono rubavano troppo spazio: lì c'è il selettore in basso
            className="mt-8 hidden md:block"
          >
            <p id="sb-colori" className="text-xs uppercase tracking-[0.2em] text-sb-ink-soft">
              Paint the page
            </p>
            <div role="group" aria-labelledby="sb-colori" className="mt-3 flex flex-wrap gap-1">
              {COLORI.map((b, i) => {
                const attivo = palette.nome === b.palette.nome;
                return (
                  <motion.button
                    key={b.palette.nome}
                    type="button"
                    data-interactive
                    onClick={(e) => dipingi(b, e)}
                    whileHover={{ scale: 1.15, rotate: -10 }}
                    whileTap={{ scale: 0.85 }}
                    aria-label={`Paint the page ${b.palette.nome}`}
                    aria-pressed={attivo}
                    className="flex h-11 w-11 items-center justify-center"
                  >
                    <Macchia
                      className="h-9 w-9"
                      rotate={RUOTA_MACCHIA[i % RUOTA_MACCHIA.length]}
                      colore={b.palette.bg}
                      bordo={
                        attivo
                          ? "var(--sb-accent)"
                          : "color-mix(in srgb, var(--sb-ink) 40%, transparent)"
                      }
                    />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
            <a
              href="#lavori"
              data-interactive
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-sb-ink underline-offset-4 hover:text-sb-accent hover:underline"
            >
              See the work
              <motion.span
                aria-hidden="true"
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              >
                ↓
              </motion.span>
            </a>
            {spostate && (
              <button
                type="button"
                data-interactive
                onClick={() => {
                  setGiro((g) => g + 1);
                  setSpostate(false);
                }}
                className="inline-flex min-h-11 items-center text-sm text-sb-ink-soft underline underline-offset-4 hover:text-sb-accent"
              >
                Put the letters back
              </button>
            )}
          </div>
        </div>

        {/* polaroid appoggiata storta, col timbro dei soprannomi */}
        <motion.div
          initial={{ opacity: 0, rotate: -12, y: 40 }}
          animate={{ opacity: 1, rotate: 3, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, type: "spring", stiffness: 90, damping: 14 }}
          whileHover={{ rotate: 0, scale: 1.02 }}
          className="relative mx-auto w-[min(78vw,22rem)] bg-sb-surface p-3 pb-12 shadow-[0_20px_50px_rgba(0,0,0,0.35)] md:mx-0 md:-mt-24 lg:w-[24rem]"
        >
          {fotoMancante ? (
            <HeroArtwork />
          ) : (
            // next/image: gli originali pesano 1,4 MB l'uno. priority
            // perché è l'immagine più grande della prima schermata
            <Image
              src={foto}
              alt="Sharon Bertoncello a Londra, circondata dai suoi disegni"
              width={1200}
              height={1200}
              priority
              sizes="(min-width: 1024px) 24rem, 78vw"
              onError={() => setFotoMancante(true)}
              className="block h-auto w-full"
            />
          )}
          <span className="absolute bottom-3 left-4 text-xs text-sb-ink-soft">
            London, these days
          </span>
          <Timbro />
        </motion.div>
      </div>
    </section>
  );
}

function Timbro() {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className="absolute -right-8 -top-10 h-28 w-28 fill-sb-accent"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 24, ease: "linear" }}
    >
      <defs>
        <path
          id="sb-timbro"
          fill="none"
          d="M 50,50 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
        />
      </defs>
      <text fontSize="9.6" fontWeight="700">
        <textPath href="#sb-timbro" textLength="250" lengthAdjust="spacing">DESIGN · ILLUSTRATION · AND MORE ·</textPath>
      </text>
    </motion.svg>
  );
}

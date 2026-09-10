"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useThemeContext } from "@/components/ThemeProvider.jsx";
import HeroArtwork from "@/components/HeroArtwork.jsx";
import { heroPhotoFor } from "@/data/heroPhotos";

/*
  Apertura: il nome d'arte in grande, "Sharon Bertoncello" sotto in
  piccolo, e la foto — che cambia insieme al tema (una versione per
  colore, vedi src/data/heroPhotos.js).
  Se la foto non c'è ancora, al suo posto compare il pannello con i
  disegni: mai un riquadro rotto, mai un buco.
*/
export default function Hero() {
  const { palette } = useThemeContext();
  const [fotoMancante, setFotoMancante] = useState(false);
  const foto = heroPhotoFor(palette.nome);

  return (
    <section
      id="top"
      className="flex min-h-[82vh] flex-col justify-center gap-10 px-5 py-16 sm:px-8 lg:flex-row lg:items-center lg:gap-14 lg:px-12"
    >
      <div className="lg:flex-1">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs uppercase tracking-[0.25em] text-sb-ink-soft"
        >
          Designer & illustrator — London
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-4 font-display text-5xl font-bold leading-[0.95] tracking-tighter sm:text-7xl lg:text-[5.5rem]"
        >
          shabadabade
        </motion.h1>

        {/* il nome vero resta, in sordina: serve a chi la cerca per nome */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-4 flex items-baseline gap-2"
        >
          <span className="font-display text-lg font-semibold text-sb-ink">
            Sharon
          </span>
          <span className="text-[0.7rem] uppercase tracking-[0.25em] text-sb-ink-soft">
            Bertoncello
          </span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-6 max-w-md text-lg text-sb-ink-soft sm:text-xl"
        >
          I draw things that stick.
        </motion.p>

        <motion.a
          href="#lavori"
          data-interactive
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 inline-flex min-h-11 w-fit items-center gap-2 text-sm text-sb-ink-soft underline-offset-4 hover:text-sb-accent hover:underline"
        >
          See the work
          <motion.span
            aria-hidden="true"
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          >
            ↓
          </motion.span>
        </motion.a>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="w-full max-w-[26rem] self-center lg:max-w-[30rem] lg:flex-1"
      >
        {fotoMancante ? (
          <HeroArtwork />
        ) : (
          <img
            src={foto}
            alt="Sharon Bertoncello a Londra, circondata dai suoi disegni"
            width="1200"
            height="1200"
            /* è il primo elemento visibile: va caricata subito, non in
               lazy, o rallenta la comparsa della pagina */
            fetchPriority="high"
            decoding="async"
            onError={() => setFotoMancante(true)}
            className="h-auto w-full rounded-2xl"
          />
        )}
      </motion.div>
    </section>
  );
}

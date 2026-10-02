"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useThemeContext } from "@/components/ThemeProvider.jsx";
import HeroArtwork from "@/components/HeroArtwork.jsx";
import { heroPhotoFor } from "@/data/heroPhotos";

// pt-28 su schermo stretto: sopra c'è la navigazione fissa, senza
// quello spazio il testo ci finisce sotto
export default function Hero() {
  const { palette } = useThemeContext();
  const [fotoMancante, setFotoMancante] = useState(false);
  const foto = heroPhotoFor(palette.nome);

  return (
    <section
      id="top"
      className="flex min-h-[82vh] flex-col justify-center px-5 pb-16 pt-28 sm:px-8 md:py-16 lg:px-12"
    >
      {/* impilate, la foto prende tutta la colonna: il bordo sinistro
          resta allineato al nome */}
      <div className="flex flex-col gap-10 md:flex-row md:items-center md:gap-12 lg:gap-14">
      <div className="md:flex-1">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs uppercase tracking-[0.25em] text-sb-ink-soft"
        >
          Sharon Bertoncello — London
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          /* niente font-bold né spaziatura negativa: Caprasimo ha un
             solo peso e una spaziatura sua, forzarli impasta le lettere */
          className="mt-3 font-nome text-4xl leading-[1.05] sm:text-5xl lg:text-6xl"
        >
          <span className="text-sb-accent">sha</span>badabade
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-6 max-w-md text-lg text-sb-ink-soft sm:text-xl"
        >
          Designer &amp; illustrator. I draw things that stick.
        </motion.p>

      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="w-full md:max-w-[30rem] md:flex-1"
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
            sizes="(min-width: 1024px) 30rem, 100vw"
            onError={() => setFotoMancante(true)}
            className="h-auto w-full rounded-2xl"
          />
        )}
      </motion.div>
      </div>

      {/* sotto entrambe le colonne: accanto alla foto la freccia
          sembrava indicare lei */}
      <motion.a
        href="#lavori"
        data-interactive
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-12 inline-flex min-h-11 w-fit items-center gap-2 text-sm text-sb-ink-soft underline-offset-4 hover:text-sb-accent hover:underline"
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
    </section>
  );
}

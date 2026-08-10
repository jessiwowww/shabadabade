import { useEffect, useState } from "react";
import { sanityClient } from "../lib/sanity";

/*
  Foto e bio della sezione "Chi sono": documento unico su Sanity,
  con fallback sui contenuti di default finché non viene compilato.
*/
const FALLBACK = {
  foto: {
    url: "https://picsum.photos/seed/sb-ritratto/640/800",
    larghezza: 640,
    altezza: 800,
  },
  bio: "I'm Sharon. I've always drawn, and for the past few years I've been doing it in London. By day I build presentations and visuals for the healthcare world; by night I draw logos, tattoos and t-shirts for people and places I care about. I like things made by hand, even when they end up on a screen.",
};

const QUERY = `*[_type == "chiSono"][0]{
  bio,
  "foto": foto.asset->{
    "url": url,
    "larghezza": metadata.dimensions.width,
    "altezza": metadata.dimensions.height
  }
}`;

export function useChiSono() {
  const [chiSono, setChiSono] = useState(FALLBACK);

  useEffect(() => {
    let alive = true;
    sanityClient
      .fetch(QUERY)
      .then((data) => {
        if (!alive || !data) return;
        setChiSono({
          foto: data.foto ?? FALLBACK.foto,
          bio: data.bio ?? FALLBACK.bio,
        });
      })
      .catch(() => {
        // API non raggiungibile: restano i contenuti di default
      });
    return () => {
      alive = false;
    };
  }, []);

  return chiSono;
}

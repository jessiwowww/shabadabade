import { useEffect, useState } from "react";
import { sanityClient } from "../lib/sanity";
import { CASE_STUDIES } from "../data/caseStudies";

/*
  Hook dei progetti completi (case study): legge da Sanity; se non ci
  sono contenuti pubblicati o l'API non risponde usa i mock di
  src/data/caseStudies.js.
*/
const QUERY = `*[_type == "progettoCompleto"] | order(ordine asc) {
  "id": _id,
  titolo,
  "copertina": {
    "url": copertina.asset->url,
    "larghezza": copertina.asset->metadata.dimensions.width,
    "altezza": copertina.asset->metadata.dimensions.height
  },
  descrizione,
  data,
  ordine,
  "contenuti": coalesce(contenuti[]{
    _type == "bloccoTesto" => {
      "tipo": "testo",
      titolo,
      corpo
    },
    _type == "bloccoImmagine" => {
      "tipo": "immagine",
      "immagine": {
        "url": immagine.asset->url,
        "larghezza": immagine.asset->metadata.dimensions.width,
        "altezza": immagine.asset->metadata.dimensions.height
      },
      didascalia
    },
    _type == "bloccoVideo" => {
      "tipo": "video",
      "url": video.asset->url,
      "poster": poster.asset->{
        "url": url,
        "larghezza": metadata.dimensions.width,
        "altezza": metadata.dimensions.height
      },
      didascalia
    }
  }, [])
}`;

async function fetchCaseStudies() {
  try {
    const data = await sanityClient.fetch(QUERY);
    if (data?.length > 0) return data;
    console.info(
      "[sanity] Nessun progetto completo pubblicato: uso i dati di esempio."
    );
  } catch (err) {
    console.warn(
      "[sanity] API non raggiungibile (CORS non configurato?): uso i dati di esempio.",
      err
    );
  }
  return [...CASE_STUDIES].sort((a, b) => a.ordine - b.ordine);
}

export function useCaseStudies() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetchCaseStudies().then((data) => {
      if (!alive) return;
      setCaseStudies(data);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  return { caseStudies, loading };
}

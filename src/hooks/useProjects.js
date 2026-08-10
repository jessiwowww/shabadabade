import { useEffect, useState } from "react";
import { sanityClient } from "../lib/sanity";
import { PROJECTS } from "../data/projects";

/*
  Hook dati progetti: legge da Sanity; se il progetto Sanity è vuoto o
  irraggiungibile (es. CORS non ancora configurato) usa i mock di
  src/data/projects.js, così il sito funziona sempre.
*/
const QUERY = `*[_type == "progetto"] | order(ordine asc) {
  "id": _id,
  titolo,
  "immagine": {
    "url": immagine.asset->url,
    "larghezza": immagine.asset->metadata.dimensions.width,
    "altezza": immagine.asset->metadata.dimensions.height
  },
  "video": video.asset->{ "url": url },
  "tags": coalesce(tags, []),
  descrizione,
  data,
  ordine
}`;

async function fetchProjects() {
  try {
    const data = await sanityClient.fetch(QUERY);
    if (data?.length > 0) return data;
    console.info("[sanity] Nessun lavoro pubblicato: uso i dati di esempio.");
  } catch (err) {
    console.warn(
      "[sanity] API non raggiungibile (CORS non configurato?): uso i dati di esempio.",
      err
    );
  }
  return [...PROJECTS].sort((a, b) => a.ordine - b.ordine);
}

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetchProjects().then((data) => {
      if (!alive) return;
      setProjects(data);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  return { projects, loading };
}

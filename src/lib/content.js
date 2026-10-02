import { sanityClient } from "./sanity";
import { PROJECTS } from "../data/projects";
import { CASE_STUDIES } from "../data/caseStudies";

/*
  Unico punto in cui il sito parla con Sanity, lato server: il
  contenuto è già nell'HTML invece di comparire dopo il JavaScript.
  Se Sanity è vuoto o non risponde si usano i dati di esempio: il
  sito non deve mai presentarsi rotto.
*/

const PROJECTS_QUERY = `*[_type == "progetto"] | order(ordine asc) {
  "id": _id,
  titolo,
  "immagine": {
    "url": immagine.asset->url,
    "larghezza": immagine.asset->metadata.dimensions.width,
    "altezza": immagine.asset->metadata.dimensions.height
  },
  "video": video.asset->{ "url": url },
  "tags": coalesce(tags, []),
  "macro": macro,
  descrizione,
  data,
  ordine,
  "album": coalesce(album[]{
    _type == "image" => {
      "tipo": "immagine",
      "immagine": {
        "url": asset->url,
        "larghezza": asset->metadata.dimensions.width,
        "altezza": asset->metadata.dimensions.height
      },
      didascalia
    },
    _type == "voceVideo" => {
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

// coalesce sullo slug: finché Sharon non lo compila la pagina esiste
// comunque, con un indirizzo brutto
const CASE_STUDIES_QUERY = `*[_type == "progettoCompleto"] | order(ordine asc) {
  "id": _id,
  "slug": coalesce(slug.current, _id),
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

const ABOUT_QUERY = `*[_type == "chiSono"][0]{
  bio,
  "foto": foto.asset->{
    "url": url,
    "larghezza": metadata.dimensions.width,
    "altezza": metadata.dimensions.height
  }
}`;

const ABOUT_FALLBACK = {
  foto: {
    url: "https://picsum.photos/seed/sb-ritratto/640/800",
    larghezza: 640,
    altezza: 800,
  },
  bio: "I'm Sharon. I've always drawn, and for the past few years I've been doing it in London. By day I build presentations and visuals for the healthcare world; by night I draw logos, tattoos and t-shirts for people and places I care about. I like things made by hand, even when they end up on a screen.",
};

async function query(groq, { etichetta }) {
  try {
    return await sanityClient.fetch(groq);
  } catch (err) {
    console.warn(
      `[sanity] ${etichetta}: API non raggiungibile, uso i dati di esempio.`,
      err.message
    );
    return null;
  }
}

export async function getProjects() {
  const data = await query(PROJECTS_QUERY, { etichetta: "lavori" });
  if (data?.length > 0) return data;
  return [...PROJECTS].sort((a, b) => a.ordine - b.ordine);
}

export async function getCaseStudies() {
  const data = await query(CASE_STUDIES_QUERY, { etichetta: "progetti" });
  if (data?.length > 0) return data;
  // nei mock l'id è già leggibile: vale anche come slug
  return [...CASE_STUDIES]
    .sort((a, b) => a.ordine - b.ordine)
    .map((cs) => ({ ...cs, slug: cs.slug ?? cs.id }));
}

export async function getCaseStudy(slug) {
  const all = await getCaseStudies();
  return all.find((cs) => cs.slug === slug) ?? null;
}

export async function getAbout() {
  const data = await query(ABOUT_QUERY, { etichetta: "chi sono" });
  if (!data) return ABOUT_FALLBACK;
  return {
    foto: data.foto ?? ABOUT_FALLBACK.foto,
    bio: data.bio ?? ABOUT_FALLBACK.bio,
  };
}

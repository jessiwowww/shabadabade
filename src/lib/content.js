import { sanityClient } from "./sanity";
import { PROJECTS } from "../data/projects";

/*
  Dati di esempio per lavori e progetti quando Sanity non ne ha.
  Utili finché il sito è una demo; al lancio si spengono con
  SB_DATI_ESEMPIO=no, altrimenti togliendo l'ultimo progetto vero
  ricomparirebbero quelli finti.
*/
const ESEMPI = process.env.SB_DATI_ESEMPIO !== "no";

/*
  Unico punto in cui il sito parla con Sanity, lato server: il
  contenuto è già nell'HTML invece di comparire dopo il JavaScript.
  Se Sanity è vuoto o non risponde si usano i dati di esempio: il
  sito non deve mai presentarsi rotto.
*/

// ordine quando c'è, altrimenti dal più recente caricato: così non
// serve numerare ogni lavoro per vederlo comparire al posto giusto
const PROJECTS_QUERY = `*[_type == "progetto"] | order(coalesce(ordine, 999999) asc, _createdAt desc) {
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
const CASE_STUDIES_QUERY = `*[_type == "progettoCompleto"] | order(coalesce(ordine, 999999) asc, _createdAt desc) {
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

// il più recente, non "il primo che capita": se un vecchio documento
// About tornasse a galla, vincerebbe comunque quello aggiornato
const ABOUT_QUERY = `*[_type == "chiSono"] | order(_updatedAt desc)[0]{
  bio,
  "foto": foto.asset->{
    "url": url,
    "larghezza": metadata.dimensions.width,
    "altezza": metadata.dimensions.height
  }
}`;

const ABOUT_FALLBACK = {
  // foto vera di Sharon, non un segnaposto: se il documento About su
  // Sanity resta vuoto, online non deve finirci la faccia di un'altra
  foto: {
    url: "/sharon.jpg",
    larghezza: 1000,
    altezza: 667,
  },
  // il saluto iniziale vive nel titolo della sezione (ChiSono.jsx):
  // qui ripeterlo suonerebbe due volte
  bio: `As an open, bubbly and curious soul, I believe in authentic expression in every form it takes. So, I became a Dancer, a Photographer, a Designer, an Illustrator, and a DJ (...more TBC).

Find me where the good vibes are, and let's make something real together.`,
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
  if (data?.length > 0 || !ESEMPI) return data ?? [];
  return [...PROJECTS].sort((a, b) => a.ordine - b.ordine);
}

/*
  Niente dati di esempio qui: finché non esiste un progetto vero su
  Sanity la sezione, la pagina, la voce di menu e le righe della
  sitemap spariscono tutte da sole, perché guardano questo elenco.
*/
export async function getCaseStudies() {
  const data = await query(CASE_STUDIES_QUERY, { etichetta: "progetti" });
  return data ?? [];
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

/*
  Lavoro della griglia in home: un'immagine (o GIF, o video),
  tag liberi e poco altro. I pin del sito nascono dai tag.
  NB: i `name` dei campi non si toccano (il sito li interroga così).
*/

/*
  Voci dell'album: le foto e i video "figli" di questo lavoro.
  Stanno dentro al documento della copertina, così si caricano tutti
  in una volta e non possono restare orfani.
*/
/*
  Le foto dell'album sono `image` dirette, non oggetti che le
  contengono: è la forma che permette di trascinare venti file in una
  volta sola dentro la copertina. La didascalia è un campo aggiuntivo
  DELL'IMMAGINE, quindi resta per singola foto.
*/
const voceImmagine = {
  type: "image",
  title: "Image",
  options: { hotspot: true },
  fields: [
    {
      name: "didascalia",
      title: "Caption (optional)",
      type: "string",
      description: "Il testo che compare sotto questa foto nell'album.",
    },
  ],
};

const voceVideo = {
  name: "voceVideo",
  title: "Video",
  type: "object",
  fields: [
    {
      name: "video",
      title: "Video",
      type: "file",
      options: { accept: "video/mp4,video/webm" },
      description:
        "Solo MP4 o WebM: sono gli unici che i browser sanno riprodurre. Un .mov dal telefono va convertito prima.",
      validation: (r) => r.required(),
    },
    {
      name: "poster",
      title: "Preview image (optional)",
      type: "image",
      description: "Si vede prima che il video parta.",
    },
    { name: "didascalia", title: "Caption (optional)", type: "string" },
  ],
  preview: {
    select: { title: "didascalia", media: "poster" },
    prepare: ({ title, media }) => ({ title: title || "Video", media }),
  },
};
export default {
  name: "progetto",
  title: "Work (grid)",
  type: "document",
  fields: [
    {
      name: "titolo",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    },
    {
      /*
        LIVELLO 1. Nel database finisce il NUMERO, non l'etichetta:
        così rinominare una categoria sul sito non tocca un solo
        contenuto già caricato. Le etichette qui e in
        src/data/macroCategories.js vanno tenute allineate.
      */
      name: "macro",
      title: "Category",
      type: "string",
      options: {
        layout: "dropdown",
        list: [
          { title: "Identity", value: "1" },
          { title: "Image", value: "2" },
          { title: "Illustration", value: "3" },
          { title: "Editorial", value: "4" },
          { title: "Exploration", value: "5" },
          { title: "Performance", value: "6" },
        ],
      },
      description: "La famiglia a cui appartiene questo lavoro.",
    },
    {
      name: "immagine",
      title: "Image (or GIF)",
      type: "image",
      options: { hotspot: true },
      description:
        "Any proportions: the grid adapts. Animated GIFs upload here like normal images.",
      validation: (r) => r.required(),
    },
    {
      name: "video",
      title: "Video (optional)",
      type: "file",
      options: { accept: "video/mp4,video/webm" },
      description:
        "If you upload a video, it plays as a muted loop in the grid and the image above becomes its cover. Keep it short and light (a few seconds).",
    },
    {
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description:
        "Free-form, in English: type and press enter. Every new tag automatically becomes a filter pin on the site.",
    },
    {
      name: "descrizione",
      title: "Description",
      type: "text",
      rows: 3,
    },
    {
      name: "album",
      title: "Album (optional)",
      type: "array",
      of: [voceImmagine, voceVideo],
      options: { layout: "grid" },
      description:
        "Le altre foto e i video di questo stesso lavoro: trascina qui più file in una volta e riordinali a mano. Ogni foto può avere la sua didascalia (clicca sulla foto). In griglia compare il numero, e si sfogliano senza aprire il lavoro.",
    },
    {
      name: "data",
      title: "Date",
      type: "date",
      validation: (r) => r.required(),
    },
    {
      name: "ordine",
      title: "Order",
      type: "number",
      description: "Position in the grid: lower numbers come first.",
      validation: (r) => r.required(),
    },
  ],
  orderings: [
    {
      title: "Grid order",
      name: "ordineAsc",
      by: [{ field: "ordine", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "titolo", subtitle: "data", media: "immagine" },
  },
};

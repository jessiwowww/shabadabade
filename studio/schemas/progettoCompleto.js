/*
  Progetto completo (pagina "Projects"): copertina + intro + contenuti
  a blocchi. I blocchi si aggiungono col "+" e si riordinano
  trascinandoli: testo, immagine o video, nell'ordine che vuoi.
  NB: i `name` dei campi/blocchi non si toccano (il sito li interroga così).
*/
const bloccoTesto = {
  name: "bloccoTesto",
  title: "Text",
  type: "object",
  fields: [
    {
      name: "titolo",
      title: "Heading (optional)",
      type: "string",
      description: "E.g. “The brief”, “The process”, “The result”…",
    },
    {
      name: "corpo",
      title: "Text",
      type: "text",
      rows: 5,
      validation: (r) => r.required(),
    },
  ],
  preview: {
    select: { title: "titolo", subtitle: "corpo" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Text",
      subtitle: subtitle?.slice(0, 60),
    }),
  },
};

const bloccoImmagine = {
  name: "bloccoImmagine",
  title: "Image",
  type: "object",
  fields: [
    {
      name: "immagine",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    },
    {
      name: "didascalia",
      title: "Caption (optional)",
      type: "string",
    },
  ],
  preview: {
    select: { title: "didascalia", media: "immagine" },
    prepare: ({ title, media }) => ({ title: title || "Image", media }),
  },
};

const bloccoVideo = {
  name: "bloccoVideo",
  title: "Video",
  type: "object",
  fields: [
    {
      name: "video",
      title: "Video",
      type: "file",
      options: { accept: "video/mp4,video/webm" },
      validation: (r) => r.required(),
    },
    {
      name: "poster",
      title: "Preview image (optional)",
      type: "image",
      description: "Shown before the video starts.",
    },
    {
      name: "didascalia",
      title: "Caption (optional)",
      type: "string",
    },
  ],
  preview: {
    select: { title: "didascalia", media: "poster" },
    prepare: ({ title, media }) => ({ title: title || "Video", media }),
  },
};

export default {
  name: "progettoCompleto",
  title: "Project",
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
        Lo slug è l'indirizzo pubblico del progetto
        (sharonbertoncello.com/projects/<slug>): premi "Generate" e lo
        ricava dal titolo. Meglio non cambiarlo dopo la pubblicazione,
        o i link già condivisi smettono di funzionare.
      */
      name: "slug",
      title: "Web address",
      type: "slug",
      options: { source: "titolo", maxLength: 80 },
      validation: (r) => r.required(),
    },
    {
      name: "copertina",
      title: "Cover",
      type: "image",
      options: { hotspot: true },
      description: "The image representing this project in the list.",
      validation: (r) => r.required(),
    },
    {
      name: "descrizione",
      title: "Intro",
      type: "text",
      rows: 3,
      description: "Two or three sentences introducing the project.",
      validation: (r) => r.required(),
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
      description: "Position in the list: lower numbers come first.",
      validation: (r) => r.required(),
    },
    {
      name: "contenuti",
      title: "Content",
      type: "array",
      of: [bloccoTesto, bloccoImmagine, bloccoVideo],
      description:
        "The story of the project: alternate text, images and video. Drag blocks to reorder them.",
    },
  ],
  orderings: [
    {
      title: "List order",
      name: "ordineAsc",
      by: [{ field: "ordine", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "titolo", subtitle: "data", media: "copertina" },
  },
};

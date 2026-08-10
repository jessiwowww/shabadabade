/*
  Lavoro della griglia in home: un'immagine (o GIF, o video),
  tag liberi e poco altro. I pin del sito nascono dai tag.
  NB: i `name` dei campi non si toccano (il sito li interroga così).
*/
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

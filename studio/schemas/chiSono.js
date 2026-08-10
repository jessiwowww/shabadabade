/*
  Documento unico "About": foto e bio della home.
  Non se ne creano altri: si modifica sempre lo stesso.
  NB: i `name` dei campi non si toccano (il sito li interroga così).
*/
export default {
  name: "chiSono",
  title: "About",
  type: "document",
  fields: [
    {
      name: "foto",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      description: "The portrait in the “About” section of the home page.",
    },
    {
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 5,
      description: "Two or three sentences, first person.",
    },
  ],
  preview: {
    prepare: () => ({ title: "About" }),
  },
};

/*
  Progetti "completi" / case study (fallback finché Sanity è vuoto):
  copertina scelta a mano, intro e CONTENUTI A BLOCCHI — l'argomento
  viene sviscerato alternando testo e media, nell'ordine deciso da
  Sharon.

  Tipi di blocco:
    { tipo: "testo",    titolo?, corpo }
    { tipo: "immagine", immagine: {url, larghezza, altezza}, didascalia? }
    { tipo: "video",    url, poster?, didascalia? }

  Su Sanity è un array di blocchi (vedi src/lib/content.js).
*/

const img = (seed, w, h) => ({
  url: `https://picsum.photos/seed/${seed}/${w}/${h}`,
  larghezza: w,
  altezza: h,
});

export const CASE_STUDIES = [
  {
    id: "forno-e-co-rebrand",
    titolo: "Forno & Co. rebrand",
    copertina: img("cs-forno", 1200, 800),
    descrizione:
      "Six months with a neighbourhood bakery: logo, bread wrap, stamps, signage and aprons. The whole journey, from first scribbles to handover.",
    data: "2026-02-01",
    ordine: 1,
    contenuti: [
      {
        tipo: "testo",
        titolo: "The brief",
        corpo:
          "A real bakery, flour on the counter, that didn't want to look like a chain. The brief was one sentence: “make it obvious we bake the bread ourselves”.",
      },
      { tipo: "immagine", immagine: img("cs-forno-1", 1200, 800), didascalia: "First logo sketches, pencil on bread paper." },
      {
        tipo: "testo",
        titolo: "The process",
        corpo:
          "I spent two mornings behind the counter watching the gestures: the stamp on the paper, the knot in the string, the price board. The logo came from there — from the stamp.",
      },
      { tipo: "immagine", immagine: img("cs-forno-2", 800, 1100), didascalia: "Stamp tests on three different papers." },
      { tipo: "immagine", immagine: img("cs-forno-3", 1200, 900) },
      {
        tipo: "testo",
        titolo: "The result",
        corpo:
          "A mark that works hand-inked on a paper bag and embroidered on an apron. No impossible Pantones: two colours, kraft paper, done.",
      },
      { tipo: "immagine", immagine: img("cs-forno-4", 900, 900), didascalia: "Handover: signage, paper and aprons." },
    ],
  },
  {
    id: "radio-notte-identity",
    titolo: "Radio Notte identity",
    copertina: img("cs-radionotte", 1100, 900),
    descrizione:
      "Covers, animated idents and social graphics for a series of late-night mixes. An illustration system that changes every episode but stays recognisable.",
    data: "2025-09-15",
    ordine: 2,
    contenuti: [
      {
        tipo: "testo",
        titolo: "The idea",
        corpo:
          "Every episode is a different city at night, but the antenna on the roof is always there. The system has one rule: same palette, same antenna, everything else changes.",
      },
      { tipo: "immagine", immagine: img("cs-rn-1", 900, 900), didascalia: "Episode 01 cover." },
      { tipo: "immagine", immagine: img("cs-rn-2", 900, 1200), didascalia: "Poster for the tenth-episode live show." },
      {
        tipo: "video",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        poster: img("cs-rn-3", 1280, 720),
        didascalia: "The opening ident (loop, 6 seconds).",
      },
      {
        tipo: "testo",
        corpo:
          "The animated idents start from the same drawings as the covers: only one detail moves at a time — a traffic light, a window, chimney smoke.",
      },
    ],
  },
  {
    id: "london-markets-posters",
    titolo: "Posters: London markets",
    copertina: img("cs-mercati", 900, 1200),
    descrizione:
      "Personal riso-printed poster series about London markets: Brixton, Broadway, Columbia Road. Research, sketches on location and final prints.",
    data: "2025-06-01",
    ordine: 3,
    contenuti: [
      {
        tipo: "testo",
        corpo:
          "Three Saturdays, three markets, one sketchbook. The posters were drawn standing between the stalls, then redrawn in two colours for riso printing.",
      },
      { tipo: "immagine", immagine: img("cs-m-1", 800, 1120), didascalia: "Brixton Market." },
      { tipo: "immagine", immagine: img("cs-m-2", 800, 1120), didascalia: "Broadway Market." },
      { tipo: "immagine", immagine: img("cs-m-3", 800, 1120), didascalia: "Columbia Road." },
      { tipo: "immagine", immagine: img("cs-m-4", 1200, 800), didascalia: "Prints hung up to dry." },
    ],
  },
];

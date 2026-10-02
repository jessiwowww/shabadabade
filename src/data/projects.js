/*
  Dati di esempio: il sito li usa finché Sanity è vuoto.
  Stessa shape dello schema Sanity (vedi src/lib/content.js).
  `larghezza`/`altezza` servono a riservare lo spazio in griglia
  prima che l'immagine arrivi.
*/

const img = (seed, w, h) => ({
  url: `https://picsum.photos/seed/${seed}/${w}/${h}`,
  larghezza: w,
  altezza: h,
});

export const PROJECTS = [
  {
    id: "flowers-for-marta",
    titolo: "Flowers for Marta",
    macro: "3",
    immagine: img("sb-fiori", 800, 1200),
    tags: ["invitation", "illustration", "wedding"],
    descrizione:
      "Invitation suite for a September wedding: hand-drawn flowers, rough paper, no gold foil.",
    data: "2026-03-01",
    ordine: 1,
    // album: foto e video stanno dentro la copertina, non separati
    album: [
      { tipo: "immagine", immagine: img("sb-fiori-a", 1200, 800), didascalia: "The full suite laid out." },
      { tipo: "immagine", immagine: img("sb-fiori-b", 900, 1200), didascalia: "Envelope liner." },
      { tipo: "immagine", immagine: img("sb-fiori-c", 1000, 1000) },
      { tipo: "immagine", immagine: img("sb-fiori-d", 1400, 900), didascalia: "On the table, the morning of." },
    ],
  },
  {
    id: "bar-luna",
    titolo: "Bar Luna",
    macro: "1",
    immagine: img("sb-barluna", 900, 900),
    tags: ["logo", "brand identity", "food"],
    descrizione:
      "Logo and signage for a neighbourhood bar in south London. A moon that looks like an espresso cup, or the other way round.",
    data: "2026-01-15",
    ordine: 2,
  },
  {
    id: "snake-and-dagger",
    titolo: "Snake & dagger",
    macro: "3",
    immagine: img("sb-serpente", 640, 1400),
    tags: ["tattoo", "fine line"],
    descrizione:
      "Forearm flash, single line. Drawn in one evening, tattooed the week after.",
    data: "2025-11-20",
    ordine: 3,
  },
  {
    id: "brixton-market",
    titolo: "Brixton Market",
    macro: "2",
    immagine: img("sb-brixton", 800, 1120),
    tags: ["local graphics", "poster", "illustration"],
    descrizione:
      "Poster for the Saturday market: fruit, fish and people shouting. Riso-printed in two colours.",
    data: "2025-10-05",
    ordine: 4,
  },
  {
    id: "tee-slow-days",
    titolo: "“Slow Days” tee",
    macro: "3",
    immagine: img("sb-slowdays", 1000, 800),
    tags: ["t-shirt", "illustration"],
    descrizione:
      "Screen-printed graphic for a small independent label. A cat asleep on a pile of books.",
    data: "2025-09-12",
    ordine: 5,
  },
  {
    /*
      Mix con audio: `embedAudio` è la pagina pubblica del mix
      (SoundCloud / Mixcloud / YouTube). Il sito la converte nel player
      da incorporare. Il player non è ancora renderizzato da nessuna
      parte: il campo è predisposto per quando decideremo dove mostrarlo.
    */
    id: "basement-tapes-01",
    titolo: "Basement Tapes 01",
    macro: "6",
    immagine: img("sb-mix01", 1000, 1000),
    embedAudio: "https://soundcloud.com/sharonbertoncello/basement-tapes-01",
    tags: ["dj set", "house", "vinyl"],
    descrizione:
      "Ninety minutes recorded in one take on a Sunday afternoon: warm house, a couple of edits, one record that skips.",
    data: "2026-05-02",
    ordine: 6,
  },
  {
    id: "radio-notte-cover",
    titolo: "Radio Notte",
    macro: "2",
    immagine: img("sb-radionotte", 900, 900),
    tags: ["illustration", "music", "cover art"],
    descrizione:
      "Cover art for a series of late-night mixes: antennas, rooftops and a sky that's far too big.",
    data: "2025-08-02",
    ordine: 7,
  },
  {
    id: "forno-e-co",
    titolo: "Forno & Co.",
    macro: "1",
    immagine: img("sb-forno", 1280, 720),
    tags: ["logo", "brand identity", "food"],
    descrizione:
      "Full identity for a bakery: logo, bread wrap, stamps and flour-dusted aprons.",
    data: "2025-06-18",
    ordine: 8,
    album: [
      { tipo: "immagine", immagine: img("sb-forno-a", 1200, 900), didascalia: "The stamp that became the logo." },
      { tipo: "immagine", immagine: img("sb-forno-b", 900, 1200) },
      { tipo: "immagine", immagine: img("sb-forno-c", 1280, 720), didascalia: "Signage going up." },
    ],
  },
  {
    id: "night-shift-residency",
    titolo: "Night Shift — monthly residency",
    macro: "6",
    immagine: img("sb-nightshift", 800, 1150),
    tags: ["club night", "flyer", "dj set"],
    descrizione:
      "A monthly night I run in Peckham: I pick the records and draw the flyers. Doors at ten, no guest list, good sound.",
    data: "2026-04-20",
    ordine: 9,
    // album misto: immagini + un video, per verificare i formati insieme
    album: [
      { tipo: "immagine", immagine: img("sb-night-a", 900, 1200), didascalia: "Flyer, February." },
      {
        tipo: "video",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        poster: img("sb-night-v", 1280, 720),
        didascalia: "Last hour, lights already up.",
      },
      { tipo: "immagine", immagine: img("sb-night-b", 1200, 800), didascalia: "The room at eleven." },
      { tipo: "immagine", immagine: img("sb-night-c", 1000, 1000) },
      { tipo: "immagine", immagine: img("sb-night-d", 800, 1100), didascalia: "Records that survived the night." },
    ],
  },
  {
    id: "moth-and-moon",
    titolo: "Moth & moon",
    macro: "3",
    immagine: img("sb-falena", 600, 1300),
    tags: ["tattoo", "fine line", "illustration"],
    descrizione:
      "Custom back piece: a moth mistaking a lamp for the moon. It happens.",
    data: "2025-05-30",
    ordine: 10,
  },
  {
    id: "street-party",
    titolo: "Neighbours' street party",
    macro: "5",
    immagine: img("sb-vicini", 800, 1000),
    tags: ["invitation", "local graphics"],
    descrizione:
      "Invite and poster for the street party: long tables, bunting and a dog in every drawing.",
    data: "2025-05-01",
    ordine: 11,
  },
  {
    id: "editorial-roots",
    titolo: "Roots",
    macro: "4",
    immagine: img("sb-radici", 1200, 800),
    tags: ["illustration", "editorial"],
    descrizione:
      "Editorial illustration for a piece about leaving and staying. Ink and two colours.",
    data: "2025-03-22",
    ordine: 12,
  },
  {
    /*
      Progetto video: il campo opzionale `video` fa comparire un loop
      muto in griglia (con `immagine` come poster) e un player nel
      lightbox. Su Sanity è un campo `file`; le GIF invece si caricano
      come normali immagini.
    */
    id: "warm-up-set",
    titolo: "Warm-up set, Rye Wax",
    macro: "6",
    immagine: img("sb-ryewax", 1280, 720),
    video: {
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      larghezza: 1280,
      altezza: 720,
    },
    tags: ["dj set", "live", "vinyl"],
    descrizione:
      "Two hours opening the room before the headliner: slow, dubby, nothing to prove. Filmed on someone's phone.",
    data: "2026-03-14",
    ordine: 13,
  },
  {
    id: "tee-after-hours",
    titolo: "“After Hours” tee",
    macro: "5",
    immagine: img("sb-nottefonda", 900, 1100),
    tags: ["t-shirt", "illustration", "music"],
    descrizione:
      "Tour tee for a friend's band: one van, six coffees, zero stars.",
    data: "2025-02-10",
    ordine: 14,
  },
  {
    id: "caffe-duemila",
    titolo: "Caffè Duemila",
    macro: "1",
    immagine: img("sb-duemila", 1000, 1000),
    tags: ["logo", "food", "local graphics"],
    descrizione:
      "Logo and window graphics for an Italian café that refuses to look “postcard Italian”.",
    data: "2024-12-01",
    ordine: 15,
  },
];

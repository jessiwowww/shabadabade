/*
  Dati mock dei progetti (fallback finché Sanity è vuoto).
  Stessa shape dello schema Sanity: { id, immagine, titolo, disciplina,
  tags, descrizione, data, ordine } — vedi src/lib/content.js.

  `disciplina` è il mondo curato (design | illustration | music, vedi
  src/data/disciplines.js): filtra la griglia dal selettore e dai link
  diretti tipo #/music.

  `tags` sono stringhe libere IN INGLESE: la lista dei pin viene sempre
  derivata da qui, mai hardcodata, e si restringe al mondo attivo.
  Le categorie di Commissioni.jsx puntano a questi stessi tag.

  `larghezza`/`altezza` sono le dimensioni naturali dell'immagine:
  servono alla griglia per riservare lo spazio prima del lazy load.
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
    disciplina: "illustration",
    immagine: img("sb-fiori", 800, 1200),
    tags: ["invitation", "illustration", "wedding"],
    descrizione:
      "Invitation suite for a September wedding: hand-drawn flowers, rough paper, no gold foil.",
    data: "2026-03-01",
    ordine: 1,
  },
  {
    id: "bar-luna",
    titolo: "Bar Luna",
    disciplina: "design",
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
    disciplina: "illustration",
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
    disciplina: "illustration",
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
    disciplina: "illustration",
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
    disciplina: "music",
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
    disciplina: "illustration",
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
    disciplina: "design",
    immagine: img("sb-forno", 1280, 720),
    tags: ["logo", "brand identity", "food"],
    descrizione:
      "Full identity for a bakery: logo, bread wrap, stamps and flour-dusted aprons.",
    data: "2025-06-18",
    ordine: 8,
  },
  {
    id: "night-shift-residency",
    titolo: "Night Shift — monthly residency",
    disciplina: "music",
    immagine: img("sb-nightshift", 800, 1150),
    tags: ["club night", "flyer", "dj set"],
    descrizione:
      "A monthly night I run in Peckham: I pick the records and draw the flyers. Doors at ten, no guest list, good sound.",
    data: "2026-04-20",
    ordine: 9,
  },
  {
    id: "moth-and-moon",
    titolo: "Moth & moon",
    disciplina: "illustration",
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
    disciplina: "illustration",
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
    disciplina: "illustration",
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
    disciplina: "music",
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
    disciplina: "illustration",
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
    disciplina: "design",
    immagine: img("sb-duemila", 1000, 1000),
    tags: ["logo", "food", "local graphics"],
    descrizione:
      "Logo and window graphics for an Italian café that refuses to look “postcard Italian”.",
    data: "2024-12-01",
    ordine: 15,
  },
];

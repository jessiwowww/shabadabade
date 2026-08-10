/*
  Temi del sito. Ogni palette pilota le CSS custom properties definite
  in src/index.css, quindi cambiare tema influisce su tutto (sidebar,
  pin, griglia, lightbox, illustrazioni) senza toccare i componenti.

  Gli accenti sono sempre a contrasto con il fondo (giallo su blu/viola/
  nero, blu-viola su giallo/bianco/rosa) così i filtri selezionati
  risaltano in ogni modalità.
*/

export const NERO = {
  nome: "nero",
  bg: "#000000",
  surface: "#101010",
  ink: "#f4f1ea",
  inkSoft: "rgba(244, 241, 234, 0.62)",
  accent: "#ffd23f",
};

export const BIANCO = {
  nome: "bianco",
  bg: "#f7f4ec",
  surface: "#ebe7db",
  ink: "#16130e",
  inkSoft: "rgba(22, 19, 14, 0.6)",
  accent: "#5b2ec7",
};

/* Palette "tempera": colori pieni e opachi, da barattolo di gouache. */
export const TEMPERE = [
  {
    nome: "blu",
    bg: "#2e4fb7",
    surface: "#2843a0",
    ink: "#fdf6e3",
    inkSoft: "rgba(253, 246, 227, 0.68)",
    accent: "#ffd23f",
  },
  {
    nome: "viola",
    bg: "#6c4ab0",
    surface: "#5d3f9b",
    ink: "#fbf3e4",
    inkSoft: "rgba(251, 243, 228, 0.68)",
    accent: "#ffd23f",
  },
  {
    nome: "giallo",
    bg: "#f5c842",
    surface: "#e8b92e",
    ink: "#1f1b10",
    inkSoft: "rgba(31, 27, 16, 0.62)",
    accent: "#4531d8",
  },
  {
    nome: "verde",
    bg: "#3e7c55",
    surface: "#356b49",
    ink: "#f4f1e4",
    inkSoft: "rgba(244, 241, 228, 0.66)",
    accent: "#ffd23f",
  },
  {
    nome: "mattone",
    bg: "#c4472f",
    surface: "#af3d28",
    ink: "#fdf1e0",
    inkSoft: "rgba(253, 241, 224, 0.68)",
    accent: "#ffe066",
  },
  {
    nome: "rosa",
    bg: "#e884a8",
    surface: "#de7399",
    ink: "#331722",
    inkSoft: "rgba(51, 23, 34, 0.64)",
    accent: "#2e3fbf",
  },
];

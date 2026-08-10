/*
  I "mondi" della portfolio career: livello di classificazione CURATO,
  sopra i tag liberi. Pochi, stabili, decisi a mano — mentre i tag
  nascono dai contenuti.

  `id` è il valore salvato su Sanity (campo `disciplina`) e usato nei
  link diretti (#/music). Non va cambiato senza aggiornare i contenuti.

  `intro` compare al posto del sottotitolo quando si arriva da un link
  diretto: un promoter che apre #/music legge subito la frase giusta.
*/
export const DISCIPLINES = [
  {
    id: "design",
    label: "Design",
    titolo: "Design & brand identity",
    intro: "Logos, identities and signs for places worth remembering.",
  },
  {
    id: "illustration",
    label: "Illustration",
    titolo: "Illustration & tattoo",
    intro: "Drawings for skin, paper, walls and t-shirts.",
  },
  {
    id: "music",
    label: "Music",
    titolo: "Music & DJ sets",
    intro: "Records I play, nights I put together, artwork that goes with them.",
  },
];

export const DISCIPLINE_IDS = DISCIPLINES.map((d) => d.id);

export function getDiscipline(id) {
  return DISCIPLINES.find((d) => d.id === id) ?? null;
}

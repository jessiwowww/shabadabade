import { Adesivi, Poster, Cartolina, Download, Logo, Matita, Bottega, Busta } from "./oggetti.jsx";

/*
  Cose che si comprano subito. `href` è la pagina del prodotto sul
  negozio scelto (Ko-fi, Stripe, Big Cartel…); finché manca, il
  pulsante apre una mail già intestata. Più avanti: un modulo nella
  pagina (Resend) al posto della mail, che dipende dal programma di
  posta di chi visita. `prezzo` resta null finché
  Sharon non lo decide: un prezzo inventato non va mai online.
*/
export const PRODOTTI = [
  {
    id: "stickers",
    nome: "Stickers",
    nota: "for laptops, bottles, lampposts",
    prezzo: null,
    href: null,
    Disegno: Adesivi,
  },
  {
    id: "posters",
    nome: "Posters",
    nota: "printed, signed, ready for a wall",
    prezzo: null,
    href: null,
    Disegno: Poster,
  },
  {
    id: "postcards",
    nome: "Postcards",
    nota: "to send, or to keep",
    prezzo: null,
    href: null,
    Disegno: Cartolina,
  },
  {
    id: "downloads",
    nome: "Downloads",
    nota: "wallpapers and printables, straight to you",
    prezzo: null,
    href: null,
    Disegno: Download,
  },
];

/*
  `macro` è l'etichetta di una categoria di src/data/macroCategories.js.
  Si clicca solo quella che ha davvero dei lavori dentro: le altre
  restano visibili, perché raccontano cosa Sharon accetta, ma non
  promettono una galleria che non esiste.
*/
export const COMMISSIONI = [
  { macro: "Identity", nome: "Logos", nota: "for businesses that want a face", Disegno: Logo },
  { macro: "Illustration", nome: "Illustrations", nota: "editorial, covers, gifts", Disegno: Matita },
  { macro: "Image", nome: "Local graphics", nota: "posters, signs, markets", Disegno: Bottega },
  { macro: "Editorial", nome: "Invitations", nota: "weddings, parties, occasions", Disegno: Busta },
];

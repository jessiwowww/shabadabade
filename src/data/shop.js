import { Adesivi, Poster, Cartolina, Download, Logo, Matita, Bottega, Busta } from "./oggetti.jsx";

/*
  Cose che si comprano subito. `href` è la pagina del prodotto sul
  negozio scelto (Ko-fi, Stripe, Big Cartel…); finché manca, il
  pulsante apre una mail già intestata. `prezzo` resta null finché
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

// `tag` deve esistere nei lavori perché il filtro mostri qualcosa
export const COMMISSIONI = [
  { tag: "logo", nome: "Logos", nota: "for businesses that want a face", Disegno: Logo },
  { tag: "illustration", nome: "Illustrations", nota: "editorial, covers, gifts", Disegno: Matita },
  { tag: "local graphics", nome: "Local graphics", nota: "posters, signs, markets", Disegno: Bottega },
  { tag: "invitation", nome: "Invitations", nota: "weddings, parties, occasions", Disegno: Busta },
];

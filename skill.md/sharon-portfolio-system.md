SKILL.md — Sharon Bertoncello Portfolio



text

---
name: sharon-portfolio-system
description: Design system e motion guidelines per il portfolio React/
Vite di Sharon Bertoncello, designer e illustratrice. Usa questa skill
ogni volta che generi, modifichi o estendi componenti del sito
portfolio di Sharon, inclusi cursore custom, griglia lavori e
integrazione Sanity CMS.
---

# Sharon Bertoncello — Portfolio System

## Stack tecnico obbligatorio
- Vite + React 18+ (JavaScript)
- Tailwind CSS per styling
- Framer Motion per cursore custom e animazioni
- Sanity Studio come headless CMS (schema progetti + app mobile per
  editing)
- react-masonry-css (o CSS grid nativo) per la griglia lavori

## Identità visiva
- Palette base: nero puro, esposta come variabile CSS custom property
  (--sb-bg-color) per essere sostituibile senza refactoring
- Tipografia: un solo font display elegante per nome/titoli,
  sans-serif neutro per bio/testo
- Il contenuto (illustrazioni di Sharon) è sempre protagonista: UI
  minimale, nessun elemento decorativo che compete con le immagini

## Cursore custom (elemento signature, priorità massima)
- Nascondi cursore di sistema su desktop (cursor: none)
- Cursore custom con movimento a molla via useMotionValue + useSpring
  (stiffness 120-180, damping 15-20 per curva morbida e ritardata,
  non 1:1 con il mouse reale)
- Il cursore mostra un'illustrazione invece di un pallino generico
- Al click o su tasto dedicato, cambia random tra un set di
  illustrazioni (props array, facile da espandere)
- Disabilita completamente su touch/mobile (nessun cursore custom,
  cursore nativo)

text

## La griglia (stile Tumblr, no limiti di formato)
- Layout Masonry vero e proprio (stile Pinterest/Tumblr): colonne di
  larghezza fissa, altezza libera per ogni elemento, nessun vincolo di
  aspect ratio imposto — ogni immagine mantiene le proprie proporzioni
  originali (usa react-responsive-masonry o masonic per gestione
  efficiente di molti elementi)
- Nessuna categoria fissa predefinita nel codice: i tag sono generati
  dinamicamente dai contenuti caricati (ogni progetto ha un array di
  tag liberi assegnati da Sharon in fase di upload)
- Nessun limite di formato: foto, illustrazioni verticali, orizzontali,
  quadrate, GIF — la griglia si adatta a tutto

## Sistema tag come "pin" laterali (feature signature)
- Sidebar fissa (desktop) o drawer collassabile (mobile) con tutti i
  tag esistenti nel sistema, mostrati come "pin" (piccoli elementi
  cliccabili, stile spilla/etichetta, non semplici pillole piatte)
- I tag più usati sono visivamente più prominenti (dimensione o
  opacità proporzionale alla frequenza d'uso, effetto "tag cloud"
  sottile)
- Click su un pin: si "evidenzia" (stato attivo con colore/bordo) e
  filtra la griglia mostrando solo i progetti con quel tag
- Supporto multi-selezione: più pin possono essere attivi
  contemporaneamente (filtro OR o AND, di default OR)
- Animazione: quando si applica un filtro, gli elementi non
  corrispondenti escono con fade/scale-out, quelli corrispondenti si
  riorganizzano fluidamente nella griglia (layout animation via Framer
  Motion layout prop)

## Integrazione Sanity CMS aggiornata
- Schema progetti: { id, immagine, titolo, tags: [array libero di
  stringhe], descrizione, data, ordine }
- I tag sono un campo array di stringhe libere in Sanity (non un
  enum fisso), così Sharon può inventare nuovi tag caricando dal
  cellulare senza limiti
- Hook useProjects() deve anche esporre useAllTags() che estrae
  dinamicamente la lista unica di tag da tutti i progetti caricati,
  con relativo conteggio di frequenza





## Tono di voce
Personale, artistico, mai corporate/agenzia. Frasi brevi e dirette
(es. "Disegno cose che restano impresse"). Zero linguaggio da
"servizi" o "pacchetti".

## Vincoli contenuto
- CV essenziale: Presentation Specialist attuale presso Ogilvy Health,
  esperienza precedente in gruppo WPP, base a Londra
- Nessun form complesso: solo email diretta + link social



## Strategia Mobile vs Desktop (obbligatoria, non opzionale)
- Cursore custom: solo desktop, su mobile completamente assente (mai
  sostituito con un finto cursore touch, userà il touch nativo)
- Sidebar tag "pin": su desktop fissa laterale sempre visibile, su
  mobile diventa drawer collassabile richiamabile con un tap (icona
  filtro flottante o pulsante fisso), per non rubare spazio alla
  griglia su schermo piccolo
- Griglia Masonry: su desktop 3-4 colonne, su mobile 1-2 colonne
  massimo, mantenendo sempre le proporzioni naturali delle immagini
- Lightbox progetto: su desktop overlay centrato con dettagli laterali,
  su mobile fullscreen con swipe per navigare tra progetti (gesture
  nativa, non solo pulsanti frecce)
- Touch target minimo 44x44px su pin filtro e controlli lightbox
- Performance: su mobile limitare il numero di immagini caricate
  simultaneamente nella griglia (lazy load aggressivo), dato l'alto
  numero di contenuti visivi









-ultima versione.



## Cursore custom + illustrazioni lanciate al click
- Il cursore di sistema NON viene nascosto: resta sempre visibile e
  utilizzabile per precisione di click (cursor: auto, mai cursor:
  none)
- Un'illustrazione decorativa (più grande e "goffa" della freccia)
  segue il cursore reale con un leggero ritardo (movimento a molla via
  Framer Motion useMotionValue + useSpring, stiffness 100-150, damping
  15-20), posizionata con un offset fisso rispetto al puntatore (es.
  20-30px in basso a destra) in modo da non sovrapporsi mai alla
  freccia di sistema
- L'illustrazione è scelta random da un set di 4-5 placeholder al
  caricamento della pagina, e resta la stessa fino al refresh (non
  cambia durante la navigazione)
- z-index dell'illustrazione più basso o pari a quello degli elementi
  cliccabili, mai sopra, per non intercettare accidentalmente eventi
  di click destinati ad altri elementi (pointer-events: none
  sull'illustrazione, obbligatorio)

## Illustrazioni lanciate al click (effetto separato, non il cursore)
- Al click in qualsiasi punto della pagina: genera una nuova
  illustrazione (random dal set) che appare vicino al punto di click e
  si anima con fade-in + scale-up + traiettoria random, poi fade-out e
  rimozione (2-3 secondi totali)
- Elemento indipendente dal cursore-satellite: click multipli generano
  più illustrazioni "lanciate" che convivono sullo schermo insieme
  all'illustrazione che segue il cursore
- Anche questo elemento ha pointer-events: none, per non interferire
  mai con i click reali

## Comportamento su mobile (senza cursore)
- Nessuna illustrazione satellite (non esiste un cursore da seguire)
- Il tap su aree non interattive genera solo l'illustrazione lanciata
  al click, identica a desktop
- Tap su elementi interattivi (bottoni, pin, card) non genera l'effetto


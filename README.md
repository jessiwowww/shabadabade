# sharonbertoncello.com

Portfolio di Sharon Bertoncello — designer e illustratrice, Londra.
Home con griglia filtrabile a "pin" + pagina Projects (case study a
blocchi). Contenuti su Sanity CMS.

## Stack

- **Next.js 16** (App Router, JavaScript) + React 19
- Tailwind CSS 4 (plugin `@tailwindcss/postcss`)
- Framer Motion (cursore satellite, illustrazioni al click, animazioni filtro)
- react-responsive-masonry (griglia stile Tumblr/Pinterest)
- Sanity headless CMS — progetto `gdqr6s88`, dataset `production`

## Comandi

```bash
# sito
npm install
npm run dev      # sviluppo su http://localhost:3000
npm run build    # build di produzione
npm run start    # serve la build (verifica prima del deploy)

# Sanity Studio (cartella studio/)
cd studio
npm install
npx sanity login     # prima volta: login con l'account del progetto
npm run dev          # studio locale su http://localhost:3333
npm run deploy       # pubblica lo studio su <nome>.sanity.studio
```

## Struttura

| Cartella | Cosa contiene |
| --- | --- |
| `src/app/` | Rotte (App Router), layout, metadati, sitemap, robots |
| `src/components/` | Componenti dell'interfaccia |
| `src/hooks/` | Stato dell'interfaccia (tema, colonne, tag, puntatore) |
| `src/lib/` | Client Sanity, query contenuti, utilità |
| `src/data/` | Dati di esempio (fallback) e palette dei temi |
| `studio/` | Sanity Studio: schemi dei contenuti |

### Rotte

| Indirizzo | Pagina |
| --- | --- |
| `/` | Home: hero, griglia filtrabile, about, commissioni, contatti |
| `/projects` | Elenco dei progetti completi |
| `/projects/<slug>` | Dettaglio di un progetto |
| `/sitemap.xml`, `/robots.txt` | Generati dai contenuti |

## Come funzionano i dati

- Le query girano **lato server** (`src/lib/content.js`): il contenuto è
  già nell'HTML, quindi indicizzabile e con anteprime di condivisione
  corrette. Il CORS di Sanity non serve più per il sito (solo per lo Studio).
- Le pagine si rigenerano al massimo ogni 60 secondi (`export const
  revalidate = 60`): quello che Sharon pubblica compare da solo, **senza
  ricompilare né ripubblicare** il sito.
- **Fallback**: se Sanity è vuoto o non risponde, il sito mostra i dati
  di esempio di `src/data/` e lo scrive nei log del server. Non si
  presenta mai rotto.
- Tre tipi di contenuto (schemi in `studio/schemas/`): **Work (grid)** →
  griglia home e pin; **Project** → pagina Projects, contenuti a blocchi
  testo/immagine/video; **About** → documento unico con foto e bio.
- I tag sono liberi e **in inglese**: i pin della sidebar nascono da lì
  (`src/hooks/useAllTags.js`), mai hardcodati. Le categorie di
  `Commissioni.jsx` puntano a quegli stessi tag.

## Variabili d'ambiente

Copiare `.env.example` in `.env.local`. Nessuna è un segreto (il
projectId Sanity è pubblico, il dataset è in sola lettura).
`NEXT_PUBLIC_SITE_URL` va aggiornata al dominio vero: da essa dipendono
sitemap e immagini di anteprima delle condivisioni.

## Deploy

Non ancora in produzione. Percorso previsto: **Vercel** (import del
repo, build automatica a ogni push su `main`), impostando le variabili
d'ambiente sopra. Lo Studio Sanity si pubblica separatamente con
`npm run deploy` dalla cartella `studio/`.

Da fare al primo deploy: dominio, aggiunta del dominio ai CORS origins
di Sanity (per lo Studio), Search Console.

## Foto di apertura

Sharon ha preparato una versione della foto per ogni colore del sito.
I file vanno in **`public/hero/`**, nominati con il colore della
palette (`src/data/themes.js`):

```
public/hero/nero.jpg      bianco.jpg    blu.jpg
            viola.jpg     verde.jpg     mattone.jpg
```

La mappa sta in `src/data/heroPhotos.js`. Se un file manca, l'immagine
si toglie da sola e resta l'apertura tipografica — meglio niente che un
riquadro rotto.

**Da chiudere**: le tempere `giallo` e `rosa` non hanno una variante
della foto (al momento ripiegano su `nero.jpg`). O si disegnano le due
varianti mancanti, o si tolgono quei due colori dalla palette.

## Disegni (cursore e click)

I disegni veri di Sharon stanno in `src/data/illustrations.jsx`: gli
SVG originali con i colori sostituiti da `currentColor`, così prendono
il colore del tema. Ogni disegno ha il **viewBox ritagliato**
sull'ingombro reale del tratto — negli originali il disegno occupava
dal 44% al 73% del riquadro, quindi a parità di dimensione alcuni
sembravano molto più piccoli. Per aggiungerne uno: incolla il path,
metti `currentColor` al posto dei colori fissi, e misura il viewBox con
`getBBox()` (più ~40 unità di margine per gli spessori del tratto).

## Note di design

- Il cursore di sistema resta sempre visibile: l'illustrazione è un
  "satellite" con offset in basso a destra, `pointer-events: none`.
- Il tema (nero / bianco / colore random "tempera") è applicato da uno
  script inline **prima** che la pagina si disegni, per non far
  lampeggiare il nero a chi ha scelto il bianco. Le palette stanno in
  `src/data/themes.js` — unica fonte, serializzata nello script.
- Mobile e desktop sono esperienze diverse: niente cursore satellite su
  touch, sidebar → drawer, lightbox con swipe.
- **Idratazione**: il primo render del browser deve coincidere con
  quello del server. Per questo `useIsDesktop` parte da `false` e
  `useColumnCount` da un valore fisso: i valori veri arrivano subito
  dopo il montaggio. Non reintrodurre `window` / `localStorage` negli
  inizializzatori di stato.

## Prossimi passi

1. **Tassonomia a tre livelli** (in corso di definizione): macro
   categorie numeriche, tag liberi, album dentro la copertina.
2. **Immagini**: servire quelle di Sanity ridimensionate dalla loro CDN
   (`?w=…&auto=format`) invece che a piena risoluzione — conta molto con
   un portfolio di centinaia di foto.
3. Contenuti veri su Sanity al posto dei dati di esempio.

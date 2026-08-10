# sharonbertoncello.com

Portfolio di Sharon Bertoncello — designer e illustratrice, Londra.
Home one-page (griglia filtrabile con pin) + pagina Progetti (case
study a blocchi), contenuti gestiti con Sanity CMS.

## Stack

- Vite + React 18 (JavaScript)
- Tailwind CSS 4 (plugin `@tailwindcss/vite`)
- Framer Motion (cursore satellite, illustrazioni al click, animazioni filtro)
- react-responsive-masonry (griglia stile Tumblr/Pinterest)
- Sanity (headless CMS — progetto `gdqr6s88`, dataset `production`)

## Comandi

```bash
# sito
npm install
npm run dev      # sviluppo su http://localhost:5173
npm run build    # build di produzione in dist/

# Sanity Studio (cartella studio/)
cd studio
npm install
npx sanity login     # prima volta: login con l'account del progetto
npm run dev          # studio locale su http://localhost:3333
npm run deploy       # pubblica lo studio su <nome>.sanity.studio
```

## Sanity: come è collegato

- Tre tipi di contenuto (schemi in `studio/schemas/`):
  **Lavoro (griglia)** → griglia home e pin; **Progetto completo** →
  pagina Progetti, contenuti a blocchi testo/immagine/video;
  **Chi sono** → documento unico con foto e bio.
- Il sito legge a runtime (hook in `src/hooks/`, client in
  `src/lib/sanity.js`): quando Sharon pubblica, il sito si aggiorna da
  solo, senza rebuild.
- **Fallback automatico**: finché Sanity è vuoto o irraggiungibile, il
  sito mostra i dati di esempio di `src/data/` (lo segnala in console).
- **CORS (da fare una volta)**: su [sanity.io/manage](https://www.sanity.io/manage)
  → progetto → API → CORS origins aggiungere `http://localhost:5173` e
  il dominio pubblico del sito (senza credenziali).
- Per invitare Sharon: sanity.io/manage → progetto → Members.

## Dove mettere le mani

| Cosa | Dove |
| --- | --- |
| Dati di esempio / fallback | `src/data/projects.js`, `src/data/caseStudies.js` |
| Illustrazioni cursore/click (placeholder da sostituire con i disegni di Sharon) | `src/data/illustrations.jsx` |
| Client e query Sanity | `src/lib/sanity.js`, `src/hooks/useProjects.js`, `src/hooks/useCaseStudies.js`, `src/hooks/useChiSono.js` |
| Schemi del CMS | `studio/schemas/` |
| Temi (nero / bianco / palette tempera del random) | `src/data/themes.js` (le CSS var di base sono in `src/index.css`) |
| Email e social reali | `src/components/Contatti.jsx` |

## Note di design (da skill `sharon-portfolio-system`)

- Il cursore di sistema resta sempre visibile: l'illustrazione è un
  "satellite" con offset in basso a destra, `pointer-events: none`.
- I tag non sono mai hardcodati: derivano dai dati progetti
  (`src/hooks/useAllTags.js`), così i nuovi tag creati su Sanity
  compaiono da soli nella sidebar dei pin.
- Mobile e desktop sono esperienze diverse: niente cursore satellite su
  touch, sidebar → drawer, lightbox con swipe.

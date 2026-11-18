import Script from "next/script";
import { Space_Grotesk, Inter, Caprasimo } from "next/font/google";
import SiteChrome from "./SiteChrome.jsx";
import { ThemeProvider } from "@/components/ThemeProvider.jsx";
import { SITE_URL } from "@/lib/site.js";
import { getCaseStudies } from "@/lib/content.js";
import { NERO, BIANCO, TEMPERE } from "@/data/themes.js";
import "./globals.css";

/*
  Applicato PRIMA che la pagina si disegni: senza, chi ha scelto il
  bianco vedrebbe un lampo di nero a ogni caricamento. Lascia la
  scelta in window.__sbTheme perché useTheme non la rifaccia.
*/
const themeScript = `(function(){try{
var N=${JSON.stringify(NERO)},B=${JSON.stringify(BIANCO)},T=${JSON.stringify(TEMPERE)};
var m="nero";try{var s=localStorage.getItem("sb-theme-mode");
if(s==="nero"||s==="bianco"||s==="random"){m=s}}catch(e){}
var p=m==="bianco"?B:m==="random"?T[Math.floor(Math.random()*T.length)]:N;
var r=document.documentElement.style;
r.setProperty("--sb-bg-color",p.bg);r.setProperty("--sb-surface",p.surface);
r.setProperty("--sb-ink",p.ink);r.setProperty("--sb-ink-soft",p.inkSoft);
r.setProperty("--sb-accent",p.accent);
window.__sbTheme={mode:m,palette:p};
}catch(e){}})();`;

// self-hosted: niente richiesta bloccante a Google al caricamento
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const caprasimo = Caprasimo({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-caprasimo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

// metadataBase rende assoluti gli indirizzi delle anteprime social:
// senza, le anteprime dei link non funzionano
export const metadata = {
  metadataBase: new URL(SITE_URL),
  // il nome vero resta accanto: chi la cerca per nome deve trovarla
  title: {
    default: "shabadabade — Sharon Bertoncello, multimedia artist",
    template: "%s — shabadabade",
  },
  description:
    "shabadabade is Sharon Bertoncello, multimedia artist based in London: design, illustration and performance. Logos, illustrations and commissioned work for people and places.",
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "shabadabade",
    title: "shabadabade — Sharon Bertoncello",
    description:
      "Multimedia artist in London. Design, Illustration and Performance.",
    url: "/",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "shabadabade — Sharon Bertoncello" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "shabadabade — Sharon Bertoncello",
    description:
      "Multimedia artist in London. Design, Illustration and Performance.",
    images: ["/og.jpg"],
  },
  alternates: { canonical: "/" },
};

export default async function RootLayout({ children }) {
  const haProgetti = (await getCaseStudies()).length > 0;

  return (
    // lo script del tema scrive sullo <html>: la differenza col server
    // è voluta, non un errore di idratazione
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${caprasimo.variable} ${inter.variable}`}
    >
      <body>
        <Script
          id="sb-theme"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <ThemeProvider>
          <SiteChrome haProgetti={haProgetti} />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}

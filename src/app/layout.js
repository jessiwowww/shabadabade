import Script from "next/script";
import { Space_Grotesk, Inter, Caprasimo } from "next/font/google";
import SiteChrome from "./SiteChrome.jsx";
import { ThemeProvider } from "@/components/ThemeProvider.jsx";
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://sharonbertoncello.com"
  ),
  // il nome vero resta accanto: chi la cerca per nome deve trovarla
  title: {
    default: "shabadabade — Sharon Bertoncello, designer & illustrator",
    template: "%s — shabadabade",
  },
  description:
    "shabadabade is Sharon Bertoncello, designer and illustrator based in London. Logos, illustrations, t-shirts, invitations and tattoos — available for commissions.",
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "shabadabade",
    title: "shabadabade — Sharon Bertoncello",
    description:
      "Designer and illustrator based in London. I draw things that stick.",
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }) {
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
          <SiteChrome />
          <main className="lg:pl-52">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}

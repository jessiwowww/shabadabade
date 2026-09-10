/*
  Foto e bio arrivano dal server (documento "About" su Sanity, con
  fallback ai contenuti di default): vedi src/lib/content.js.
*/
export default function ChiSono({ about }) {
  const { foto, bio } = about;

  return (
    <section id="chi-sono" className="scroll-mt-12 px-5 py-14 sm:px-8 lg:px-12">
      <h2 className="mb-6 font-display text-2xl font-bold tracking-tight sm:text-3xl">
        About
      </h2>

      <div className="flex max-w-4xl flex-col gap-10 md:flex-row md:items-start">
        <img
          src={foto.url}
          alt="Portrait of Sharon Bertoncello"
          width={foto.larghezza}
          height={foto.altezza}
          loading="lazy"
          decoding="async"
          className="w-52 shrink-0 rotate-2 rounded-xl border border-sb-ink/15 md:order-last md:w-64"
        />

        <div className="max-w-2xl">
        <p className="text-lg leading-relaxed text-sb-ink">{bio}</p>

        <ul className="mt-8 space-y-4 border-l border-sb-ink/20 pl-6 text-sm">
          <li>
            <span className="block font-semibold text-sb-ink">
              Presentation Specialist — Ogilvy Health
            </span>
            <span className="text-sb-ink-soft">London, current</span>
          </li>
          <li>
            <span className="block font-semibold text-sb-ink">
              Previously — WPP group
            </span>
            <span className="text-sb-ink-soft">Design & visual communication</span>
          </li>
          <li>
            <span className="block font-semibold text-sb-ink">Based in London</span>
            <span className="text-sb-ink-soft">
              Available for commissions anywhere
            </span>
          </li>
        </ul>
        </div>
      </div>
    </section>
  );
}

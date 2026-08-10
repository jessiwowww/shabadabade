/*
  Contatti essenziali: nessun form, solo email diretta e social.
  Aggiornare i link con quelli reali di Sharon.
*/
const CONTATTI = [
  {
    label: "Email",
    value: "hello@sharonbertoncello.com",
    href: "mailto:hello@sharonbertoncello.com",
  },
  {
    label: "LinkedIn",
    value: "in/sharonbertoncello",
    href: "https://www.linkedin.com/in/sharonbertoncello",
  },
  {
    label: "Instagram",
    value: "@sharonbertoncello",
    href: "https://www.instagram.com/sharonbertoncello",
  },
];

export default function Contatti() {
  return (
    <section id="contatti" className="scroll-mt-12 px-5 py-14 pb-24 sm:px-8 lg:px-12">
      <h2 className="mb-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
        Contact
      </h2>
      <p className="mb-8 max-w-xl text-sb-ink-soft">
        Got a logo, a tattoo, an invitation in mind? Drop me a line — I
        answer personally.
      </p>

      <ul className="space-y-5">
        {CONTATTI.map((c) => (
          <li key={c.label}>
            <span className="block text-xs uppercase tracking-[0.2em] text-sb-ink-soft">
              {c.label}
            </span>
            <a
              href={c.href}
              data-interactive
              target={c.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noreferrer"
              className="inline-flex min-h-11 items-center font-display text-lg font-semibold text-sb-ink underline-offset-4 hover:text-sb-accent hover:underline sm:text-xl"
            >
              {c.value}
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-16 text-xs text-sb-ink-soft/60">
        © {new Date().getFullYear()} Sharon Bertoncello — London
      </p>
    </section>
  );
}

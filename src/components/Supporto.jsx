import { motion } from "framer-motion";
import { PRODOTTI, COMMISSIONI } from "@/data/shop";
import { mailto } from "@/data/contatti";

const INCLINA = [-4, 3, -2, 5];

function Prodotto({ p, i }) {
  const href = p.href ?? mailto(`I'd like some ${p.nome.toLowerCase()}`);
  const esterno = !!p.href;
  return (
    <li className="flex flex-col">
      <motion.div
        aria-hidden="true"
        className="aspect-square w-full max-w-44 text-sb-accent"
        initial={{ rotate: INCLINA[i % INCLINA.length] }}
        whileHover={{ rotate: 0, scale: 1.06, y: -6 }}
        transition={{ type: "spring", stiffness: 260, damping: 14 }}
      >
        <p.Disegno />
      </motion.div>
      <h3 className="mt-5 font-display text-xl font-bold tracking-tight">{p.nome}</h3>
      <p className="mt-1 text-sm text-sb-ink-soft">{p.nota}</p>
      {p.prezzo && <p className="mt-2 text-sm font-semibold">{p.prezzo}</p>}
      <a
        href={href}
        data-interactive
        target={esterno ? "_blank" : undefined}
        rel={esterno ? "noreferrer" : undefined}
        className="mt-4 inline-flex min-h-11 w-fit items-center gap-2 whitespace-nowrap rounded-full bg-sb-ink px-4 text-sm font-semibold sm:px-5 text-sb-bg transition-colors hover:bg-sb-accent"
      >
        Order
        <span aria-hidden="true">→</span>
        <span className="sr-only">: {p.nome}</span>
      </a>
    </li>
  );
}

export default function Supporto({ onPick }) {
  return (
    <>
      <section id="shop" className="scroll-mt-16 px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <p className="text-xs uppercase tracking-[0.25em] text-sb-ink-soft">
          Support my work
        </p>
        <h2 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
          Take a drawing home.
        </h2>
        <p className="mt-4 max-w-xl text-lg text-sb-ink-soft">
          Stickers, posters, postcards and downloads. Every one you buy
          pays for the next drawing.
        </p>

        <ul className="mt-14 grid grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-4 lg:gap-x-10">
          {PRODOTTI.map((p, i) => (
            <Prodotto key={p.id} p={p} i={i} />
          ))}
        </ul>
      </section>

      <section
        id="commissioni"
        className="scroll-mt-16 border-t border-sb-ink/15 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-sb-ink-soft">
              Commissions
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Or let&apos;s make one together.
            </h2>
            <p className="mt-4 text-sb-ink-soft">
              Tap one to see that kind of work. Then write to me.
            </p>
            <a
              href={mailto("A commission")}
              data-interactive
              className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-sb-ink px-5 text-sm font-semibold transition-colors hover:border-sb-accent hover:text-sb-accent"
            >
              Start a commission <span aria-hidden="true">→</span>
            </a>
          </div>

          <ul className="border-t border-sb-ink/15">
            {COMMISSIONI.map((c) => (
              <li key={c.tag} className="border-b border-sb-ink/15">
                <button
                  type="button"
                  data-interactive
                  onClick={() => onPick(c.tag)}
                  className="group flex w-full items-center gap-5 py-5 text-left"
                >
                  <span
                    aria-hidden="true"
                    className="h-12 w-12 shrink-0 text-sb-ink-soft transition-[color,transform] duration-300 group-hover:-rotate-12 group-hover:scale-110 group-hover:text-sb-accent sm:h-14 sm:w-14"
                  >
                    <c.Disegno />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-2xl font-bold tracking-tight transition-colors group-hover:text-sb-accent sm:text-3xl">
                      {c.nome}
                    </span>
                    <span className="block text-sm text-sb-ink-soft">{c.nota}</span>
                  </span>
                  <span className="hidden text-sm text-sb-ink-soft transition-transform group-hover:translate-x-1 sm:block">
                    See work <span aria-hidden="true">↑</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

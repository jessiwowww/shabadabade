import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      id="top"
      className="flex min-h-[82vh] flex-col justify-center px-5 py-16 sm:px-8 lg:px-12"
    >
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-xs uppercase tracking-[0.25em] text-sb-ink-soft"
      >
        Designer & illustrator — London
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="mt-4 font-display text-5xl font-bold leading-[0.95] tracking-tighter sm:text-7xl lg:text-8xl"
      >
        Sharon
        <br />
        Bertoncello
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25 }}
        className="mt-6 max-w-md text-lg text-sb-ink-soft sm:text-xl"
      >
        I draw things that stick.
      </motion.p>

      <motion.a
        href="#lavori"
        data-interactive
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-10 inline-flex min-h-11 w-fit items-center gap-2 text-sm text-sb-ink-soft underline-offset-4 hover:text-sb-accent hover:underline"
      >
        See the work
        <motion.span
          aria-hidden="true"
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          ↓
        </motion.span>
      </motion.a>
    </section>
  );
}

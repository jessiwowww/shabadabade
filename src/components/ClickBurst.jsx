import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ILLUSTRATIONS, randomIllustrationIndex } from "../data/illustrations";
import { useIsDesktop } from "../hooks/useIsDesktop";

/*
  Illustrazioni "lanciate" al click: indipendenti dal cursore satellite.
  Desktop: ogni click sulla pagina ne genera una.
  Mobile: solo i tap su aree NON interattive (i tap su bottoni, pin,
  card e link non generano l'effetto).
*/
const INTERACTIVE_SELECTOR =
  "a, button, input, textarea, select, [role='button'], [data-interactive]";

const SIZE = 88;

export default function ClickBurst() {
  const isDesktop = useIsDesktop();
  const [bursts, setBursts] = useState([]);

  useEffect(() => {
    const onClick = (e) => {
      const interactive = e.target.closest?.(INTERACTIVE_SELECTOR);
      if (!isDesktop && interactive) return;

      const direction = Math.random() < 0.7 ? "up" : "side";
      setBursts((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          x: e.clientX,
          y: e.clientY,
          illoIndex: randomIllustrationIndex(),
          // traiettoria random: verso l'alto o laterale
          dx:
            direction === "side"
              ? (Math.random() < 0.5 ? -1 : 1) * (90 + Math.random() * 70)
              : Math.random() * 100 - 50,
          dy: direction === "up" ? -(90 + Math.random() * 110) : -(Math.random() * 40),
          rotate: Math.random() * 80 - 40,
        },
      ]);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [isDesktop]);

  const remove = (id) => setBursts((prev) => prev.filter((b) => b.id !== id));

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
      <AnimatePresence>
        {bursts.map((b) => {
          const Illo = ILLUSTRATIONS[b.illoIndex];
          return (
            <motion.div
              key={b.id}
              // text-sb-accent: i disegni usano currentColor
              className="absolute left-0 top-0 text-sb-accent"
              initial={{
                opacity: 0,
                scale: 0.2,
                x: b.x - SIZE / 2,
                y: b.y - SIZE / 2,
                rotate: 0,
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0.2, 1.15, 1, 0.85],
                x: b.x - SIZE / 2 + b.dx,
                y: b.y - SIZE / 2 + b.dy,
                rotate: b.rotate,
              }}
              transition={{
                duration: 2.4,
                ease: "easeOut",
                opacity: { times: [0, 0.1, 0.65, 1], duration: 2.4 },
              }}
              onAnimationComplete={() => remove(b.id)}
            >
              <Illo size={SIZE} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ILLUSTRATIONS, randomIllustrationIndex } from "../data/illustrations";
import { coloreDisegnoCasuale } from "../data/doodleColors";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { useThemeContext } from "./ThemeProvider.jsx";

// il cursore di sistema resta sempre visibile: l'illustrazione lo
// segue con un offset fisso per non coprirlo mai
const OFFSET = 26;

export default function CustomCursor() {
  const isDesktop = useIsDesktop();
  const { palette } = useThemeContext();
  // il disegno è fisso fino al refresh, il colore si ripesca al cambio
  // tema: quello di prima potrebbe sparire sul nuovo sfondo
  const [illoIndex] = useState(randomIllustrationIndex);
  const colore = useMemo(() => coloreDisegnoCasuale(palette), [palette]);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { stiffness: 120, damping: 17 });
  const springY = useSpring(y, { stiffness: 120, damping: 17 });

  useEffect(() => {
    if (!isDesktop) return;
    const onMove = (e) => {
      x.set(e.clientX + OFFSET);
      y.set(e.clientY + OFFSET);
      setVisible(true);
    };
    const onLeave = () => setVisible(false);
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [isDesktop, x, y]);

  if (!isDesktop) return null;

  const Illo = ILLUSTRATIONS[illoIndex];

  return (
    <motion.div
      aria-hidden="true"
      // pointer-events-none + z-index basso: non intercetta mai i click.
      // il colore arriva da `color`: i disegni usano currentColor
      className="pointer-events-none fixed left-0 top-0 z-[5]"
      style={{
        x: springX,
        y: springY,
        opacity: visible ? 1 : 0,
        color: colore,
      }}
    >
      <Illo size={92} />
    </motion.div>
  );
}

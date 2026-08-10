import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ILLUSTRATIONS, randomIllustrationIndex } from "../data/illustrations";
import { useIsDesktop } from "../hooks/useIsDesktop";

/*
  Cursore "satellite": il cursore di sistema resta sempre visibile
  (mai cursor: none), un'illustrazione lo segue con ritardo a molla
  e un offset fisso in basso a destra per non coprirlo mai.
  Solo desktop; su touch non viene montato nulla.
*/
const OFFSET = 26;

export default function CustomCursor() {
  const isDesktop = useIsDesktop();
  // Illustrazione scelta random al caricamento, fissa fino al refresh
  const [illoIndex] = useState(randomIllustrationIndex);
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
      // pointer-events-none + z-index basso: non intercetta mai i click
      className="pointer-events-none fixed left-0 top-0 z-[5]"
      style={{ x: springX, y: springY, opacity: visible ? 1 : 0 }}
    >
      <Illo size={54} />
    </motion.div>
  );
}

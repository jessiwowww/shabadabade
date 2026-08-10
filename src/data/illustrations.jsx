/*
  Set di illustrazioni placeholder (doodle SVG) usate dal cursore
  satellite e dall'effetto "lancio" al click.
  Da sostituire con i disegni veri di Sharon: basta esportare qui
  altri componenti SVG mantenendo la stessa firma ({ size }).
*/

const base = {
  fill: "none",
  strokeWidth: 3.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function Stella({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <path
        {...base}
        stroke="var(--sb-accent)"
        d="M32 6 L38 24 L57 25 L42 37 L48 56 L32 44 L16 56 L22 37 L7 25 L26 24 Z"
      />
    </svg>
  );
}

export function Fiore({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <circle {...base} stroke="var(--sb-accent)" cx="32" cy="32" r="7" />
      <path
        {...base}
        stroke="var(--sb-ink)"
        d="M32 25 C26 12, 40 12, 32 25 M39 30 C52 24, 52 38, 39 33 M32 39 C38 52, 24 52, 32 39 M25 33 C12 38, 12 24, 25 30"
      />
    </svg>
  );
}

export function Spirale({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <path
        {...base}
        stroke="var(--sb-ink)"
        d="M32 32 C36 30, 37 35, 33 37 C26 40, 23 31, 29 26 C37 20, 46 28, 42 38 C37 49, 21 48, 16 37 C11 25, 22 12, 36 14"
      />
    </svg>
  );
}

export function Cuore({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <path
        {...base}
        stroke="var(--sb-accent)"
        d="M32 52 C10 38, 12 18, 24 16 C30 15, 32 21, 32 24 C32 21, 34 15, 40 16 C52 18, 54 38, 32 52 Z"
      />
    </svg>
  );
}

export function Fulmine({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <path
        {...base}
        stroke="var(--sb-ink)"
        d="M36 6 L18 34 L30 35 L26 58 L46 27 L33 26 Z"
      />
    </svg>
  );
}

export const ILLUSTRATIONS = [Stella, Fiore, Spirale, Cuore, Fulmine];

export function randomIllustrationIndex() {
  return Math.floor(Math.random() * ILLUSTRATIONS.length);
}

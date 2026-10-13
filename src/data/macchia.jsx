import { useId } from "react";

// una sola macchia di colore per tutto il sito: barattoli della hero,
// selettore del tema, categoria attiva. Cambia la rotazione, non la forma
export const MACCHIA =
  "M20 4.5C25.5 3 30.5 6.5 31.5 11.5 35.5 12 38 17 35.5 21.5 38.5 25.5 35.5 32.5 29.5 32.5 27.5 36.5 21.5 37.5 18.5 34 13.5 37 6.5 34.5 7.5 28.5 3.5 26.5 2.5 19.5 7 16.5 5 10.5 10.5 5.5 15.5 7.5 17 5.5 18.5 4.8 20 4.5Z" +
  "M35.6 5.2a2 2 0 1 0 .01 0Z" +
  "M4.6 34.2a1.5 1.5 0 1 0 .01 0Z";

export function Macchia({ colore, bordo, riempimento, className = "", rotate = 0 }) {
  const id = useId();
  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden="true"
      className={className}
      style={{ rotate: `${rotate}deg` }}
    >
      {riempimento && (
        <defs>
          <clipPath id={id}>
            <path d={MACCHIA} />
          </clipPath>
        </defs>
      )}
      {riempimento ? (
        <g clipPath={`url(#${id})`}>{riempimento}</g>
      ) : (
        <path d={MACCHIA} fill={colore} />
      )}
      {bordo && (
        <path d={MACCHIA} fill="none" stroke={bordo} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
      )}
    </svg>
  );
}

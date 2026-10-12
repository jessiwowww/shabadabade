/*
  SEGNAPOSTO: disegni provvisori per negozio e commissioni, da
  sostituire con quelli di Sharon. Stessa regola delle illustrazioni:
  tratto in currentColor, viewBox ritagliato sul disegno.
*/
const tratto = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 3,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
};

export function Adesivi() {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" {...tratto}>
      <path d="M18 14h70l16 16v76H18z" />
      <path d="M88 14v16h16" />
      <circle cx="42" cy="44" r="14" />
      <path d="M72 38l5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2z" />
      <rect x="30" y="72" width="26" height="22" rx="8" />
      <path d="M68 84c4-8 16-8 20 0" />
    </svg>
  );
}

export function Poster() {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" {...tratto}>
      <path d="M26 12h68v96H26z" />
      <circle cx="60" cy="10" r="3" />
      <path d="M38 76l14-18 10 12 8-8 12 14z" />
      <circle cx="74" cy="38" r="8" />
      <path d="M38 94h44" />
    </svg>
  );
}

export function Cartolina() {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" {...tratto}>
      <path d="M8 28h104v68H8z" />
      <path d="M62 36v52" />
      <rect x="88" y="36" width="16" height="18" strokeDasharray="3 3" />
      <path d="M70 66h34M70 76h34M70 86h22" />
      <path d="M18 44c10 6 20-6 30 0M18 56c10 6 20-6 30 0" />
    </svg>
  );
}

export function Download() {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" {...tratto}>
      <path d="M28 10h46l20 20v80H28z" />
      <path d="M74 10v20h20" />
      <path d="M61 46v40M46 72l15 15 15-15" />
    </svg>
  );
}

export function Logo() {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" {...tratto}>
      <circle cx="60" cy="60" r="46" />
      <circle cx="60" cy="60" r="36" strokeDasharray="4 5" />
      <path d="M60 36l7 15 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z" />
    </svg>
  );
}

export function Matita() {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" {...tratto}>
      <path d="M84 14l22 22-60 60-28 6 6-28z" />
      <path d="M74 24l22 22M24 74l22 22" />
      <path d="M20 106c20-8 40 4 60-4" />
    </svg>
  );
}

export function Bottega() {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" {...tratto}>
      <path d="M14 40l10-24h72l10 24" />
      <path d="M14 40c0 8 12 8 15 0 3 8 15 8 16 0 2 8 14 8 15 0 2 8 14 8 15 0 2 8 14 8 16 0 3 8 15 8 15 0" />
      <path d="M20 50v56h80V50" />
      <path d="M48 106V74h24v32" />
      <path d="M30 64h12M78 64h12" />
    </svg>
  );
}

export function Busta() {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" {...tratto}>
      <path d="M10 30h100v66H10z" />
      <path d="M10 30l50 38 50-38" />
      <path d="M60 52c-6-8-18-2-12 8l12 10 12-10c6-10-6-16-12-8z" />
    </svg>
  );
}

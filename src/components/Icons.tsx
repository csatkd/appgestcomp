interface IconProps {
  className?: string;
}

const S = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/* Marque TKD365 : nœud de ceinture stylisé */
export function LogoMark({ className = "w-8 h-8" }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect x="1" y="1" width="38" height="38" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M6 10 L34 26 L30 32 L4 16 Z" fill="#e2472e" />
      <path d="M34 10 L6 26 L10 32 L36 16 Z" fill="#f0a41c" />
      <rect x="16" y="14" width="8" height="8" fill="#161009" stroke="#f4ead9" strokeWidth="1.4" />
    </svg>
  );
}

/* Losange kente pour les marquee */
export function Diamond({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path d="M8 0 L16 8 L8 16 L0 8 Z" fill="currentColor" />
      <path d="M8 4 L12 8 L8 12 L4 8 Z" fill="#161009" />
    </svg>
  );
}

export function ArrowRight({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden="true">
      <path d="M3 12h17M14 5.5 20.5 12 14 18.5" />
    </svg>
  );
}

export function IconPin({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden="true">
      <path d="M12 21s-6.5-5.6-6.5-10.4A6.5 6.5 0 0 1 12 4a6.5 6.5 0 0 1 6.5 6.6C18.5 15.4 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="2.3" />
    </svg>
  );
}

export function IconCal({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15.5" />
      <path d="M3.5 9.5h17M8 2.8V6.5M16 2.8V6.5M7.5 13.5h3M13.5 13.5h3M7.5 17h3" />
    </svg>
  );
}

export function IconClock({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5.2l3.4 2" />
    </svg>
  );
}

export function IconUsers({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden="true">
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3.5 19.5c.6-3.4 2.8-5.3 5.5-5.3s4.9 1.9 5.5 5.3M15.5 5.7a3.2 3.2 0 1 1 0 5.7M17.5 14.4c1.7.6 2.7 2.3 3 5.1" />
    </svg>
  );
}

/* ——— Icônes des 12 modules ——— */

export function IconQr({ className = "w-7 h-7" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden="true">
      <rect x="3.5" y="3.5" width="6.5" height="6.5" />
      <rect x="14" y="3.5" width="6.5" height="6.5" />
      <rect x="3.5" y="14" width="6.5" height="6.5" />
      <path d="M6.2 6.2h1.1v1.1H6.2zM16.7 6.2h1.1v1.1h-1.1zM6.2 16.7h1.1v1.1H6.2zM14 14h3v3M20.5 14v.01M17 20.5h3.5v-3.5M14 19v1.5" />
    </svg>
  );
}

export function IconBadge({ className = "w-7 h-7" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden="true">
      <rect x="4" y="6" width="16" height="14" />
      <path d="M9 6V4h6v2M7.5 10h4v4h-4zM14 10.5h3M14 13h3M7.5 16.8h9.5" />
    </svg>
  );
}

export function IconScale({ className = "w-7 h-7" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden="true">
      <path d="M4 20h16M6 20v-2.5h12V20M12 17.5V14" />
      <path d="M5.5 14a6.5 6.5 0 0 1 13 0Z" />
      <path d="M12 14 15 9.5" />
    </svg>
  );
}

export function IconBracket({ className = "w-7 h-7" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden="true">
      <path d="M3.5 5h4v4h-4zM3.5 15h4v4h-4zM16.5 10h4v4h-4z" />
      <path d="M7.5 7h3v10h-3M10.5 12h6" />
    </svg>
  );
}

export function IconWhistle({ className = "w-7 h-7" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden="true">
      <path d="M13.5 9H21v3.4l-5.6 1.3a4.9 4.9 0 1 1-1.9-4.7Z" />
      <circle cx="10.4" cy="13.9" r="1.1" />
      <path d="M8.5 6.5 10 8M12.5 5v2M16.5 6.5 15 8" />
    </svg>
  );
}

export function IconBoard({ className = "w-7 h-7" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden="true">
      <rect x="3.5" y="4.5" width="17" height="12" />
      <path d="M12 4.5v12M6.5 8.5h2.5M15 8.5h2.5M6.5 12.5h1.5M16 12.5h1.5M9 20.5h6M12 16.5v4" />
    </svg>
  );
}

export function IconFlag({ className = "w-7 h-7" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden="true">
      <path d="M5.5 21V4" />
      <path d="M5.5 4.5c3-1.8 6-1.8 8.5 0s5.5 1.8 6.5.9V13c-1 .9-4 .9-6.5-.9s-5.5-1.8-8.5 0" />
    </svg>
  );
}

export function IconAntenna({ className = "w-7 h-7" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden="true">
      <circle cx="12" cy="10.5" r="1.6" />
      <path d="M12 12v8.5M8.5 20.5h7M8.2 6.7a5.4 5.4 0 0 0 0 7.6M15.8 6.7a5.4 5.4 0 0 1 0 7.6M5.6 4a9.2 9.2 0 0 0 0 13M18.4 4a9.2 9.2 0 0 1 0 13" />
    </svg>
  );
}

export function IconChart({ className = "w-7 h-7" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden="true">
      <path d="M3.5 3.5v17h17" />
      <path d="M7.5 16.5v-5M12 16.5V7M16.5 16.5v-7.5" />
      <path d="M6.5 8.5 11 5l3.5 2.5L19 4" />
    </svg>
  );
}

export function IconGlobe({ className = "w-7 h-7" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.5 2.4 3.7 5.3 3.7 8.5S14.5 18.1 12 20.5C9.5 18.1 8.3 15.2 8.3 12S9.5 5.9 12 3.5Z" />
    </svg>
  );
}

export function IconTv({ className = "w-7 h-7" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden="true">
      <rect x="3" y="5" width="18" height="12.5" />
      <path d="M8.5 21h7M12 17.5V21M7 14.5l4-4 2.5 2.5L17 9.5" />
    </svg>
  );
}

export function IconPlug({ className = "w-7 h-7" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden="true">
      <path d="M9 3.5V8M15 3.5V8M7 8h10v3a5 5 0 0 1-5 5 5 5 0 0 1-5-5Z" />
      <path d="M12 16v4.5" />
    </svg>
  );
}

export const MODULE_ICONS: Record<string, (p: IconProps) => React.ReactElement> = {
  qr: IconQr,
  badge: IconBadge,
  scale: IconScale,
  bracket: IconBracket,
  whistle: IconWhistle,
  board: IconBoard,
  flag: IconFlag,
  antenna: IconAntenna,
  chart: IconChart,
  globe: IconGlobe,
  tv: IconTv,
  plug: IconPlug,
};

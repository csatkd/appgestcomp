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

export function LogoMark({ className = "w-9 h-9" }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect x="1" y="1" width="38" height="38" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M6 10 L34 26 L30 32 L4 16 Z" fill="#e2472e" />
      <path d="M34 10 L6 26 L10 32 L36 16 Z" fill="#f0a41c" />
      <rect x="16" y="14" width="8" height="8" fill="#14100a" stroke="#f4ead9" strokeWidth="1.4" />
    </svg>
  );
}

export function IconGrid({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden="true">
      <rect x="3.5" y="3.5" width="7" height="7" />
      <rect x="13.5" y="3.5" width="7" height="7" />
      <rect x="3.5" y="13.5" width="7" height="7" />
      <rect x="13.5" y="13.5" width="7" height="7" />
    </svg>
  );
}

export function IconUsers({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden="true">
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3.5 19.5c.6-3.4 2.8-5.3 5.5-5.3s4.9 1.9 5.5 5.3M15.5 5.7a3.2 3.2 0 1 1 0 5.7M17.5 14.4c1.7.6 2.7 2.3 3 5.1" />
    </svg>
  );
}

export function IconScale({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden="true">
      <path d="M4 20h16M6 20v-2.5h12V20M12 17.5V14" />
      <path d="M5.5 14a6.5 6.5 0 0 1 13 0Z" />
      <path d="M12 14 15 9.5" />
    </svg>
  );
}

export function IconBracket({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden="true">
      <path d="M3.5 5h4v4h-4zM3.5 15h4v4h-4zM16.5 10h4v4h-4z" />
      <path d="M7.5 7h3v10h-3M10.5 12h6" />
    </svg>
  );
}

export function IconLive({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden="true">
      <circle cx="12" cy="10.5" r="1.6" />
      <path d="M12 12v8.5M8.2 6.7a5.4 5.4 0 0 0 0 7.6M15.8 6.7a5.4 5.4 0 0 1 0 7.6M5.6 4a9.2 9.2 0 0 0 0 13M18.4 4a9.2 9.2 0 0 1 0 13" />
    </svg>
  );
}

export function IconTrophy({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden="true">
      <path d="M7 4h10v5a5 5 0 0 1-10 0Z" />
      <path d="M7 5.5H4V7a3.5 3.5 0 0 0 3.2 3.5M17 5.5h3V7a3.5 3.5 0 0 1-3.2 3.5" />
      <path d="M12 14v3.5M8.5 20.5h7M10 17.5h4l.7 3h-5.4Z" />
    </svg>
  );
}

export function IconPlus({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S} strokeWidth={2.2} aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconSearch({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m15.5 15.5 5 5" />
    </svg>
  );
}

export function IconTrash({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden="true">
      <path d="M4.5 6.5h15M9.5 6V4.5h5V6M6.5 6.5 7.5 20h9l1-13.5M10 10v6.5M14 10v6.5" />
    </svg>
  );
}

export function IconUndo({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden="true">
      <path d="M8 5 3.5 9.5 8 14" />
      <path d="M3.5 9.5H15a5.5 5.5 0 1 1 0 11H9" />
    </svg>
  );
}

export function IconPlay({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M7 4.5v15l13-7.5Z" />
    </svg>
  );
}

export function IconPause({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <rect x="6" y="4.5" width="4" height="15" />
      <rect x="14" y="4.5" width="4" height="15" />
    </svg>
  );
}

export function IconFlag({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden="true">
      <path d="M5.5 21V4" />
      <path d="M5.5 4.5c3-1.8 6-1.8 8.5 0s5.5 1.8 6.5.9V13c-1 .9-4 .9-6.5-.9s-5.5-1.8-8.5 0" />
    </svg>
  );
}

export function IconCheck({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S} strokeWidth={2.2} aria-hidden="true">
      <path d="m4.5 12.5 5 5L19.5 7" />
    </svg>
  );
}

export function IconX({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S} strokeWidth={2.2} aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
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

export function IconAlert({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden="true">
      <path d="M12 3.5 2.5 20h19Z" />
      <path d="M12 9.5v5M12 17.2v.3" />
    </svg>
  );
}

export function IconChevron({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden="true">
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}

export function IconReset({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden="true">
      <path d="M4.5 5.5V10H9" />
      <path d="M4.8 10a8 8 0 1 1-.8 5" />
    </svg>
  );
}

export function IconLock({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden="true">
      <rect x="5" y="10.5" width="14" height="9.5" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5M12 14.5v2" />
    </svg>
  );
}

export function IconMedal({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden="true">
      <circle cx="12" cy="15" r="4.5" />
      <path d="M9.8 11.2 5.5 3.5h4.6L12 7l1.9-3.5h4.6l-4.3 7.7" />
    </svg>
  );
}

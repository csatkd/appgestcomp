/** Bande kente horizontale — motif signature du site. */
export function KenteBand({ className = "h-1.5" }: { className?: string }) {
  return <div className={`kente w-full ${className}`} aria-hidden="true" />;
}

/** Petite bande kente courte, utilisée comme tiret d'eyebrow. */
export function KenteTick({ className = "w-10 h-2" }: { className?: string }) {
  return <span className={`kente inline-block ${className}`} aria-hidden="true" />;
}

/** Bande verticale (colonne fine). */
export function KenteVert({ className = "w-1.5" }: { className?: string }) {
  return <div className={`kente-vert ${className}`} aria-hidden="true" />;
}

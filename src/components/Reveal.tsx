import { useInView } from "../hooks";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

/** Enveloppe qui révèle son contenu à l'entrée dans le viewport. */
export default function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const [ref, on] = useInView();
  return (
    <div
      ref={ref}
      className={`rv ${on ? "on" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/** Eyebrow éditorial : trait kente + libellé mono. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 font-mono text-[11px] sm:text-xs uppercase tracking-[0.28em] text-gold">
      <span className="kente inline-block h-2 w-10" aria-hidden="true" />
      {children}
    </p>
  );
}

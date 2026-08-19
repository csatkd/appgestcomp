import { LogoMark, IconPin, IconClock } from "./Icons";

const PLATFORM_LINKS = [
  { label: "Fonctionnalités", href: "#fonctionnalites" },
  { label: "Événements", href: "#evenements" },
  { label: "Modules intégrés", href: "#modules" },
  { label: "La plateforme", href: "#plateforme" },
  { label: "Digitaliser ma fédération", href: "#cta" },
];

const RESOURCE_LINKS = [
  { label: "Prochains événements", href: "https://tkd365.pro/events-publics", ext: true },
  { label: "Page Fédération", href: "https://tkd365.pro/federation-landing", ext: true },
  { label: "Accès plateforme", href: "https://tkd365.pro/sign-up-login-screen", ext: true },
  { label: "Kyorugi · Poomsae", href: "#evenements" },
  { label: "Passages de grade", href: "#evenements" },
];

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-husk bg-night">
      <div className="kente h-1.5 w-full" aria-hidden="true" />

      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <a href="#top" className="flex items-center gap-3" aria-label="TKD365 — haut de page">
            <LogoMark className="h-10 w-10 text-gold" />
            <span className="font-display text-2xl uppercase tracking-wide text-bone">
              TKD365 <span className="text-base text-gold">PRO</span>
            </span>
          </a>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-dune">
            La plateforme numérique de référence pour les fédérations, ligues et
            clubs de taekwondo — du niveau régional à l'international.
          </p>
          <div className="kente mt-7 h-1.5 w-28" aria-hidden="true" />
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-dune">
            Alger · Oran · Dakar · Abidjan · Nairobi
          </p>
        </div>

        <nav aria-label="Liens plateforme">
          <h4 className="font-mono text-xs uppercase tracking-[0.24em] text-gold">Plateforme</h4>
          <ul className="mt-5 space-y-3 text-sm">
            {PLATFORM_LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="text-dune transition-colors duration-300 hover:text-gold">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Ressources">
          <h4 className="font-mono text-xs uppercase tracking-[0.24em] text-gold">Ressources</h4>
          <ul className="mt-5 space-y-3 text-sm">
            {RESOURCE_LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  {...("ext" in l && l.ext ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="text-dune transition-colors duration-300 hover:text-gold"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h4 className="font-mono text-xs uppercase tracking-[0.24em] text-gold">Contact</h4>
          <ul className="mt-5 space-y-4 text-sm text-dune">
            <li className="flex items-start gap-3">
              <IconPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              Fédération Nationale de Taekwondo
              <br />
              Alger, Algérie
            </li>
            <li className="flex items-center gap-3">
              <IconClock className="h-4 w-4 shrink-0 text-gold" />
              Support 7j/7 pendant vos événements
            </li>
            <li>
              <a
                href="mailto:hello@tkd365.pro"
                className="font-mono text-[13px] text-bone underline decoration-gold/50 underline-offset-4 transition-colors hover:text-gold"
              >
                hello@tkd365.pro
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-husk">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-5 py-6 font-mono text-[11px] uppercase tracking-[0.16em] text-dune sm:flex-row sm:items-center sm:px-8">
          <p>© 2026 TKD365 pro — Tous droits réservés</p>
          <p className="text-gold/80">Kyorugi · Poomsae · Casse · Démonstration · Grade</p>
        </div>
      </div>
    </footer>
  );
}

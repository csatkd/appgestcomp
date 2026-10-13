import { LogoMark } from "../Icons";

export default function LandingFooter() {
  return (
    <footer className="relative bg-coal border-t border-husk">
      {/* Kente border */}
      <div className="kente h-1.5 w-full" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <LogoMark className="w-10 h-10 text-gold" />
              <div>
                <div className="font-display text-2xl uppercase tracking-wide text-bone">
                  Dojang
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-dune">
                  La Régie des Tatamis
                </div>
              </div>
            </div>
            <p className="text-sm text-dune leading-relaxed max-w-md">
              La plateforme professionnelle de gestion des compétitions de taekwondo.
              Développée pour la Fédération Ivoirienne de Taekwondo (FITKD).
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.24em] text-gold mb-4">
              Application
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#/" className="text-dune hover:text-gold transition-colors">
                  Tableau de bord
                </a>
              </li>
              <li>
                <a href="#/competitions" className="text-dune hover:text-gold transition-colors">
                  Compétitions
                </a>
              </li>
              <li>
                <a href="#/organizers" className="text-dune hover:text-gold transition-colors">
                  Organisateurs
                </a>
              </li>
              <li>
                <a href="#/live" className="text-dune hover:text-gold transition-colors">
                  Live Scoring
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.24em] text-gold mb-4">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-dune">
              <li>Fédération Ivoirienne de Taekwondo</li>
              <li>Abidjan, Côte d'Ivoire</li>
              <li>
                <a href="mailto:contact@fitkd.ci" className="hover:text-gold transition-colors">
                  contact@fitkd.ci
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-husk flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-xs uppercase tracking-wider text-dune">
            © 2026 DOJANG · FITKD Côte d'Ivoire
          </p>
          <p className="font-mono text-xs uppercase tracking-wider text-gold">
            Kyorugi · Poomsae · Casse · Démonstration
          </p>
        </div>
      </div>
    </footer>
  );
}

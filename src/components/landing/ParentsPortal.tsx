import { useScrollReveal } from "../../hooks/useScrollReveal";
import { Link } from "react-router-dom";
import { IconUsers, IconLock, IconTrophy } from "../Icons";

export default function ParentsPortal() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="relative py-24 bg-coal">
      <div className="absolute inset-0 mud-bg opacity-20" />
      
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <div
          ref={ref}
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-gold/30 bg-gold/5 mb-6">
              <span className="font-mono text-xs uppercase tracking-wider text-gold">
                Espace Parents
              </span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-wide text-bone mb-6">
              Suivez la progression
              <span className="block text-gold mt-2">de votre enfant</span>
            </h2>
            <p className="text-lg text-dune max-w-2xl mx-auto">
              Connectez-vous avec le numéro de licence de votre enfant pour accéder à son espace personnel et suivre ses performances en temps réel.
            </p>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="panel p-6">
              <div className="w-12 h-12 border border-gold bg-gold/10 flex items-center justify-center mb-4">
                <IconUsers className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-display text-xl uppercase tracking-wide text-bone mb-3">
                Profil Complet
              </h3>
              <p className="text-sm text-dune leading-relaxed">
                Consultez les informations personnelles, la catégorie de poids, le club et le statut de votre enfant.
              </p>
            </div>

            <div className="panel p-6">
              <div className="w-12 h-12 border border-forest bg-forest/10 flex items-center justify-center mb-4">
                <IconTrophy className="w-6 h-6 text-forest" />
              </div>
              <h3 className="font-display text-xl uppercase tracking-wide text-bone mb-3">
                Historique des Matchs
              </h3>
              <p className="text-sm text-dune leading-relaxed">
                Suivez les victoires, défaites et scores de tous les matchs de votre enfant.
              </p>
            </div>

            <div className="panel p-6">
              <div className="w-12 h-12 border border-chong bg-chong/10 flex items-center justify-center mb-4">
                <IconLock className="w-6 h-6 text-chong" />
              </div>
              <h3 className="font-display text-xl uppercase tracking-wide text-bone mb-3">
                Connexion Simple
              </h3>
              <p className="text-sm text-dune leading-relaxed">
                Utilisez simplement le numéro de licence de votre enfant comme identifiant et mot de passe.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              to="/parents/login"
              className="btn btn-primary text-base px-8 py-4"
            >
              Accéder à l'Espace Parents
            </Link>
            <p className="mt-4 text-sm text-dune">
              Vous aurez besoin du numéro de licence de votre enfant
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

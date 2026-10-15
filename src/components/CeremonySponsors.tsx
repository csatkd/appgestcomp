import { useState, useEffect } from "react";
import { useApp } from "../lib/store";

/**
 * Composant d'affichage automatique des sponsors pour les cérémonies
 * Affiche les logos en boucle avec animations fluides
 */
export default function CeremonySponsors() {
  const { state } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Filtrer les sponsors actifs avec logo
  const activeSponsors = state.sponsors.filter((s) => {
    return s.status === "actif" && s.logo && s.visibility?.includes("tv");
  });

  // Tri par niveau (Or > Argent > Bronze)
  const sortedSponsors = [...activeSponsors].sort((a, b) => {
    const levelOrder = { or: 0, argent: 1, bronze: 2 };
    return levelOrder[a.level] - levelOrder[b.level];
  });

  // Auto-rotation toutes les 4 secondes
  useEffect(() => {
    if (sortedSponsors.length === 0) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % sortedSponsors.length);
        setIsTransitioning(false);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, [sortedSponsors.length]);

  if (sortedSponsors.length === 0) {
    return null;
  }

  const currentSponsor = sortedSponsors[currentIndex];

  const getLevelGradient = (level: string) => {
    switch (level) {
      case "or":
        return "from-yellow-600/20 via-yellow-500/10 to-transparent";
      case "argent":
        return "from-gray-400/20 via-gray-300/10 to-transparent";
      case "bronze":
        return "from-orange-600/20 via-orange-500/10 to-transparent";
      default:
        return "from-gold/20 via-gold/10 to-transparent";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "or":
        return "text-yellow-400";
      case "argent":
        return "text-gray-300";
      case "bronze":
        return "text-orange-400";
      default:
        return "text-gold";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-night overflow-hidden">
      {/* Fond avec gradient dynamique */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getLevelGradient(currentSponsor.level)} transition-all duration-1000`} />
      
      {/* Bandes kente décoratives */}
      <div className="kente absolute top-0 left-0 right-0 h-3" />
      <div className="kente absolute bottom-0 left-0 right-0 h-3" />

      {/* Contenu principal */}
      <div className="relative z-10 flex flex-col items-center justify-center px-8 w-full max-w-6xl">
        {/* En-tête de l'événement */}
        <div className="mb-12 text-center">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-gold mb-2">
            {state.event.name}
          </p>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-dune">
            Remerciements à nos sponsors
          </p>
        </div>

        {/* Logo du sponsor */}
        <div
          className={`mb-8 flex h-80 w-full max-w-3xl items-center justify-center transition-all duration-500 ${
            isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        >
          <img
            src={currentSponsor.logo}
            alt={currentSponsor.name}
            className="max-h-full max-w-full object-contain drop-shadow-2xl"
          />
        </div>

        {/* Nom du sponsor */}
        <h1
          className={`font-display text-6xl uppercase tracking-wide text-bone text-center mb-4 transition-all duration-500 ${
            isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          }`}
        >
          {currentSponsor.name}
        </h1>

        {/* Badge niveau */}
        <div
          className={`mb-6 transition-all duration-500 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          <span className={`font-mono text-lg uppercase tracking-[0.3em] ${getLevelColor(currentSponsor.level)}`}>
            {currentSponsor.level === "or" && "★ SPONSOR OR ★"}
            {currentSponsor.level === "argent" && "★ SPONSOR ARGENT ★"}
            {currentSponsor.level === "bronze" && "★ SPONSOR BRONZE ★"}
          </span>
        </div>

        {/* Description si disponible */}
        {currentSponsor.description && (
          <p
            className={`max-w-2xl text-center text-xl text-dune transition-all duration-500 ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          >
            {currentSponsor.description}
          </p>
        )}

        {/* Indicateurs de progression */}
        <div className="mt-12 flex gap-3">
          {sortedSponsors.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 transition-all duration-300 ${
                idx === currentIndex
                  ? "w-16 bg-gold"
                  : "w-4 bg-husk"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Footer avec informations de l'événement */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-dune">
          {state.event.date} · {state.event.venue}
        </p>
      </div>
    </div>
  );
}

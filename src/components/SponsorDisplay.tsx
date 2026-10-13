import { useState, useEffect } from "react";
import { useApp } from "../lib/store";
import type { SponsorLevel } from "../lib/types";

interface SponsorDisplayProps {
  fullscreen?: boolean;
}

export default function SponsorDisplay({ fullscreen = false }: SponsorDisplayProps) {
  const { state } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filterLevel, setFilterLevel] = useState<SponsorLevel | "all">("all");
  const [speed, setSpeed] = useState(5000); // ms entre chaque logo
  const [isPaused, setIsPaused] = useState(false);

  // Filtrer les sponsors actifs avec logo
  const activeSponsors = state.sponsors.filter((s) => {
    if (s.status !== "actif") return false;
    if (!s.logo) return false;
    if (filterLevel !== "all" && s.level !== filterLevel) return false;
    return true;
  });

  // Tri par niveau (Or > Argent > Bronze)
  const sortedSponsors = [...activeSponsors].sort((a, b) => {
    const levelOrder = { or: 0, argent: 1, bronze: 2 };
    return levelOrder[a.level] - levelOrder[b.level];
  });

  // Auto-rotation
  useEffect(() => {
    if (isPaused || sortedSponsors.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sortedSponsors.length);
    }, speed);

    return () => clearInterval(interval);
  }, [isPaused, speed, sortedSponsors.length]);

  if (sortedSponsors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="font-display text-2xl uppercase tracking-wide text-dune">
          Aucun sponsor actif avec logo
        </p>
        <p className="mt-2 text-sm text-dune">
          Ajoutez des sponsors avec des logos pour les afficher ici
        </p>
      </div>
    );
  }

  const currentSponsor = sortedSponsors[currentIndex];

  const getLevelColor = (level: SponsorLevel) => {
    switch (level) {
      case "or":
        return "text-yellow-400";
      case "argent":
        return "text-gray-300";
      case "bronze":
        return "text-orange-400";
    }
  };

  const getLevelLabel = (level: SponsorLevel) => {
    switch (level) {
      case "or":
        return "SPONSOR OR";
      case "argent":
        return "SPONSOR ARGENT";
      case "bronze":
        return "SPONSOR BRONZE";
    }
  };

  return (
    <div className={fullscreen ? "fixed inset-0 z-50 bg-night" : ""}>
      {/* Contrôles */}
      {!fullscreen && (
        <div className="mb-6 space-y-4">
          {/* Filtres par niveau */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilterLevel("all")}
              className={`cursor-pointer border px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-all ${
                filterLevel === "all"
                  ? "border-gold bg-gold font-semibold text-night"
                  : "border-husk text-dune hover:border-gold/60 hover:text-bone"
              }`}
            >
              Tous les niveaux
            </button>
            <button
              type="button"
              onClick={() => setFilterLevel("or")}
              className={`cursor-pointer border px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-all ${
                filterLevel === "or"
                  ? "border-yellow-400 bg-yellow-400 font-semibold text-night"
                  : "border-husk text-dune hover:border-yellow-400/60 hover:text-bone"
              }`}
            >
              Or
            </button>
            <button
              type="button"
              onClick={() => setFilterLevel("argent")}
              className={`cursor-pointer border px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-all ${
                filterLevel === "argent"
                  ? "border-gray-300 bg-gray-300 font-semibold text-night"
                  : "border-husk text-dune hover:border-gray-300/60 hover:text-bone"
              }`}
            >
              Argent
            </button>
            <button
              type="button"
              onClick={() => setFilterLevel("bronze")}
              className={`cursor-pointer border px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-all ${
                filterLevel === "bronze"
                  ? "border-orange-400 bg-orange-400 font-semibold text-night"
                  : "border-husk text-dune hover:border-orange-400/60 hover:text-bone"
              }`}
            >
              Bronze
            </button>
          </div>

          {/* Contrôle de vitesse */}
          <div className="flex items-center gap-4">
            <label className="font-mono text-xs uppercase tracking-wider text-dune">
              Vitesse :
            </label>
            <input
              type="range"
              min="2000"
              max="10000"
              step="500"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="flex-1"
            />
            <span className="font-mono text-sm text-bone">
              {speed / 1000}s
            </span>
          </div>

          {/* Bouton pause/play */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="btn btn-ghost"
            >
              {isPaused ? "▶ Reprendre" : "⏸ Pause"}
            </button>
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => (prev - 1 + sortedSponsors.length) % sortedSponsors.length)}
              className="btn btn-ghost"
            >
              ← Précédent
            </button>
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => (prev + 1) % sortedSponsors.length)}
              className="btn btn-ghost"
            >
              Suivant →
            </button>
          </div>
        </div>
      )}

      {/* Affichage principal */}
      <div className={`relative ${fullscreen ? "h-full" : "min-h-[600px]"} flex items-center justify-center`}>
        {/* Fond décoratif */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-bark/50 via-night to-bark/50" />
          <div className="kente absolute bottom-0 left-0 right-0 h-2" />
          <div className="kente absolute top-0 left-0 right-0 h-2" />
        </div>

        {/* Contenu */}
        <div className="relative z-10 flex flex-col items-center justify-center px-8">
          {/* Badge niveau */}
          <div className="mb-8">
            <span className={`font-mono text-sm uppercase tracking-[0.3em] ${getLevelColor(currentSponsor.level)}`}>
              {getLevelLabel(currentSponsor.level)}
            </span>
          </div>

          {/* Logo */}
          <div className="mb-8 flex h-64 w-full max-w-2xl items-center justify-center">
            <img
              key={currentSponsor.id}
              src={currentSponsor.logo}
              alt={currentSponsor.name}
              className="max-h-full max-w-full object-contain animate-fade-in"
              style={{
                animation: "fadeIn 0.5s ease-in",
              }}
            />
          </div>

          {/* Nom du sponsor */}
          <h2 className="font-display text-5xl uppercase tracking-wide text-bone text-center mb-4">
            {currentSponsor.name}
          </h2>

          {/* Description si disponible */}
          {currentSponsor.description && (
            <p className="max-w-2xl text-center text-lg text-dune">
              {currentSponsor.description}
            </p>
          )}

          {/* Indicateur de progression */}
          <div className="mt-12 flex gap-2">
            {sortedSponsors.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 transition-all duration-300 ${
                  idx === currentIndex
                    ? "w-12 bg-gold"
                    : "w-4 bg-husk"
                }`}
              />
            ))}
          </div>

          {/* Compteur */}
          <p className="mt-4 font-mono text-xs uppercase tracking-wider text-dune">
            {currentIndex + 1} / {sortedSponsors.length}
          </p>
        </div>
      </div>

      {/* Bouton plein écran */}
      {!fullscreen && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => {
              const elem = document.documentElement;
              if (elem.requestFullscreen) {
                elem.requestFullscreen();
              }
            }}
            className="btn btn-primary"
          >
            🖥️ Mode plein écran
          </button>
        </div>
      )}

      {/* Bouton quitter plein écran */}
      {fullscreen && (
        <button
          type="button"
          onClick={() => {
            if (document.exitFullscreen) {
              document.exitFullscreen();
            }
          }}
          className="fixed top-4 right-4 z-50 btn btn-ghost bg-night/80"
        >
          ✕ Quitter
        </button>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

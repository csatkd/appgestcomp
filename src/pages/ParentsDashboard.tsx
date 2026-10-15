import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../lib/store";
import { PageHead, StatusBadge } from "../components/ui";
import { IconUsers, IconScale, IconTrophy, IconLogout } from "../components/Icons";
import type { Athlete } from "../lib/types";
import PageBackground from "../components/PageBackground";
import { PAGE_BACKGROUNDS } from "../config/backgrounds";

export default function ParentsDashboard() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [athlete, setAthlete] = useState<Athlete | null>(null);

  useEffect(() => {
    const athleteId = localStorage.getItem("parent_athlete_id");
    if (!athleteId) {
      navigate("/parents/login");
      return;
    }

    const foundAthlete = state.athletes.find((a) => a.id === athleteId);
    if (!foundAthlete) {
      localStorage.removeItem("parent_athlete_id");
      navigate("/parents/login");
      return;
    }

    setAthlete(foundAthlete);
  }, [state.athletes, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("parent_athlete_id");
    navigate("/parents/login");
  };

  if (!athlete) {
    return (
      <div className="fade-up mx-auto max-w-4xl">
        <PageBackground imageUrl={PAGE_BACKGROUNDS.athletes} opacity={0.1} blur={4} />
        <div className="panel p-8 text-center">
          <p className="text-dune">Chargement...</p>
        </div>
      </div>
    );
  }

  // Récupérer les matchs de l'athlète
  const athleteMatches = Object.values(state.brackets)
    .flat()
    .filter((m) => m.a === athlete.id || m.b === athlete.id);

  const wonMatches = athleteMatches.filter(
    (m) => (m.a === athlete.id && m.winner === "a") || (m.b === athlete.id && m.winner === "b")
  );

  const lostMatches = athleteMatches.filter(
    (m) => (m.a === athlete.id && m.winner === "b") || (m.b === athlete.id && m.winner === "a")
  );

  // Calculer l'âge
  const currentYear = new Date().getFullYear();
  const age = currentYear - athlete.birthYear;

  return (
    <div className="fade-up mx-auto max-w-4xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.athletes} opacity={0.1} blur={4} />
      
      <PageHead
        title="Mon Espace Parent"
        subtitle={`Informations de ${athlete.firstName} ${athlete.lastName}`}
        actions={
          <button onClick={handleLogout} className="btn btn-ghost btn-sm">
            <IconLogout className="w-4 h-4" />
            Déconnexion
          </button>
        }
      />

      {/* Profil de l'athlète */}
      <div className="panel p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-24 h-24 border-2 border-gold bg-gold/10 flex items-center justify-center flex-shrink-0">
            <span className="font-display text-3xl text-gold">
              {athlete.firstName[0]}
              {athlete.lastName[0]}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-wide text-bone mb-2">
              {athlete.firstName} {athlete.lastName}
            </h2>
            <div className="flex flex-wrap gap-2 mb-3">
              <StatusBadge status={athlete.status} />
              <span className="badge text-gold">{athlete.license}</span>
            </div>
            <p className="text-sm text-dune">
              {athlete.gender === "M" ? "Homme" : "Femme"} · {age} ans · {athlete.club}
            </p>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="panel p-6">
          <div className="flex items-center gap-3 mb-2">
            <IconScale className="w-5 h-5 text-gold" />
            <span className="font-mono text-xs uppercase tracking-wider text-dune">
              Catégorie
            </span>
          </div>
          <p className="font-display text-2xl text-bone">
            {athlete.category || "Non définie"}
          </p>
          {athlete.weight && (
            <p className="text-sm text-dune mt-1">{athlete.weight} kg</p>
          )}
        </div>

        <div className="panel p-6">
          <div className="flex items-center gap-3 mb-2">
            <IconTrophy className="w-5 h-5 text-forest" />
            <span className="font-mono text-xs uppercase tracking-wider text-dune">
              Victoires
            </span>
          </div>
          <p className="font-display text-2xl text-forest">{wonMatches.length}</p>
          <p className="text-sm text-dune mt-1">matchs gagnés</p>
        </div>

        <div className="panel p-6">
          <div className="flex items-center gap-3 mb-2">
            <IconUsers className="w-5 h-5 text-dune" />
            <span className="font-mono text-xs uppercase tracking-wider text-dune">
              Matchs
            </span>
          </div>
          <p className="font-display text-2xl text-bone">{athleteMatches.length}</p>
          <p className="text-sm text-dune mt-1">
            {lostMatches.length} défaite{lostMatches.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Historique des matchs */}
      <div className="panel p-6 sm:p-8">
        <h3 className="font-display text-xl uppercase tracking-wide text-bone mb-6">
          Historique des Matchs
        </h3>

        {athleteMatches.length === 0 ? (
          <div className="text-center py-8">
            <IconTrophy className="w-12 h-12 text-dune/30 mx-auto mb-3" />
            <p className="text-dune">Aucun match enregistré pour le moment</p>
          </div>
        ) : (
          <div className="space-y-3">
            {athleteMatches.map((match) => {
              const isWinner =
                (match.a === athlete.id && match.winner === "a") ||
                (match.b === athlete.id && match.winner === "b");
              const opponentId = match.a === athlete.id ? match.b : match.a;
              const opponent = state.athletes.find((a) => a.id === opponentId);

              return (
                <div
                  key={match.id}
                  className={`border-l-4 p-4 ${
                    match.status === "termine"
                      ? isWinner
                        ? "border-forest bg-forest/5"
                        : "border-flame bg-flame/5"
                      : "border-gold bg-gold/5"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-dune">
                      {match.status === "termine"
                        ? isWinner
                          ? "✓ Victoire"
                          : "✗ Défaite"
                        : match.status === "encours"
                        ? "⚡ En cours"
                        : "⏳ À venir"}
                    </span>
                    {match.status === "termine" && (
                      <span className="font-mono text-sm text-bone">
                        {match.baseA + match.gamB} - {match.baseB + match.gamA}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-bone">
                    Adversaire :{" "}
                    <span className="font-semibold">
                      {opponent ? `${opponent.firstName} ${opponent.lastName}` : "Inconnu"}
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Informations de contact */}
      <div className="panel p-6 sm:p-8 mt-6">
        <h3 className="font-display text-xl uppercase tracking-wide text-bone mb-4">
          Informations du Club
        </h3>
        <div className="space-y-2 text-sm">
          <p className="text-dune">
            <span className="font-semibold text-bone">Club :</span> {athlete.club}
          </p>
          <p className="text-dune">
            <span className="font-semibold text-bone">Licence :</span> {athlete.license}
          </p>
          {athlete.weight && (
            <p className="text-dune">
              <span className="font-semibold text-bone">Dernière pesée :</span> {athlete.weight} kg
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

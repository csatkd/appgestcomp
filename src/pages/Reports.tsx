import { useMemo } from "react";
import { useApp } from "../lib/store";
import { PageHead } from "../components/ui";
import { IconChart, IconUsers, IconTrophy, IconCalendar } from "../components/Icons";
import PageBackground from "../components/PageBackground";
import { PAGE_BACKGROUNDS } from "../config/backgrounds";

export default function Reports() {
  const { state } = useApp();

  // Statistiques globales
  const stats = useMemo(() => {
    const totalAthletes = state.athletes.length;
    const weighedAthletes = state.athletes.filter((a) => a.status === "pesé").length;
    const forfeitAthletes = state.athletes.filter((a) => a.status === "forfait").length;

    const totalMatches = Object.values(state.brackets).flat().length;
    const completedMatches = Object.values(state.brackets)
      .flat()
      .filter((m) => m.status === "termine").length;
    const pendingMatches = Object.values(state.brackets)
      .flat()
      .filter((m) => m.status === "pret").length;

    const totalClubs = state.clubs.length;
    const totalReferees = state.referees.filter((r) => r.status === "actif").length;
    const totalCompetitions = state.competitions.length;
    const activeCompetitions = state.competitions.filter((c) => c.status === "active").length;

    const totalClaims = state.claims.length;
    const resolvedClaims = state.claims.filter((c) => c.status !== "soumise").length;

    return {
      athletes: { total: totalAthletes, weighed: weighedAthletes, forfeit: forfeitAthletes },
      matches: { total: totalMatches, completed: completedMatches, pending: pendingMatches },
      clubs: totalClubs,
      referees: totalReferees,
      competitions: { total: totalCompetitions, active: activeCompetitions },
      claims: { total: totalClaims, resolved: resolvedClaims },
    };
  }, [state]);

  // Statistiques par catégorie
  const categoryStats = useMemo(() => {
    return Object.entries(state.catStatus).map(([catId, status]) => {
      const athletes = state.athletes.filter((a) => a.category === catId);
      const matches = state.brackets[catId] || [];
      const completedMatches = matches.filter((m) => m.status === "termine").length;

      return {
        catId,
        status,
        athleteCount: athletes.length,
        matchCount: matches.length,
        completedMatches,
      };
    });
  }, [state]);

  // Statistiques par club
  const clubStats = useMemo(() => {
    return state.clubs.map((club) => {
      const athletes = state.athletes.filter((a) => a.club === club.name);
      const weighedAthletes = athletes.filter((a) => a.status === "pesé").length;

      return {
        name: club.name,
        totalAthletes: athletes.length,
        weighedAthletes,
      };
    }).sort((a, b) => b.totalAthletes - a.totalAthletes);
  }, [state]);

  // Taux de completion
  const completionRate = stats.matches.total > 0
    ? Math.round((stats.matches.completed / stats.matches.total) * 100)
    : 0;

  const weighInRate = stats.athletes.total > 0
    ? Math.round((stats.athletes.weighed / stats.athletes.total) * 100)
    : 0;

  return (
    <div className="fade-up mx-auto max-w-6xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.results} opacity={0.08} blur={3} />
      <PageHead title="Rapports & Statistiques" subtitle="Analyse des données" />

      {/* KPIs principaux */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="panel p-5">
          <div className="flex items-center gap-2 mb-2">
            <IconUsers className="w-5 h-5 text-gold" />
            <span className="font-mono text-xs uppercase tracking-wider text-dune">
              Athlètes
            </span>
          </div>
          <p className="font-display text-3xl text-bone">{stats.athletes.total}</p>
          <p className="text-xs text-dune mt-1">
            {stats.athletes.weighed} pesés · {stats.athletes.forfeit} forfaits
          </p>
        </div>

        <div className="panel p-5">
          <div className="flex items-center gap-2 mb-2">
            <IconTrophy className="w-5 h-5 text-forest" />
            <span className="font-mono text-xs uppercase tracking-wider text-dune">
              Matchs
            </span>
          </div>
          <p className="font-display text-3xl text-bone">{stats.matches.total}</p>
          <p className="text-xs text-dune mt-1">
            {stats.matches.completed} terminés · {stats.matches.pending} prêts
          </p>
        </div>

        <div className="panel p-5">
          <div className="flex items-center gap-2 mb-2">
            <IconCalendar className="w-5 h-5 text-chong" />
            <span className="font-mono text-xs uppercase tracking-wider text-dune">
              Compétitions
            </span>
          </div>
          <p className="font-display text-3xl text-bone">{stats.competitions.total}</p>
          <p className="text-xs text-dune mt-1">
            {stats.competitions.active} active(s)
          </p>
        </div>

        <div className="panel p-5">
          <div className="flex items-center gap-2 mb-2">
            <IconChart className="w-5 h-5 text-flame" />
            <span className="font-mono text-xs uppercase tracking-wider text-dune">
              Progression
            </span>
          </div>
          <p className="font-display text-3xl text-bone">{completionRate}%</p>
          <p className="text-xs text-dune mt-1">
            Matchs terminés
          </p>
        </div>
      </div>

      {/* Barres de progression */}
      <div className="panel p-6 mb-6">
        <h3 className="font-display text-lg uppercase tracking-wide text-bone mb-4">
          Taux de progression
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-dune">Pesées</span>
              <span className="text-sm font-semibold text-bone">{weighInRate}%</span>
            </div>
            <div className="h-2 bg-husk rounded-full overflow-hidden">
              <div
                className="h-full bg-gold transition-all duration-500"
                style={{ width: `${weighInRate}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-dune">Matchs terminés</span>
              <span className="text-sm font-semibold text-bone">{completionRate}%</span>
            </div>
            <div className="h-2 bg-husk rounded-full overflow-hidden">
              <div
                className="h-full bg-forest transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-dune">Réclamations résolues</span>
              <span className="text-sm font-semibold text-bone">
                {stats.claims.total > 0
                  ? Math.round((stats.claims.resolved / stats.claims.total) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="h-2 bg-husk rounded-full overflow-hidden">
              <div
                className="h-full bg-chong transition-all duration-500"
                style={{
                  width: `${
                    stats.claims.total > 0
                      ? (stats.claims.resolved / stats.claims.total) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques par catégorie */}
      <div className="panel p-6 mb-6">
        <h3 className="font-display text-lg uppercase tracking-wide text-bone mb-4">
          Statistiques par catégorie
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-husk">
                <th className="text-left py-3 px-2 font-mono text-xs uppercase tracking-wider text-dune">
                  Catégorie
                </th>
                <th className="text-center py-3 px-2 font-mono text-xs uppercase tracking-wider text-dune">
                  Athlètes
                </th>
                <th className="text-center py-3 px-2 font-mono text-xs uppercase tracking-wider text-dune">
                  Matchs
                </th>
                <th className="text-center py-3 px-2 font-mono text-xs uppercase tracking-wider text-dune">
                  Terminés
                </th>
                <th className="text-center py-3 px-2 font-mono text-xs uppercase tracking-wider text-dune">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody>
              {categoryStats.map((cat) => (
                <tr key={cat.catId} className="border-b border-husk/50 hover:bg-bark/50">
                  <td className="py-3 px-2 text-sm font-semibold text-bone">{cat.catId}</td>
                  <td className="py-3 px-2 text-sm text-center text-dune">{cat.athleteCount}</td>
                  <td className="py-3 px-2 text-sm text-center text-dune">{cat.matchCount}</td>
                  <td className="py-3 px-2 text-sm text-center text-dune">{cat.completedMatches}</td>
                  <td className="py-3 px-2 text-center">
                    <span
                      className={`badge ${
                        cat.status === "terminée"
                          ? "text-forest"
                          : cat.status === "tirée"
                          ? "text-gold"
                          : "text-dune"
                      }`}
                    >
                      {cat.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistiques par club */}
      <div className="panel p-6">
        <h3 className="font-display text-lg uppercase tracking-wide text-bone mb-4">
          Statistiques par club
        </h3>
        <div className="space-y-3">
          {clubStats.slice(0, 10).map((club, idx) => {
            const percentage =
              club.totalAthletes > 0
                ? Math.round((club.weighedAthletes / club.totalAthletes) * 100)
                : 0;

            return (
              <div key={club.name} className="border-l-4 border-gold bg-bark/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-display text-xl text-gold">#{idx + 1}</span>
                    <div>
                      <h4 className="font-semibold text-bone">{club.name}</h4>
                      <p className="text-xs text-dune">
                        {club.weighedAthletes} / {club.totalAthletes} athlètes pesés
                      </p>
                    </div>
                  </div>
                  <span className="font-display text-2xl text-bone">{percentage}%</span>
                </div>
                <div className="h-1.5 bg-husk rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { useApp } from '../lib/store';
import { useMemo } from 'react';
import { IconTrophy, IconMedal, IconUsers } from '../components/Icons';

export default function PublicResults() {
  const { state } = useApp();

  const results = useMemo(() => {
    return Object.entries(state.results).map(([catId, result]) => {
      const goldAthlete = state.athletes.find(a => a.id === result.gold);
      const silverAthlete = state.athletes.find(a => a.id === result.silver);
      const bronzeAthletes = result.bronzes
        .map(id => state.athletes.find(a => a.id === id))
        .filter(Boolean);

      return {
        categoryId: catId,
        gold: goldAthlete,
        silver: silverAthlete,
        bronzes: bronzeAthletes
      };
    });
  }, [state]);

  const clubRankings = useMemo(() => {
    const stats = new Map<string, { gold: number; silver: number; bronze: number; points: number }>();

    results.forEach(result => {
      // Or
      if (result.gold) {
        const club = result.gold.club;
        const current = stats.get(club) || { gold: 0, silver: 0, bronze: 0, points: 0 };
        current.gold++;
        current.points += 7;
        stats.set(club, current);
      }

      // Argent
      if (result.silver) {
        const club = result.silver.club;
        const current = stats.get(club) || { gold: 0, silver: 0, bronze: 0, points: 0 };
        current.silver++;
        current.points += 5;
        stats.set(club, current);
      }

      // Bronze
      result.bronzes.forEach(athlete => {
        if (athlete) {
          const club = athlete.club;
          const current = stats.get(club) || { gold: 0, silver: 0, bronze: 0, points: 0 };
          current.bronze++;
          current.points += 3;
          stats.set(club, current);
        }
      });
    });

    return Array.from(stats.entries())
      .map(([club, stats]) => ({ club, ...stats }))
      .sort((a, b) => b.points - a.points);
  }, [results]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-night via-coal to-night">
      {/* Header */}
      <div className="bg-gradient-to-r from-gold via-flame to-forest p-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-display text-5xl text-night mb-2">
            {state.event.name}
          </h1>
          <p className="text-xl text-night/80">
            {state.event.venue} • {state.event.date}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Résultats par catégorie */}
        <section className="mb-16">
          <h2 className="font-display text-4xl text-bone mb-8 flex items-center gap-3">
            <IconTrophy className="w-10 h-10 text-gold" />
            Résultats par Catégorie
          </h2>

          {results.length === 0 ? (
            <div className="panel p-12 text-center">
              <IconTrophy className="w-24 h-24 text-dune/30 mx-auto mb-4" />
              <p className="text-xl text-dune">Aucun résultat disponible</p>
              <p className="text-sm text-dune mt-2">
                Les résultats seront affichés après les compétitions
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((result) => (
                <div key={result.categoryId} className="panel p-6">
                  <h3 className="font-display text-2xl text-gold mb-6 text-center">
                    {result.categoryId}
                  </h3>

                  {/* Podium */}
                  <div className="flex items-end justify-center gap-4 mb-6">
                    {/* Argent */}
                    {result.silver && (
                      <div className="text-center">
                        <div className="w-24 h-32 bg-gradient-to-t from-gray-300/20 to-transparent border-2 border-gray-300 rounded-t-lg flex flex-col items-center justify-end p-3 mb-2">
                          <IconMedal className="w-12 h-12 text-gray-300 mb-2" />
                          <div className="text-3xl font-display text-gray-300">2</div>
                        </div>
                        <p className="font-semibold text-bone text-sm">
                          {result.silver.firstName} {result.silver.lastName}
                        </p>
                        <p className="text-xs text-dune">{result.silver.club}</p>
                      </div>
                    )}

                    {/* Or */}
                    {result.gold && (
                      <div className="text-center">
                        <div className="w-28 h-40 bg-gradient-to-t from-gold/20 to-transparent border-2 border-gold rounded-t-lg flex flex-col items-center justify-end p-3 mb-2">
                          <IconTrophy className="w-16 h-16 text-gold mb-2" />
                          <div className="text-4xl font-display text-gold">1</div>
                        </div>
                        <p className="font-semibold text-bone">
                          {result.gold.firstName} {result.gold.lastName}
                        </p>
                        <p className="text-xs text-dune">{result.gold.club}</p>
                      </div>
                    )}

                    {/* Bronze */}
                    {result.bronzes[0] && (
                      <div className="text-center">
                        <div className="w-24 h-24 bg-gradient-to-t from-orange-400/20 to-transparent border-2 border-orange-400 rounded-t-lg flex flex-col items-center justify-end p-3 mb-2">
                          <IconMedal className="w-12 h-12 text-orange-400 mb-2" />
                          <div className="text-3xl font-display text-orange-400">3</div>
                        </div>
                        <p className="font-semibold text-bone text-sm">
                          {result.bronzes[0].firstName} {result.bronzes[0].lastName}
                        </p>
                        <p className="text-xs text-dune">{result.bronzes[0].club}</p>
                      </div>
                    )}
                  </div>

                  {/* Deuxième bronze si présent */}
                  {result.bronzes[1] && (
                    <div className="text-center mt-4 pt-4 border-t border-husk">
                      <p className="text-xs text-dune mb-2">Médaille de Bronze</p>
                      <p className="font-semibold text-bone">
                        {result.bronzes[1].firstName} {result.bronzes[1].lastName}
                      </p>
                      <p className="text-xs text-dune">{result.bronzes[1].club}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Classement des clubs */}
        <section className="mb-16">
          <h2 className="font-display text-4xl text-bone mb-8 flex items-center gap-3">
            <IconUsers className="w-10 h-10 text-forest" />
            Classement des Clubs
          </h2>

          {clubRankings.length === 0 ? (
            <div className="panel p-12 text-center">
              <IconUsers className="w-24 h-24 text-dune/30 mx-auto mb-4" />
              <p className="text-xl text-dune">Aucun classement disponible</p>
            </div>
          ) : (
            <div className="panel p-6">
              <div className="space-y-3">
                {clubRankings.map((club, index) => (
                  <div
                    key={club.club}
                    className={`flex items-center gap-4 p-4 rounded-lg ${
                      index === 0 ? 'bg-gold/10 border-2 border-gold' :
                      index === 1 ? 'bg-gray-300/10 border-2 border-gray-300' :
                      index === 2 ? 'bg-orange-400/10 border-2 border-orange-400' :
                      'bg-bark/50 border border-husk'
                    }`}
                  >
                    <div className={`font-display text-3xl w-12 text-center ${
                      index === 0 ? 'text-gold' :
                      index === 1 ? 'text-gray-300' :
                      index === 2 ? 'text-orange-400' :
                      'text-dune'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-bone text-lg">{club.club}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gold">
                          🥇 {club.gold}
                        </span>
                        <span className="text-sm text-gray-300">
                          🥈 {club.silver}
                        </span>
                        <span className="text-sm text-orange-400">
                          🥉 {club.bronze}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-3xl text-bone">{club.points}</p>
                      <p className="text-xs text-dune">points</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Statistiques de l'événement */}
        <section>
          <h2 className="font-display text-4xl text-bone mb-8">
            Statistiques de l'Événement
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="panel p-6 text-center">
              <IconUsers className="w-12 h-12 text-gold mx-auto mb-3" />
              <p className="font-display text-4xl text-bone mb-1">
                {state.athletes.length}
              </p>
              <p className="text-sm text-dune">Athlètes</p>
            </div>
            <div className="panel p-6 text-center">
              <IconTrophy className="w-12 h-12 text-forest mx-auto mb-3" />
              <p className="font-display text-4xl text-bone mb-1">
                {results.length}
              </p>
              <p className="text-sm text-dune">Catégories</p>
            </div>
            <div className="panel p-6 text-center">
              <IconUsers className="w-12 h-12 text-chong mx-auto mb-3" />
              <p className="font-display text-4xl text-bone mb-1">
                {state.clubs.length}
              </p>
              <p className="text-sm text-dune">Clubs</p>
            </div>
            <div className="panel p-6 text-center">
              <IconMedal className="w-12 h-12 text-flame mx-auto mb-3" />
              <p className="font-display text-4xl text-bone mb-1">
                {results.length * 4}
              </p>
              <p className="text-sm text-dune">Médailles</p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-husk py-8 mt-16">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-dune mb-2">
            {state.event.name} • {state.event.venue}
          </p>
          <p className="text-sm text-dune/60">
            Propulsé par DOJANG - La Régie Numérique des Tatamis
          </p>
          <p className="text-xs text-dune/40 mt-2">
            © 2026 FITKD Côte d'Ivoire
          </p>
        </div>
      </footer>
    </div>
  );
}

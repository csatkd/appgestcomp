import { useMemo } from 'react';
import { useApp } from '../lib/store';
import { PageHead } from './ui';
import PageBackground from './PageBackground';
import { PAGE_BACKGROUNDS } from '../config/backgrounds';
import { IconTrophy, IconTrendUp, IconTrendDown } from './Icons';

interface AthleteRanking {
  athleteId: string;
  name: string;
  club: string;
  category: string;
  rating: number;
  matches: number;
  wins: number;
  losses: number;
  winRate: number;
  trend: 'up' | 'down' | 'stable';
}

export default function AthleteRanking() {
  const { state } = useApp();

  // Calculer le ranking ELO des athlètes
  const rankings = useMemo(() => {
    const athleteStats = new Map<string, {
      matches: number;
      wins: number;
      losses: number;
      rating: number;
      recentResults: boolean[]; // true = win, false = loss
    }>();

    // Initialiser les stats pour tous les athlètes
    state.athletes.forEach(athlete => {
      athleteStats.set(athlete.id, {
        matches: 0,
        wins: 0,
        losses: 0,
        rating: 1000, // Rating initial ELO
        recentResults: []
      });
    });

    // Calculer les stats basées sur les matchs terminés
    Object.values(state.brackets).flat().forEach(match => {
      if (match.status === 'termine' && match.winner && match.a && match.b) {
        const winnerId = match.winner === 'a' ? match.a : match.b;
        const loserId = match.winner === 'a' ? match.b : match.a;

        const winnerStats = athleteStats.get(winnerId);
        const loserStats = athleteStats.get(loserId);

        if (winnerStats && loserStats) {
          // Calculer le changement de rating ELO
          const K = 32; // Facteur K pour ELO
          const expectedWinner = 1 / (1 + Math.pow(10, (loserStats.rating - winnerStats.rating) / 400));
          const expectedLoser = 1 / (1 + Math.pow(10, (winnerStats.rating - loserStats.rating) / 400));

          const winnerRatingChange = Math.round(K * (1 - expectedWinner));
          const loserRatingChange = Math.round(K * (0 - expectedLoser));

          // Mettre à jour les stats du gagnant
          winnerStats.matches++;
          winnerStats.wins++;
          winnerStats.rating += winnerRatingChange;
          winnerStats.recentResults.push(true);
          if (winnerStats.recentResults.length > 5) {
            winnerStats.recentResults.shift();
          }

          // Mettre à jour les stats du perdant
          loserStats.matches++;
          loserStats.losses++;
          loserStats.rating += loserRatingChange;
          loserStats.recentResults.push(false);
          if (loserStats.recentResults.length > 5) {
            loserStats.recentResults.shift();
          }
        }
      }
    });

    // Convertir en tableau et calculer les tendances
    const rankingArray: AthleteRanking[] = [];
    
    athleteStats.forEach((stats, athleteId) => {
      const athlete = state.athletes.find(a => a.id === athleteId);
      if (athlete && stats.matches > 0) {
        // Calculer la tendance
        let trend: 'up' | 'down' | 'stable' = 'stable';
        if (stats.recentResults.length >= 3) {
          const recentWins = stats.recentResults.slice(-3).filter(r => r).length;
          if (recentWins >= 2) trend = 'up';
          else if (recentWins <= 1) trend = 'down';
        }

        rankingArray.push({
          athleteId,
          name: `${athlete.firstName} ${athlete.lastName}`,
          club: athlete.club,
          category: athlete.category || 'N/A',
          rating: stats.rating,
          matches: stats.matches,
          wins: stats.wins,
          losses: stats.losses,
          winRate: (stats.wins / stats.matches) * 100,
          trend
        });
      }
    });

    // Trier par rating
    return rankingArray.sort((a, b) => b.rating - a.rating);
  }, [state]);

  // Statistiques globales
  const globalStats = useMemo(() => {
    if (rankings.length === 0) {
      return {
        avgRating: 0,
        totalMatches: 0,
        topCategory: 'N/A',
        mostWins: 'N/A'
      };
    }

    const avgRating = rankings.reduce((sum, r) => sum + r.rating, 0) / rankings.length;
    const totalMatches = rankings.reduce((sum, r) => sum + r.matches, 0);
    
    // Catégorie la plus représentée
    const categoryCount = rankings.reduce((acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    
    // Athlète avec le plus de victoires
    const mostWins = rankings.reduce((max, r) => r.wins > max.wins ? r : max, rankings[0]);

    return {
      avgRating: Math.round(avgRating),
      totalMatches: totalMatches / 2, // Divisé par 2 car chaque match compte pour 2 athlètes
      topCategory,
      mostWins: mostWins.name
    };
  }, [rankings]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <IconTrendUp className="w-4 h-4 text-forest" />;
      case 'down': return <IconTrendDown className="w-4 h-4 text-flame" />;
      default: return <span className="w-4 h-4 text-dune">—</span>;
    }
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-gold';
    if (rank === 2) return 'text-gray-300';
    if (rank === 3) return 'text-orange-400';
    return 'text-dune';
  };

  return (
    <div className="fade-up mx-auto max-w-7xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.results} opacity={0.08} blur={3} />
      <PageHead title="Classement des Athlètes" subtitle="Système de ranking ELO" />

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="panel p-6">
          <div className="text-3xl font-display text-gold mb-2">{globalStats.avgRating}</div>
          <div className="text-sm text-dune">Rating moyen</div>
        </div>

        <div className="panel p-6">
          <div className="text-3xl font-display text-forest mb-2">{globalStats.totalMatches}</div>
          <div className="text-sm text-dune">Matchs disputés</div>
        </div>

        <div className="panel p-6">
          <div className="text-3xl font-display text-chong mb-2">{globalStats.topCategory}</div>
          <div className="text-sm text-dune">Catégorie top</div>
        </div>

        <div className="panel p-6">
          <div className="text-3xl font-display text-flame mb-2 truncate">{globalStats.mostWins}</div>
          <div className="text-sm text-dune">Plus de victoires</div>
        </div>
      </div>

      {/* Podium Top 3 */}
      {rankings.length >= 3 && (
        <div className="panel p-6 mb-8">
          <h3 className="font-display text-2xl text-bone mb-6 flex items-center gap-2">
            <IconTrophy className="w-6 h-6 text-gold" />
            Podium
          </h3>
          <div className="flex items-end justify-center gap-4">
            {/* 2ème place */}
            <div className="text-center">
              <div className="w-24 h-32 bg-gray-300/20 border-2 border-gray-300 rounded-t-lg flex items-center justify-center mb-2">
                <div>
                  <div className="text-4xl font-display text-gray-300">2</div>
                </div>
              </div>
              <div className="text-sm font-semibold text-bone">{rankings[1].name}</div>
              <div className="text-xs text-dune">{rankings[1].club}</div>
              <div className="text-lg font-bold text-gray-300">{rankings[1].rating}</div>
            </div>

            {/* 1ère place */}
            <div className="text-center">
              <div className="w-28 h-40 bg-gold/20 border-2 border-gold rounded-t-lg flex items-center justify-center mb-2">
                <div>
                  <div className="text-5xl font-display text-gold">1</div>
                </div>
              </div>
              <div className="text-sm font-semibold text-bone">{rankings[0].name}</div>
              <div className="text-xs text-dune">{rankings[0].club}</div>
              <div className="text-xl font-bold text-gold">{rankings[0].rating}</div>
            </div>

            {/* 3ème place */}
            <div className="text-center">
              <div className="w-24 h-24 bg-orange-400/20 border-2 border-orange-400 rounded-t-lg flex items-center justify-center mb-2">
                <div>
                  <div className="text-4xl font-display text-orange-400">3</div>
                </div>
              </div>
              <div className="text-sm font-semibold text-bone">{rankings[2].name}</div>
              <div className="text-xs text-dune">{rankings[2].club}</div>
              <div className="text-lg font-bold text-orange-400">{rankings[2].rating}</div>
            </div>
          </div>
        </div>
      )}

      {/* Tableau complet */}
      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-husk">
                <th className="text-left py-3 px-4 text-xs font-mono uppercase tracking-wider text-dune">
                  Rang
                </th>
                <th className="text-left py-3 px-4 text-xs font-mono uppercase tracking-wider text-dune">
                  Athlète
                </th>
                <th className="text-left py-3 px-4 text-xs font-mono uppercase tracking-wider text-dune">
                  Club
                </th>
                <th className="text-left py-3 px-4 text-xs font-mono uppercase tracking-wider text-dune">
                  Catégorie
                </th>
                <th className="text-center py-3 px-4 text-xs font-mono uppercase tracking-wider text-dune">
                  Rating
                </th>
                <th className="text-center py-3 px-4 text-xs font-mono uppercase tracking-wider text-dune">
                  Matchs
                </th>
                <th className="text-center py-3 px-4 text-xs font-mono uppercase tracking-wider text-dune">
                  V/D
                </th>
                <th className="text-center py-3 px-4 text-xs font-mono uppercase tracking-wider text-dune">
                  % Victoire
                </th>
                <th className="text-center py-3 px-4 text-xs font-mono uppercase tracking-wider text-dune">
                  Tendance
                </th>
              </tr>
            </thead>
            <tbody>
              {rankings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-dune">
                    Aucun classement disponible. Les athlètes apparaîtront ici après leurs premiers combats.
                  </td>
                </tr>
              ) : (
                rankings.map((ranking, index) => (
                  <tr key={ranking.athleteId} className="border-b border-husk/50 hover:bg-bark/50 transition-colors">
                    <td className="py-3 px-4">
                      <span className={`font-display text-xl ${getRankColor(index + 1)}`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-bone">{ranking.name}</span>
                    </td>
                    <td className="py-3 px-4 text-dune">{ranking.club}</td>
                    <td className="py-3 px-4">
                      <span className="badge text-gold">{ranking.category}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-display text-xl text-gold">{ranking.rating}</span>
                    </td>
                    <td className="py-3 px-4 text-center text-bone">{ranking.matches}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-forest">{ranking.wins}</span>
                      <span className="text-dune mx-1">/</span>
                      <span className="text-flame">{ranking.losses}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-semibold ${
                        ranking.winRate >= 60 ? 'text-forest' :
                        ranking.winRate >= 40 ? 'text-gold' : 'text-flame'
                      }`}>
                        {ranking.winRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {getTrendIcon(ranking.trend)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explication du système ELO */}
      <div className="panel p-6 mt-8">
        <h3 className="font-display text-xl text-bone mb-4">À propos du système ELO</h3>
        <div className="text-sm text-dune space-y-2">
          <p>
            Le système de ranking ELO est un système de classification relatif utilisé dans les jeux de compétition.
            Il a été adapté pour le taekwondo pour évaluer le niveau des athlètes.
          </p>
          <p>
            <strong className="text-bone">Comment ça fonctionne :</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Chaque athlète commence avec un rating de 1000 points</li>
            <li>Après chaque combat, le rating est ajusté en fonction du résultat</li>
            <li>Battre un adversaire avec un rating élevé rapporte plus de points</li>
            <li>Perdre contre un adversaire avec un rating faible fait perdre plus de points</li>
            <li>La tendance montre la performance sur les 3 derniers combats</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

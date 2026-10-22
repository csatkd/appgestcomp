import { useApp } from '../lib/store';
import { useMemo } from 'react';
import { PageHead } from './ui';
import PageBackground from './PageBackground';
import { PAGE_BACKGROUNDS } from '../config/backgrounds';
import { IconTrophy, IconMedal, IconAward } from './Icons';

interface ClubRanking {
  club: string;
  gold: number;
  silver: number;
  bronze: number;
  points: number;
  athletes: number;
  winRate: number;
}

export default function TeamRanking() {
  const { state } = useApp();

  const rankings = useMemo(() => {
    const clubStats = new Map<string, {
      gold: number;
      silver: number;
      bronze: number;
      points: number;
      athletes: Set<string>;
      totalMatches: number;
      wins: number;
    }>();

    // Initialiser les stats pour chaque club
    state.athletes.forEach(athlete => {
      if (!clubStats.has(athlete.club)) {
        clubStats.set(athlete.club, {
          gold: 0,
          silver: 0,
          bronze: 0,
          points: 0,
          athletes: new Set(),
          totalMatches: 0,
          wins: 0
        });
      }
      clubStats.get(athlete.club)!.athletes.add(athlete.id);
    });

    // Calculer les médailles et points
    Object.values(state.results).forEach(result => {
      // Or
      const goldAthlete = state.athletes.find(a => a.id === result.gold);
      if (goldAthlete) {
        const stats = clubStats.get(goldAthlete.club);
        if (stats) {
          stats.gold++;
          stats.points += 7; // 7 points pour l'or
          stats.wins++;
          stats.totalMatches++;
        }
      }

      // Argent
      const silverAthlete = state.athletes.find(a => a.id === result.silver);
      if (silverAthlete) {
        const stats = clubStats.get(silverAthlete.club);
        if (stats) {
          stats.silver++;
          stats.points += 5; // 5 points pour l'argent
          stats.totalMatches++;
        }
      }

      // Bronze
      result.bronzes.forEach(bronzeId => {
        const bronzeAthlete = state.athletes.find(a => a.id === bronzeId);
        if (bronzeAthlete) {
          const stats = clubStats.get(bronzeAthlete.club);
          if (stats) {
            stats.bronze++;
            stats.points += 3; // 3 points pour le bronze
            stats.totalMatches++;
          }
        }
      });
    });

    // Convertir en tableau et trier
    const rankings: ClubRanking[] = Array.from(clubStats.entries()).map(([club, stats]) => ({
      club,
      gold: stats.gold,
      silver: stats.silver,
      bronze: stats.bronze,
      points: stats.points,
      athletes: stats.athletes.size,
      winRate: stats.totalMatches > 0 ? Math.round((stats.wins / stats.totalMatches) * 100) : 0
    }));

    return rankings.sort((a, b) => {
      // Trier par points, puis par médailles d'or, puis d'argent, puis de bronze
      if (b.points !== a.points) return b.points - a.points;
      if (b.gold !== a.gold) return b.gold - a.gold;
      if (b.silver !== a.silver) return b.silver - a.silver;
      return b.bronze - a.bronze;
    });
  }, [state]);

  const topClub = rankings[0];
  const totalMedals = rankings.reduce((sum, r) => sum + r.gold + r.silver + r.bronze, 0);
  const totalPoints = rankings.reduce((sum, r) => sum + r.points, 0);

  const getMedalColor = (position: number) => {
    if (position === 0) return 'text-gold';
    if (position === 1) return 'text-gray-300';
    if (position === 2) return 'text-orange-400';
    return 'text-dune';
  };

  const getMedalBg = (position: number) => {
    if (position === 0) return 'bg-gold/10 border-gold';
    if (position === 1) return 'bg-gray-300/10 border-gray-300';
    if (position === 2) return 'bg-orange-400/10 border-orange-400';
    return 'bg-bark border-husk';
  };

  return (
    <div className="fade-up mx-auto max-w-7xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.results} opacity={0.08} blur={3} />
      <PageHead
        title="Classement par Club"
        subtitle="Performance et statistiques des clubs"
      />

      {/* Podium Top 3 */}
      {rankings.length >= 3 && (
        <div className="panel p-8 mb-8">
          <h3 className="font-display text-2xl text-bone mb-8 text-center">
            🏆 Podium des Clubs
          </h3>
          <div className="flex items-end justify-center gap-4 mb-8">
            {/* 2ème place */}
            <div className="text-center">
              <div className="w-32 h-40 bg-gradient-to-t from-gray-300/20 to-transparent border-2 border-gray-300 rounded-t-lg flex flex-col items-center justify-end p-4 mb-2">
                <div className="text-5xl font-display text-gray-300 mb-2">2</div>
                <IconMedal className="w-12 h-12 text-gray-300 mb-2" />
              </div>
              <p className="font-semibold text-bone text-sm mb-1">{rankings[1].club}</p>
              <p className="text-xs text-dune">{rankings[1].points} pts</p>
            </div>

            {/* 1ère place */}
            <div className="text-center">
              <div className="w-36 h-52 bg-gradient-to-t from-gold/20 to-transparent border-2 border-gold rounded-t-lg flex flex-col items-center justify-end p-4 mb-2">
                <div className="text-6xl font-display text-gold mb-2">1</div>
                <IconTrophy className="w-16 h-16 text-gold mb-2" />
              </div>
              <p className="font-semibold text-bone mb-1">{rankings[0].club}</p>
              <p className="text-xs text-dune">{rankings[0].points} pts</p>
            </div>

            {/* 3ème place */}
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-t from-orange-400/20 to-transparent border-2 border-orange-400 rounded-t-lg flex flex-col items-center justify-end p-4 mb-2">
                <div className="text-5xl font-display text-orange-400 mb-2">3</div>
                <IconMedal className="w-12 h-12 text-orange-400 mb-2" />
              </div>
              <p className="font-semibold text-bone text-sm mb-1">{rankings[2].club}</p>
              <p className="text-xs text-dune">{rankings[2].points} pts</p>
            </div>
          </div>
        </div>
      )}

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="panel p-6">
          <IconTrophy className="w-8 h-8 text-gold mb-3" />
          <p className="font-display text-3xl text-bone mb-1">{rankings.length}</p>
          <p className="text-sm text-dune">Clubs participants</p>
        </div>
        <div className="panel p-6">
          <IconMedal className="w-8 h-8 text-forest mb-3" />
          <p className="font-display text-3xl text-bone mb-1">{totalMedals}</p>
          <p className="text-sm text-dune">Médailles totales</p>
        </div>
        <div className="panel p-6">
          <IconAward className="w-8 h-8 text-chong mb-3" />
          <p className="font-display text-3xl text-bone mb-1">{totalPoints}</p>
          <p className="text-sm text-dune">Points totaux</p>
        </div>
        <div className="panel p-6">
          <IconTrophy className="w-8 h-8 text-flame mb-3" />
          <p className="font-display text-2xl text-bone mb-1 truncate">
            {topClub?.club || '-'}
          </p>
          <p className="text-sm text-dune">Meilleur club</p>
        </div>
      </div>

      {/* Tableau complet des classements */}
      <div className="panel p-6">
        <h3 className="font-display text-2xl text-bone mb-6">
          Classement Complet
        </h3>
        
        {rankings.length === 0 ? (
          <div className="text-center py-12">
            <IconTrophy className="w-16 h-16 text-dune/30 mx-auto mb-4" />
            <p className="text-dune">Aucun classement disponible</p>
            <p className="text-sm text-dune mt-2">
              Les classements apparaîtront après les compétitions
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-husk">
                  <th className="text-left py-3 px-2 font-mono text-xs uppercase tracking-wider text-dune">
                    Rang
                  </th>
                  <th className="text-left py-3 px-2 font-mono text-xs uppercase tracking-wider text-dune">
                    Club
                  </th>
                  <th className="text-center py-3 px-2 font-mono text-xs uppercase tracking-wider text-dune">
                    <span className="text-gold">🥇</span>
                  </th>
                  <th className="text-center py-3 px-2 font-mono text-xs uppercase tracking-wider text-dune">
                    <span className="text-gray-300">🥈</span>
                  </th>
                  <th className="text-center py-3 px-2 font-mono text-xs uppercase tracking-wider text-dune">
                    <span className="text-orange-400">🥉</span>
                  </th>
                  <th className="text-center py-3 px-2 font-mono text-xs uppercase tracking-wider text-dune">
                    Points
                  </th>
                  <th className="text-center py-3 px-2 font-mono text-xs uppercase tracking-wider text-dune">
                    Athlètes
                  </th>
                  <th className="text-center py-3 px-2 font-mono text-xs uppercase tracking-wider text-dune">
                    Taux V.
                  </th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((ranking, index) => (
                  <tr
                    key={ranking.club}
                    className={`border-b border-husk/50 hover:bg-bark/50 transition-colors ${
                      index < 3 ? getMedalBg(index) : ''
                    }`}
                  >
                    <td className="py-4 px-2">
                      <span className={`font-display text-2xl ${getMedalColor(index)}`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <span className="font-semibold text-bone">{ranking.club}</span>
                    </td>
                    <td className="py-4 px-2 text-center">
                      <span className="font-display text-xl text-gold">{ranking.gold}</span>
                    </td>
                    <td className="py-4 px-2 text-center">
                      <span className="font-display text-xl text-gray-300">{ranking.silver}</span>
                    </td>
                    <td className="py-4 px-2 text-center">
                      <span className="font-display text-xl text-orange-400">{ranking.bronze}</span>
                    </td>
                    <td className="py-4 px-2 text-center">
                      <span className="font-display text-2xl text-bone">{ranking.points}</span>
                    </td>
                    <td className="py-4 px-2 text-center">
                      <span className="text-bone">{ranking.athletes}</span>
                    </td>
                    <td className="py-4 px-2 text-center">
                      <span className={`font-semibold ${
                        ranking.winRate >= 60 ? 'text-forest' :
                        ranking.winRate >= 40 ? 'text-gold' :
                        'text-flame'
                      }`}>
                        {ranking.winRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Système de points */}
      <div className="panel p-6 mt-8">
        <h3 className="font-display text-xl text-bone mb-4">
          Système de Points
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-bark/50 border border-gold p-4 rounded-lg text-center">
            <IconTrophy className="w-12 h-12 text-gold mx-auto mb-2" />
            <p className="font-display text-3xl text-gold mb-1">7 pts</p>
            <p className="text-sm text-dune">Médaille d'Or</p>
          </div>
          <div className="bg-bark/50 border border-gray-300 p-4 rounded-lg text-center">
            <IconMedal className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="font-display text-3xl text-gray-300 mb-1">5 pts</p>
            <p className="text-sm text-dune">Médaille d'Argent</p>
          </div>
          <div className="bg-bark/50 border border-orange-400 p-4 rounded-lg text-center">
            <IconMedal className="w-12 h-12 text-orange-400 mx-auto mb-2" />
            <p className="font-display text-3xl text-orange-400 mb-1">3 pts</p>
            <p className="text-sm text-dune">Médaille de Bronze</p>
          </div>
        </div>
        <p className="text-sm text-dune mt-4 text-center">
          Les clubs sont classés par points totaux, puis par nombre de médailles d'or, d'argent et de bronze
        </p>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useApp } from '../lib/store';
import { PageHead } from './ui';
import PageBackground from './PageBackground';
import { PAGE_BACKGROUNDS } from '../config/backgrounds';
import { IconShare, IconTrophy, IconStar, IconUsers } from './Icons';

export default function SocialProfiles() {
  const { state } = useApp();
  const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null);

  const selectedAthlete = selectedAthleteId 
    ? state.athletes.find(a => a.id === selectedAthleteId)
    : null;

  // Calculer les statistiques de l'athlète
  const getAthleteStats = (athleteId: string) => {
    const matches = Object.values(state.brackets)
      .flat()
      .filter(m => m.a === athleteId || m.b === athleteId);

    const wins = matches.filter(m => 
      (m.a === athleteId && m.winner === 'a') || 
      (m.b === athleteId && m.winner === 'b')
    ).length;

    const losses = matches.filter(m => m.status === 'termine').length - wins;

    return {
      totalMatches: matches.length,
      wins,
      losses,
      winRate: matches.length > 0 ? (wins / matches.length) * 100 : 0,
    };
  };

  const handleShare = (athleteId: string) => {
    const athlete = state.athletes.find(a => a.id === athleteId);
    if (!athlete) return;

    const stats = getAthleteStats(athleteId);
    const shareText = `🥋 ${athlete.firstName} ${athlete.lastName}\n` +
                      `Club: ${athlete.club}\n` +
                      `Catégorie: ${athlete.category || 'N/A'}\n` +
                      `Matchs: ${stats.totalMatches}\n` +
                      `Victoires: ${stats.wins}\n` +
                      `Défaites: ${stats.losses}\n` +
                      `Taux de victoire: ${stats.winRate.toFixed(1)}%\n\n` +
                      `#DOJANG #Taekwondo #FITKD`;

    if (navigator.share) {
      navigator.share({
        title: `Profil de ${athlete.firstName} ${athlete.lastName}`,
        text: shareText,
      }).catch(() => {
        // Fallback: copier dans le presse-papiers
        navigator.clipboard.writeText(shareText);
      });
    } else {
      // Fallback: copier dans le presse-papiers
      navigator.clipboard.writeText(shareText);
    }
  };

  return (
    <div className="fade-up mx-auto max-w-7xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.athletes} opacity={0.08} blur={3} />
      <PageHead title="Profils Sociaux" subtitle="Partagez les performances des athlètes" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des athlètes */}
        <div className="lg:col-span-1">
          <div className="panel p-6">
            <h3 className="font-display text-xl text-bone mb-4 flex items-center gap-2">
              <IconUsers className="w-5 h-5 text-gold" />
              Athlètes
            </h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {state.athletes.map(athlete => {
                const stats = getAthleteStats(athlete.id);
                const isSelected = selectedAthleteId === athlete.id;

                return (
                  <button
                    key={athlete.id}
                    onClick={() => setSelectedAthleteId(athlete.id)}
                    className={`w-full p-4 border rounded-lg text-left transition-colors ${
                      isSelected
                        ? 'border-gold bg-gold/10'
                        : 'border-husk hover:border-gold/50'
                    }`}
                  >
                    <div className="font-semibold text-bone">
                      {athlete.firstName} {athlete.lastName}
                    </div>
                    <div className="text-sm text-dune">{athlete.club}</div>
                    <div className="flex items-center gap-2 mt-2 text-xs">
                      <span className="text-forest">{stats.wins}V</span>
                      <span className="text-dune">/</span>
                      <span className="text-flame">{stats.losses}D</span>
                      <span className="text-dune ml-auto">{stats.winRate.toFixed(0)}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Profil de l'athlète sélectionné */}
        <div className="lg:col-span-2">
          {selectedAthlete ? (
            <div className="panel p-6">
              {/* En-tête du profil */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold to-flame flex items-center justify-center text-3xl font-bold text-night">
                    {selectedAthlete.firstName[0]}{selectedAthlete.lastName[0]}
                  </div>
                  <div>
                    <h2 className="font-display text-3xl text-bone">
                      {selectedAthlete.firstName} {selectedAthlete.lastName}
                    </h2>
                    <p className="text-dune">{selectedAthlete.club}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="badge text-gold">{selectedAthlete.category || 'N/A'}</span>
                      <span className="badge text-forest">{selectedAthlete.status}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleShare(selectedAthlete.id)}
                  className="btn btn-ghost"
                  aria-label="Partager le profil"
                >
                  <IconShare className="w-5 h-5" />
                  Partager
                </button>
              </div>

              {/* Statistiques */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {(() => {
                  const stats = getAthleteStats(selectedAthlete.id);
                  return (
                    <>
                      <div className="bg-bark/50 border border-husk rounded-lg p-4 text-center">
                        <IconTrophy className="w-8 h-8 text-gold mx-auto mb-2" />
                        <div className="text-2xl font-display text-bone">{stats.totalMatches}</div>
                        <div className="text-xs text-dune">Matchs</div>
                      </div>
                      <div className="bg-bark/50 border border-husk rounded-lg p-4 text-center">
                        <IconStar className="w-8 h-8 text-forest mx-auto mb-2" />
                        <div className="text-2xl font-display text-bone">{stats.wins}</div>
                        <div className="text-xs text-dune">Victoires</div>
                      </div>
                      <div className="bg-bark/50 border border-husk rounded-lg p-4 text-center">
                        <div className="text-2xl font-display text-bone">{stats.losses}</div>
                        <div className="text-xs text-dune">Défaites</div>
                      </div>
                      <div className="bg-bark/50 border border-husk rounded-lg p-4 text-center">
                        <div className="text-2xl font-display text-gold">
                          {stats.winRate.toFixed(1)}%
                        </div>
                        <div className="text-xs text-dune">Taux de victoire</div>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Informations détaillées */}
              <div className="space-y-4">
                <div className="bg-bark/50 border border-husk rounded-lg p-4">
                  <h3 className="font-semibold text-bone mb-3">Informations</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-dune">Licence:</span>
                      <div className="text-bone font-mono">{selectedAthlete.license}</div>
                    </div>
                    <div>
                      <span className="text-dune">Année de naissance:</span>
                      <div className="text-bone">{selectedAthlete.birthYear}</div>
                    </div>
                    <div>
                      <span className="text-dune">Genre:</span>
                      <div className="text-bone">
                        {selectedAthlete.gender === 'M' ? 'Homme' : 'Femme'}
                      </div>
                    </div>
                    {selectedAthlete.weight && (
                      <div>
                        <span className="text-dune">Poids:</span>
                        <div className="text-bone">{selectedAthlete.weight} kg</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Historique des matchs récents */}
                <div className="bg-bark/50 border border-husk rounded-lg p-4">
                  <h3 className="font-semibold text-bone mb-3">Matchs récents</h3>
                  {(() => {
                    const matches = Object.values(state.brackets)
                      .flat()
                      .filter(m => 
                        (m.a === selectedAthlete.id || m.b === selectedAthlete.id) &&
                        m.status === 'termine'
                      )
                      .slice(-5)
                      .reverse();

                    if (matches.length === 0) {
                      return <p className="text-dune text-sm">Aucun match terminé</p>;
                    }

                    return (
                      <div className="space-y-2">
                        {matches.map(match => {
                          const isWin = (match.a === selectedAthlete.id && match.winner === 'a') ||
                                       (match.b === selectedAthlete.id && match.winner === 'b');
                          const opponentId = match.a === selectedAthlete.id ? match.b : match.a;
                          const opponent = state.athletes.find(a => a.id === opponentId);

                          return (
                            <div
                              key={match.id}
                              className={`flex items-center justify-between p-3 rounded border ${
                                isWin ? 'border-forest/30 bg-forest/5' : 'border-flame/30 bg-flame/5'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className={`text-2xl ${isWin ? 'text-forest' : 'text-flame'}`}>
                                  {isWin ? '✓' : '✗'}
                                </span>
                                <div>
                                  <div className="text-sm text-bone">
                                    {isWin ? 'Victoire' : 'Défaite'} contre{' '}
                                    <span className="font-semibold">
                                      {opponent ? `${opponent.firstName} ${opponent.lastName}` : 'Inconnu'}
                                    </span>
                                  </div>
                                  <div className="text-xs text-dune">
                                    {match.catId}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          ) : (
            <div className="panel p-12 text-center">
              <IconUsers className="w-16 h-16 text-dune/30 mx-auto mb-4" />
              <p className="text-dune">Sélectionnez un athlète pour voir son profil</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

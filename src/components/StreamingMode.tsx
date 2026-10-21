import { useState, useEffect } from 'react';
import { useApp } from '../lib/store';
import { IconTv, IconUsers, IconTrophy } from './Icons';

interface StreamConfig {
  title: string;
  showScoreboard: boolean;
  showNextMatch: boolean;
  showSponsors: boolean;
  showTimer: boolean;
  layout: 'single' | 'dual' | 'fullscreen';
}

export default function StreamingMode() {
  const { state } = useApp();
  const [config, setConfig] = useState<StreamConfig>({
    title: state.event.name,
    showScoreboard: true,
    showNextMatch: true,
    showSponsors: true,
    showTimer: true,
    layout: 'single'
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const currentMatch = Object.values(state.brackets)
    .flat()
    .find(m => m.status === 'encours');

  const nextMatches = Object.values(state.brackets)
    .flat()
    .filter(m => m.status === 'pret')
    .slice(0, 3);

  const activeSponsors = state.sponsors.filter(s => s.status === 'actif');

  const getAthleteName = (athleteId: string | null) => {
    if (!athleteId) return 'Athlète';
    const athlete = state.athletes.find(a => a.id === athleteId);
    return athlete ? `${athlete.firstName} ${athlete.lastName}` : 'Athlète';
  };

  const getAthleteClub = (athleteId: string | null) => {
    if (!athleteId) return '';
    const athlete = state.athletes.find(a => a.id === athleteId);
    return athlete?.club || '';
  };

  return (
    <div className={`min-h-screen bg-night ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header avec titre et heure */}
      <div className="bg-gradient-to-r from-gold via-flame to-forest p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <IconTv className="w-8 h-8 text-night" />
            <h1 className="font-display text-3xl text-night">
              {config.title}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-display text-2xl text-night">
                {currentTime.toLocaleTimeString('fr-FR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
              <div className="text-sm text-night/80">
                {currentTime.toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </div>
            </div>
            <button
              onClick={toggleFullscreen}
              className="btn bg-night text-gold hover:bg-bark"
            >
              {isFullscreen ? 'Quitter plein écran' : 'Plein écran'}
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Scoreboard principal */}
          {config.showScoreboard && (
            <div className="lg:col-span-2">
              <div className="panel p-8">
                <h2 className="font-display text-2xl text-bone mb-6 flex items-center gap-3">
                  <IconTrophy className="w-6 h-6 text-gold" />
                  {currentMatch ? 'Match en Cours' : 'Aucun match en cours'}
                </h2>

                {currentMatch ? (
                  <div className="space-y-6">
                    {/* Catégorie */}
                    <div className="text-center">
                      <span className="badge text-gold text-lg px-4 py-2">
                        {currentMatch.catId}
                      </span>
                    </div>

                    {/* Athlètes */}
                    <div className="grid grid-cols-2 gap-8">
                      {/* Athlète A (Chong - Bleu) */}
                      <div className="panel p-6 border-2 border-chong">
                        <div className="text-center">
                          <div className="w-20 h-20 bg-chong/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span className="font-display text-3xl text-chong">
                              {getAthleteName(currentMatch.a).charAt(0)}
                            </span>
                          </div>
                          <h3 className="font-display text-2xl text-bone mb-2">
                            {getAthleteName(currentMatch.a)}
                          </h3>
                          <p className="text-sm text-dune mb-4">
                            {getAthleteClub(currentMatch.a)}
                          </p>
                          <div className="font-display text-6xl text-chong">
                            {currentMatch.baseA + currentMatch.gamB}
                          </div>
                          {currentMatch.gamA > 0 && (
                            <div className="mt-2 text-sm text-flame">
                              Gam-jeom: {currentMatch.gamA}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* VS */}
                      <div className="hidden" />

                      {/* Athlète B (Hong - Rouge) */}
                      <div className="panel p-6 border-2 border-flame">
                        <div className="text-center">
                          <div className="w-20 h-20 bg-flame/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span className="font-display text-3xl text-flame">
                              {getAthleteName(currentMatch.b).charAt(0)}
                            </span>
                          </div>
                          <h3 className="font-display text-2xl text-bone mb-2">
                            {getAthleteName(currentMatch.b)}
                          </h3>
                          <p className="text-sm text-dune mb-4">
                            {getAthleteClub(currentMatch.b)}
                          </p>
                          <div className="font-display text-6xl text-flame">
                            {currentMatch.baseB + currentMatch.gamA}
                          </div>
                          {currentMatch.gamB > 0 && (
                            <div className="mt-2 text-sm text-flame">
                              Gam-jeom: {currentMatch.gamB}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Timer */}
                    {config.showTimer && currentMatch.clock && (
                      <div className="text-center">
                        <div className="inline-block panel px-8 py-4">
                          <div className="font-display text-5xl text-gold">
                            {Math.floor(currentMatch.clock.time / 60)}:
                            {String(currentMatch.clock.time % 60).padStart(2, '0')}
                          </div>
                          <div className="text-sm text-dune mt-2">
                            Round {currentMatch.clock.round} • {currentMatch.clock.phase}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <IconTrophy className="w-24 h-24 text-dune/30 mx-auto mb-4" />
                    <p className="text-xl text-dune">En attente du prochain match</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Prochains matchs */}
            {config.showNextMatch && nextMatches.length > 0 && (
              <div className="panel p-6">
                <h3 className="font-display text-xl text-bone mb-4 flex items-center gap-2">
                  <IconTv className="w-5 h-5 text-gold" />
                  Prochains Matchs
                </h3>
                <div className="space-y-3">
                  {nextMatches.map((match, idx) => (
                    <div key={match.id} className="panel p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="badge text-gold text-xs">
                          {match.catId}
                        </span>
                        <span className="text-xs text-dune">
                          Match {idx + 1}
                        </span>
                      </div>
                      <div className="text-sm">
                        <p className="text-bone font-semibold">
                          {getAthleteName(match.a)}
                        </p>
                        <p className="text-dune text-xs">vs</p>
                        <p className="text-bone font-semibold">
                          {getAthleteName(match.b)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sponsors */}
            {config.showSponsors && activeSponsors.length > 0 && (
              <div className="panel p-6">
                <h3 className="font-display text-xl text-bone mb-4">
                  Nos Sponsors
                </h3>
                <div className="space-y-3">
                  {activeSponsors.map((sponsor) => (
                    <div key={sponsor.id} className="panel p-4 flex items-center gap-3">
                      {sponsor.logo ? (
                        <img
                          src={sponsor.logo}
                          alt={sponsor.name}
                          className="w-12 h-12 object-contain bg-bone rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gold/20 rounded flex items-center justify-center">
                          <span className="font-display text-xl text-gold">
                            {sponsor.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-bone text-sm">
                          {sponsor.name}
                        </p>
                        <p className="text-xs text-dune capitalize">
                          {sponsor.level}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Statistiques de l'événement */}
            <div className="panel p-6">
              <h3 className="font-display text-xl text-bone mb-4">
                Statistiques
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-dune text-sm">Athlètes</span>
                  <span className="font-display text-xl text-bone">
                    {state.athletes.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-dune text-sm">Clubs</span>
                  <span className="font-display text-xl text-bone">
                    {state.clubs.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-dune text-sm">Matchs terminés</span>
                  <span className="font-display text-xl text-forest">
                    {Object.values(state.brackets).flat().filter(m => m.status === 'termine').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-dune text-sm">Matchs en cours</span>
                  <span className="font-display text-xl text-gold">
                    {Object.values(state.brackets).flat().filter(m => m.status === 'encours').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer avec sponsors */}
      {config.showSponsors && activeSponsors.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gold/10 via-flame/10 to-forest/10 border-t border-husk p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-8">
            <span className="text-sm text-dune">Propulsé par</span>
            <div className="flex items-center gap-6">
              {activeSponsors.slice(0, 5).map((sponsor) => (
                <div key={sponsor.id} className="flex items-center gap-2">
                  {sponsor.logo ? (
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gold/20 rounded flex items-center justify-center">
                      <span className="font-display text-sm text-gold">
                        {sponsor.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <span className="text-sm text-bone hidden md:inline">
                    {sponsor.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

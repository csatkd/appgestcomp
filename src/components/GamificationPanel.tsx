import { useState } from 'react';
import { useGamification } from '../hooks/useGamification';
import { IconTrophy, IconStar, IconFlame, IconMedal } from './Icons';

interface GamificationPanelProps {
  userId: string;
}

export default function GamificationPanel({ userId }: GamificationPanelProps) {
  const { stats, allAchievements, allBadges } = useGamification(userId);
  const [activeTab, setActiveTab] = useState<'achievements' | 'badges' | 'leaderboard'>('achievements');

  const xpProgress = (stats.xp / stats.xpToNextLevel) * 100;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-400 border-yellow-400';
      case 'epic': return 'text-purple-400 border-purple-400';
      case 'rare': return 'text-blue-400 border-blue-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getLevelTitle = (level: number) => {
    if (level >= 20) return 'Légende';
    if (level >= 15) return 'Maître';
    if (level >= 10) return 'Expert';
    if (level >= 5) return 'Intermédiaire';
    return 'Débutant';
  };

  const unlockedAchievements = stats.achievements.filter(a => a.unlocked);
  const lockedAchievements = stats.achievements.filter(a => !a.unlocked);

  return (
    <div className="panel p-6">
      {/* Profil Utilisateur */}
      <div className="mb-6 pb-6 border-b border-husk">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-flame flex items-center justify-center text-2xl font-bold text-night">
            {stats.level}
          </div>
          <div className="flex-1">
            <h3 className="font-display text-xl text-bone mb-1">
              Niveau {stats.level} - {getLevelTitle(stats.level)}
            </h3>
            <div className="flex items-center gap-2 text-sm text-dune">
              <IconStar className="w-4 h-4 text-gold" />
              <span>{stats.totalXp} XP total</span>
              <span className="mx-2">•</span>
              <IconFlame className="w-4 h-4 text-flame" />
              <span>{stats.streak} jours consécutifs</span>
            </div>
          </div>
        </div>

        {/* Barre de progression XP */}
        <div className="mb-2">
          <div className="flex justify-between text-xs text-dune mb-1">
            <span>{stats.xp} XP</span>
            <span>{stats.xpToNextLevel} XP</span>
          </div>
          <div className="h-3 bg-husk rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-gold to-flame transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <IconTrophy className="w-6 h-6 text-gold mx-auto mb-1" />
            <div className="text-2xl font-bold text-bone">{unlockedAchievements.length}</div>
            <div className="text-xs text-dune">Achievements</div>
          </div>
          <div className="text-center">
            <IconMedal className="w-6 h-6 text-flame mx-auto mb-1" />
            <div className="text-2xl font-bold text-bone">{stats.badges.length}</div>
            <div className="text-xs text-dune">Badges</div>
          </div>
          <div className="text-center">
            <IconStar className="w-6 h-6 text-forest mx-auto mb-1" />
            <div className="text-2xl font-bold text-bone">#{stats.rank || '-'}</div>
            <div className="text-xs text-dune">Classement</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('achievements')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'achievements'
              ? 'bg-gold text-night'
              : 'bg-bark text-dune hover:text-bone'
          }`}
        >
          Achievements
        </button>
        <button
          onClick={() => setActiveTab('badges')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'badges'
              ? 'bg-gold text-night'
              : 'bg-bark text-dune hover:text-bone'
          }`}
        >
          Badges
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'leaderboard'
              ? 'bg-gold text-night'
              : 'bg-bark text-dune hover:text-bone'
          }`}
        >
          Classement
        </button>
      </div>

      {/* Contenu des tabs */}
      {activeTab === 'achievements' && (
        <div className="space-y-3">
          {/* Achievements débloqués */}
          {unlockedAchievements.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gold mb-2">
                ✅ Débloqués ({unlockedAchievements.length})
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {unlockedAchievements.map(achievement => (
                  <div
                    key={achievement.id}
                    className="bg-bark/50 border border-gold/30 rounded-lg p-3"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-bone text-sm truncate">
                          {achievement.name}
                        </h5>
                        <p className="text-xs text-dune line-clamp-2">
                          {achievement.description}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <IconStar className="w-3 h-3 text-gold" />
                          <span className="text-xs text-gold">+{achievement.xp} XP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements verrouillés */}
          {lockedAchievements.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-dune mb-2">
                🔒 À débloquer ({lockedAchievements.length})
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {lockedAchievements.slice(0, 4).map(achievement => (
                  <div
                    key={achievement.id}
                    className="bg-bark/30 border border-husk rounded-lg p-3 opacity-60"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-2xl grayscale">{achievement.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-bone text-sm truncate">
                          {achievement.name}
                        </h5>
                        <p className="text-xs text-dune line-clamp-2">
                          {achievement.description}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <IconStar className="w-3 h-3 text-dune" />
                          <span className="text-xs text-dune">+{achievement.xp} XP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'badges' && (
        <div className="grid grid-cols-3 gap-4">
          {/* Badges obtenus */}
          {stats.badges.map(badge => (
            <div
              key={badge.id}
              className={`border-2 rounded-lg p-4 text-center ${getRarityColor(badge.rarity)}`}
            >
              <div className="text-4xl mb-2">{badge.icon}</div>
              <h5 className="font-semibold text-bone text-sm mb-1">{badge.name}</h5>
              <p className="text-xs text-dune">{badge.description}</p>
              <div className="mt-2 text-xs uppercase font-bold">
                {badge.rarity}
              </div>
            </div>
          ))}

          {/* Badges à obtenir */}
          {allBadges.filter(b => !stats.badges.find(sb => sb.id === b.id)).map(badge => (
            <div
              key={badge.id}
              className="border-2 border-husk rounded-lg p-4 text-center opacity-40"
            >
              <div className="text-4xl mb-2 grayscale">{badge.icon}</div>
              <h5 className="font-semibold text-bone text-sm mb-1">{badge.name}</h5>
              <p className="text-xs text-dune">{badge.description}</p>
              <div className="mt-2 text-xs uppercase font-bold text-dune">
                {badge.rarity}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="text-center py-8">
          <IconTrophy className="w-16 h-16 text-gold mx-auto mb-4" />
          <h4 className="font-display text-xl text-bone mb-2">Classement Global</h4>
          <p className="text-dune">
            Fonctionnalité bientôt disponible !<br />
            Comparez vos performances avec les autres utilisateurs.
          </p>
        </div>
      )}
    </div>
  );
}

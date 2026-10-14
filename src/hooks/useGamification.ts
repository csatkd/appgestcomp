import { useState, useEffect } from 'react';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'arbitre' | 'club' | 'athlete' | 'organisateur';
  xp: number;
  requirement: {
    type: 'matches_directed' | 'matches_won' | 'claims_resolved' | 'hours_active' | 'competitions_organized' | 'perfect_scoring';
    value: number;
  };
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserStats {
  userId: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXp: number;
  achievements: Achievement[];
  badges: Badge[];
  rank: number;
  streak: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt: string;
}

const LEVEL_THRESHOLDS = [
  0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500,
  5500, 6600, 7800, 9100, 10500, 12000, 13600, 15300, 17100, 19000
];

const ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  // Arbitre
  {
    id: 'first_match',
    name: 'Premier Combat',
    description: 'Diriger votre premier combat',
    icon: '🥋',
    category: 'arbitre',
    xp: 50,
    requirement: { type: 'matches_directed', value: 1 }
  },
  {
    id: 'centurion',
    name: 'Centurion',
    description: 'Diriger 100 combats',
    icon: '💯',
    category: 'arbitre',
    xp: 500,
    requirement: { type: 'matches_directed', value: 100 }
  },
  {
    id: 'perfectionist',
    name: 'Perfectionniste',
    description: '50 combats sans erreur de scoring',
    icon: '✨',
    category: 'arbitre',
    xp: 1000,
    requirement: { type: 'perfect_scoring', value: 50 }
  },
  {
    id: 'marathon',
    name: 'Marathonien',
    description: '10 heures de live scoring',
    icon: '⏱️',
    category: 'arbitre',
    xp: 750,
    requirement: { type: 'hours_active', value: 10 }
  },
  {
    id: 'diplomat',
    name: 'Diplomate',
    description: 'Résoudre 50 réclamations',
    icon: '🤝',
    category: 'arbitre',
    xp: 800,
    requirement: { type: 'claims_resolved', value: 50 }
  },
  
  // Club
  {
    id: 'first_victory',
    name: 'Première Victoire',
    description: 'Remporter votre premier combat',
    icon: '🏆',
    category: 'club',
    xp: 100,
    requirement: { type: 'matches_won', value: 1 }
  },
  {
    id: 'champion',
    name: 'Champion',
    description: 'Remporter 50 combats',
    icon: '👑',
    category: 'club',
    xp: 1000,
    requirement: { type: 'matches_won', value: 50 }
  },
  {
    id: 'dynasty',
    name: 'Dynastie',
    description: 'Remporter 200 combats',
    icon: '🏰',
    category: 'club',
    xp: 2500,
    requirement: { type: 'matches_won', value: 200 }
  },
  
  // Organisateur
  {
    id: 'first_event',
    name: 'Premier Événement',
    description: 'Organiser votre première compétition',
    icon: '📅',
    category: 'organisateur',
    xp: 200,
    requirement: { type: 'competitions_organized', value: 1 }
  },
  {
    id: 'veteran',
    name: 'Vétéran',
    description: 'Organiser 10 compétitions',
    icon: '🎖️',
    category: 'organisateur',
    xp: 1500,
    requirement: { type: 'competitions_organized', value: 10 }
  }
];

const BADGES: Omit<Badge, 'earnedAt'>[] = [
  {
    id: 'early_adopter',
    name: 'Pionnier',
    description: 'Parmi les 100 premiers utilisateurs',
    icon: '🌟',
    rarity: 'legendary'
  },
  {
    id: 'dedicated',
    name: 'Dévoué',
    description: '7 jours consécutifs d\'activité',
    icon: '🔥',
    rarity: 'rare'
  },
  {
    id: 'social',
    name: 'Social',
    description: 'Partager 10 résultats',
    icon: '📱',
    rarity: 'common'
  },
  {
    id: 'expert',
    name: 'Expert',
    description: 'Atteindre le niveau 10',
    icon: '🎓',
    rarity: 'epic'
  }
];

export function useGamification(userId: string) {
  const [stats, setStats] = useState<UserStats>(() => {
    const stored = localStorage.getItem(`gamification_${userId}`);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Initialiser avec les achievements verrouillés
    const initialAchievements = ACHIEVEMENTS.map(a => ({
      ...a,
      unlocked: false
    }));
    
    return {
      userId,
      level: 1,
      xp: 0,
      xpToNextLevel: LEVEL_THRESHOLDS[1],
      totalXp: 0,
      achievements: initialAchievements,
      badges: [],
      rank: 0,
      streak: 0
    };
  });

  // Sauvegarder dans localStorage
  useEffect(() => {
    localStorage.setItem(`gamification_${userId}`, JSON.stringify(stats));
  }, [userId, stats]);

  // Vérifier les achievements
  const checkAchievements = (actionType: string, value: number) => {
    const newAchievements = [...stats.achievements];
    let xpGained = 0;
    const unlockedAchievements: Achievement[] = [];

    newAchievements.forEach((achievement, index) => {
      if (!achievement.unlocked && 
          achievement.requirement.type === actionType && 
          value >= achievement.requirement.value) {
        newAchievements[index] = {
          ...achievement,
          unlocked: true,
          unlockedAt: new Date().toISOString()
        };
        xpGained += achievement.xp;
        unlockedAchievements.push(newAchievements[index]);
      }
    });

    if (xpGained > 0) {
      const newXp = stats.xp + xpGained;
      const newTotalXp = stats.totalXp + xpGained;
      
      // Calculer le nouveau niveau
      let newLevel = stats.level;
      while (newLevel < LEVEL_THRESHOLDS.length - 1 && 
             newXp >= LEVEL_THRESHOLDS[newLevel]) {
        newLevel++;
      }

      setStats(prev => ({
        ...prev,
        achievements: newAchievements,
        xp: newXp,
        totalXp: newTotalXp,
        level: newLevel,
        xpToNextLevel: LEVEL_THRESHOLDS[newLevel] || newXp
      }));

      return unlockedAchievements;
    }

    return [];
  };

  // Ajouter de l'XP
  const addXp = (amount: number) => {
    const newXp = stats.xp + amount;
    const newTotalXp = stats.totalXp + amount;
    
    let newLevel = stats.level;
    while (newLevel < LEVEL_THRESHOLDS.length - 1 && 
           newXp >= LEVEL_THRESHOLDS[newLevel]) {
      newLevel++;
    }

    setStats(prev => ({
      ...prev,
      xp: newXp,
      totalXp: newTotalXp,
      level: newLevel,
      xpToNextLevel: LEVEL_THRESHOLDS[newLevel] || newXp
    }));
  };

  // Débloquer un badge
  const unlockBadge = (badgeId: string) => {
    const badge = BADGES.find(b => b.id === badgeId);
    if (badge && !stats.badges.find(b => b.id === badgeId)) {
      setStats(prev => ({
        ...prev,
        badges: [...prev.badges, { ...badge, earnedAt: new Date().toISOString() }]
      }));
    }
  };

  // Incrémenter le streak
  const incrementStreak = () => {
    setStats(prev => ({
      ...prev,
      streak: prev.streak + 1
    }));
  };

  return {
    stats,
    checkAchievements,
    addXp,
    unlockBadge,
    incrementStreak,
    allAchievements: ACHIEVEMENTS,
    allBadges: BADGES
  };
}

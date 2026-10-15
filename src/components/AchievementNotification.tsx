import { useState, useEffect } from 'react';
import { IconX, IconTrophy, IconStar } from './Icons';
import type { Achievement } from '../hooks/useGamification';

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

export default function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-20 right-4 z-[200] transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="bg-gradient-to-br from-gold/20 to-flame/20 border-2 border-gold rounded-lg p-4 shadow-2xl max-w-sm">
        <div className="flex items-start gap-3">
          <div className="text-4xl animate-bounce">{achievement.icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <IconTrophy className="w-5 h-5 text-gold" />
              <h4 className="font-display text-lg text-gold">Achievement Débloqué !</h4>
            </div>
            <h5 className="font-semibold text-bone text-lg mb-1">{achievement.name}</h5>
            <p className="text-sm text-dune mb-2">{achievement.description}</p>
            <div className="flex items-center gap-1">
              <IconStar className="w-4 h-4 text-gold" />
              <span className="text-sm font-bold text-gold">+{achievement.xp} XP</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-dune hover:text-bone transition-colors"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

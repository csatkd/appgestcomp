import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorer si on est dans un input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      shortcuts.forEach((shortcut) => {
        const ctrlMatch = shortcut.ctrl ? e.ctrlKey || e.metaKey : true;
        const shiftMatch = shortcut.shift ? e.shiftKey : true;
        const altMatch = shortcut.alt ? e.altKey : true;

        if (
          e.key.toLowerCase() === shortcut.key.toLowerCase() &&
          ctrlMatch &&
          shiftMatch &&
          altMatch
        ) {
          e.preventDefault();
          shortcut.action();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

export function useGlobalShortcuts() {
  const navigate = useNavigate();

  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'd',
      ctrl: true,
      action: () => navigate('/'),
      description: 'Tableau de bord',
    },
    {
      key: 'a',
      ctrl: true,
      action: () => navigate('/athletes'),
      description: 'Athlètes',
    },
    {
      key: 'l',
      ctrl: true,
      action: () => navigate('/live'),
      description: 'Live Scoring',
    },
    {
      key: 'r',
      ctrl: true,
      action: () => navigate('/resultats'),
      description: 'Résultats',
    },
    {
      key: 'c',
      ctrl: true,
      action: () => navigate('/calendar'),
      description: 'Calendrier',
    },
    {
      key: 's',
      ctrl: true,
      action: () => navigate('/sponsors'),
      description: 'Sponsors',
    },
    {
      key: 'n',
      ctrl: true,
      action: () => navigate('/notifications'),
      description: 'Notifications',
    },
    {
      key: '?',
      shift: true,
      action: () => {
        // Afficher l'aide des raccourcis
        const helpText = `
Raccourcis clavier disponibles :

Ctrl+D : Tableau de bord
Ctrl+A : Athlètes
Ctrl+L : Live Scoring
Ctrl+R : Résultats
Ctrl+C : Calendrier
Ctrl+S : Sponsors
Ctrl+N : Notifications
Ctrl+? : Afficher cette aide

Appuyez sur Échap pour fermer.
        `.trim();
        alert(helpText);
      },
      description: 'Afficher l\'aide',
    },
  ];

  useKeyboardShortcuts(shortcuts);
}

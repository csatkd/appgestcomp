import { useState } from 'react';
import { Modal } from './ui';
import { IconKeyboard } from './Icons';

export default function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { keys: 'Ctrl+K', description: 'Ouvrir la recherche globale' },
    { keys: 'Ctrl+D', description: 'Aller au tableau de bord' },
    { keys: 'Ctrl+A', description: 'Aller aux athlètes' },
    { keys: 'Ctrl+L', description: 'Aller au live scoring' },
    { keys: 'Ctrl+R', description: 'Aller aux résultats' },
    { keys: 'Ctrl+C', description: 'Aller au calendrier' },
    { keys: 'Ctrl+S', description: 'Aller aux sponsors' },
    { keys: 'Ctrl+N', description: 'Aller aux notifications' },
    { keys: 'Ctrl+?', description: 'Afficher cette aide' },
    { keys: 'Esc', description: 'Fermer les modals' },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-ghost btn-sm"
        title="Raccourcis clavier"
      >
        <IconKeyboard className="h-4 w-4" />
        <span className="hidden sm:inline">Raccourcis</span>
      </button>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Raccourcis Clavier"
      >
        <div className="space-y-4">
          <p className="text-sm text-dune">
            Utilisez ces raccourcis pour naviguer rapidement dans l'application.
          </p>

          <div className="space-y-2">
            {shortcuts.map((shortcut) => (
              <div
                key={shortcut.keys}
                className="flex items-center justify-between panel p-3"
              >
                <span className="text-sm text-bone">{shortcut.description}</span>
                <kbd className="px-3 py-1 bg-bark border border-husk rounded font-mono text-sm text-gold">
                  {shortcut.keys}
                </kbd>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-husk">
            <p className="text-xs text-dune">
              💡 Astuce : Les raccourcis ne fonctionnent pas lorsque vous êtes dans un champ de saisie.
            </p>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-primary btn-sm"
            >
              Fermer
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

import { useState } from 'react';
import { useAccessibility, ColorBlindMode } from '../hooks/useAccessibility';
import { IconEye, IconType, IconAccessibility } from './Icons';

export default function AccessibilityPanel() {
  const {
    colorBlindMode,
    setColorBlindMode,
    highContrast,
    setHighContrast,
    largeText,
    setLargeText,
    reducedMotion,
    setReducedMotion,
  } = useAccessibility();

  const [isOpen, setIsOpen] = useState(false);

  const colorBlindModes: { value: ColorBlindMode; label: string; description: string }[] = [
    { value: 'none', label: 'Aucun', description: 'Vision normale' },
    { value: 'protanopia', label: 'Protanopie', description: 'Difficulté avec le rouge' },
    { value: 'deuteranopia', label: 'Deutéranopie', description: 'Difficulté avec le vert' },
    { value: 'tritanopia', label: 'Tritanopie', description: 'Difficulté avec le bleu' },
    { value: 'achromatopsia', label: 'Achromatopsie', description: 'Vision en noir et blanc' },
  ];

  return (
    <>
      {/* Bouton d'accès rapide */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-gold text-night p-4 rounded-full shadow-lg hover:bg-gold/90 transition-colors"
        aria-label="Options d'accessibilité"
      >
        <IconAccessibility className="w-6 h-6" />
      </button>

      {/* Panneau d'accessibilité */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-night/80 flex items-center justify-center p-4">
          <div className="bg-coal border border-husk rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-coal border-b border-husk p-6 flex items-center justify-between">
              <h2 className="font-display text-2xl text-bone flex items-center gap-2">
                <IconAccessibility className="w-6 h-6 text-gold" />
                Options d'Accessibilité
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-dune hover:text-bone transition-colors"
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Mode daltonien */}
              <div>
                <h3 className="font-display text-xl text-bone mb-4 flex items-center gap-2">
                  <IconEye className="w-5 h-5 text-gold" />
                  Mode daltonien
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {colorBlindModes.map(mode => (
                    <button
                      key={mode.value}
                      onClick={() => setColorBlindMode(mode.value)}
                      className={`p-4 border rounded-lg text-left transition-colors ${
                        colorBlindMode === mode.value
                          ? 'border-gold bg-gold/10'
                          : 'border-husk hover:border-gold/50'
                      }`}
                    >
                      <div className="font-semibold text-bone">{mode.label}</div>
                      <div className="text-sm text-dune">{mode.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contraste élevé */}
              <div>
                <h3 className="font-display text-xl text-bone mb-4">Contraste élevé</h3>
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  className={`w-full p-4 border rounded-lg text-left transition-colors ${
                    highContrast
                      ? 'border-gold bg-gold/10'
                      : 'border-husk hover:border-gold/50'
                  }`}
                >
                  <div className="font-semibold text-bone">
                    {highContrast ? '✓ Activé' : 'Désactivé'}
                  </div>
                  <div className="text-sm text-dune">
                    Augmente le contraste des couleurs pour une meilleure lisibilité
                  </div>
                </button>
              </div>

              {/* Texte agrandi */}
              <div>
                <h3 className="font-display text-xl text-bone mb-4 flex items-center gap-2">
                  <IconType className="w-5 h-5 text-gold" />
                  Texte agrandi
                </h3>
                <button
                  onClick={() => setLargeText(!largeText)}
                  className={`w-full p-4 border rounded-lg text-left transition-colors ${
                    largeText
                      ? 'border-gold bg-gold/10'
                      : 'border-husk hover:border-gold/50'
                  }`}
                >
                  <div className="font-semibold text-bone">
                    {largeText ? '✓ Activé' : 'Désactivé'}
                  </div>
                  <div className="text-sm text-dune">
                    Augmente la taille du texte pour une meilleure lisibilité
                  </div>
                </button>
              </div>

              {/* Mouvement réduit */}
              <div>
                <h3 className="font-display text-xl text-bone mb-4">Mouvement réduit</h3>
                <button
                  onClick={() => setReducedMotion(!reducedMotion)}
                  className={`w-full p-4 border rounded-lg text-left transition-colors ${
                    reducedMotion
                      ? 'border-gold bg-gold/10'
                      : 'border-husk hover:border-gold/50'
                  }`}
                >
                  <div className="font-semibold text-bone">
                    {reducedMotion ? '✓ Activé' : 'Désactivé'}
                  </div>
                  <div className="text-sm text-dune">
                    Réduit ou désactive les animations pour les personnes sensibles
                  </div>
                </button>
              </div>

              {/* Raccourcis clavier */}
              <div>
                <h3 className="font-display text-xl text-bone mb-4">Raccourcis clavier</h3>
                <div className="bg-bark/50 border border-husk rounded-lg p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-dune">Ouvrir la recherche</span>
                      <kbd className="px-2 py-1 bg-coal border border-husk rounded text-bone">Ctrl+K</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dune">Tableau de bord</span>
                      <kbd className="px-2 py-1 bg-coal border border-husk rounded text-bone">Ctrl+D</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dune">Athlètes</span>
                      <kbd className="px-2 py-1 bg-coal border border-husk rounded text-bone">Ctrl+A</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dune">Live Scoring</span>
                      <kbd className="px-2 py-1 bg-coal border border-husk rounded text-bone">Ctrl+L</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dune">Résultats</span>
                      <kbd className="px-2 py-1 bg-coal border border-husk rounded text-bone">Ctrl+R</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dune">Calendrier</span>
                      <kbd className="px-2 py-1 bg-coal border border-husk rounded text-bone">Ctrl+C</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dune">Sponsors</span>
                      <kbd className="px-2 py-1 bg-coal border border-husk rounded text-bone">Ctrl+S</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dune">Notifications</span>
                      <kbd className="px-2 py-1 bg-coal border border-husk rounded text-bone">Ctrl+N</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dune">Afficher cette aide</span>
                      <kbd className="px-2 py-1 bg-coal border border-husk rounded text-bone">Ctrl+?</kbd>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation au clavier */}
              <div>
                <h3 className="font-display text-xl text-bone mb-4">Navigation au clavier</h3>
                <div className="bg-bark/50 border border-husk rounded-lg p-4 text-sm text-dune space-y-2">
                  <p>✓ <strong className="text-bone">Tab</strong> : Naviguer entre les éléments interactifs</p>
                  <p>✓ <strong className="text-bone">Shift+Tab</strong> : Naviguer en arrière</p>
                  <p>✓ <strong className="text-bone">Enter</strong> ou <strong className="text-bone">Space</strong> : Activer un bouton ou lien</p>
                  <p>✓ <strong className="text-bone">Escape</strong> : Fermer les modales et menus</p>
                  <p>✓ <strong className="text-bone">Flèches</strong> : Naviguer dans les listes et menus</p>
                </div>
              </div>

              {/* Support Screen Reader */}
              <div>
                <h3 className="font-display text-xl text-bone mb-4">Support Screen Reader</h3>
                <div className="bg-bark/50 border border-husk rounded-lg p-4 text-sm text-dune space-y-2">
                  <p>✓ Tous les éléments interactifs ont des labels ARIA appropriés</p>
                  <p>✓ Les régions importantes sont identifiées avec des landmarks ARIA</p>
                  <p>✓ Les changements de contenu sont annoncés avec aria-live</p>
                  <p>✓ La structure des tableaux est sémantiquement correcte</p>
                  <p>✓ Les icônes ont des descriptions textuelles alternatives</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

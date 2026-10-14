import { useState } from 'react';
import { Modal, useToast } from './ui';
import { useDashboardWidgets, type Widget } from './DashboardWidgets';
import { IconSettings, IconGripVertical } from './Icons';

export default function DashboardSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const { widgets, toggleWidget, updateWidgetSize, resetToDefault } = useDashboardWidgets();
  const toast = useToast();

  const handleReset = () => {
    if (confirm('Réinitialiser le dashboard aux valeurs par défaut ?')) {
      resetToDefault();
      toast('Dashboard réinitialisé', 'info');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-ghost btn-sm"
        title="Personnaliser le dashboard"
      >
        <IconSettings className="h-4 w-4" />
        Personnaliser
      </button>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Personnaliser le Dashboard"
      >
        <div className="space-y-4">
          <p className="text-sm text-dune">
            Activez, désactivez et configurez les widgets de votre tableau de bord.
          </p>

          <div className="space-y-3">
            {widgets.map((widget) => (
              <div
                key={widget.id}
                className={`panel p-4 flex items-center gap-4 ${
                  !widget.enabled ? 'opacity-50' : ''
                }`}
              >
                <IconGripVertical className="h-5 w-5 text-dune cursor-move" />
                <div className="flex-1">
                  <p className="font-semibold text-bone">{widget.title}</p>
                  <p className="text-xs text-dune mt-1">
                    Taille : {widget.size === 'small' ? 'Petite' : widget.size === 'medium' ? 'Moyenne' : 'Grande'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Sélecteur de taille */}
                  <select
                    value={widget.size}
                    onChange={(e) => updateWidgetSize(widget.id, e.target.value as Widget['size'])}
                    className="input text-sm"
                    disabled={!widget.enabled}
                  >
                    <option value="small">Petite</option>
                    <option value="medium">Moyenne</option>
                    <option value="large">Grande</option>
                  </select>

                  {/* Toggle */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={widget.enabled}
                      onChange={() => toggleWidget(widget.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-husk peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gold rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-bone after:border-husk after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-husk">
            <button
              onClick={handleReset}
              className="btn btn-ghost btn-sm"
            >
              Réinitialiser
            </button>
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

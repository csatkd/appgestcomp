import { useState } from 'react';
import { PoomsaePerformance, PoomsaeForm, GRADE_TO_FORM, isFormValidForBelt } from '../../lib/poomsae/types';
import { IconCheck } from '../Icons';

interface RegisterAthleteModalProps {
  categoryId: string;
  beltLevel: 'color' | 'black';
  requiredForm?: PoomsaeForm;
  onSubmit: (performance: PoomsaePerformance) => void;
  onCancel: () => void;
}

export default function RegisterAthleteModal({
  categoryId,
  beltLevel,
  requiredForm,
  onSubmit,
  onCancel,
}: RegisterAthleteModalProps) {
  const [formData, setFormData] = useState({
    athleteId: '',
    form: requiredForm || ('Taegeuk 1 Jang' as PoomsaeForm),
  });

  // Liste des formes disponibles selon le niveau
  const availableForms: PoomsaeForm[] = beltLevel === 'color'
    ? [
        'Taegeuk 1 Jang', 'Taegeuk 2 Jang', 'Taegeuk 3 Jang', 'Taegeuk 4 Jang',
        'Taegeuk 5 Jang', 'Taegeuk 6 Jang', 'Taegeuk 7 Jang', 'Taegeuk 8 Jang'
      ]
    : [
        'Koryo', 'Keumgang', 'Taebaek', 'Pyongwon', 'Shipjin',
        'Jitae', 'Chonkwon', 'Hansoo', 'Ilyeo', 'Freestyle'
      ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Vérifier que la forme est valide pour le niveau
    if (!isFormValidForBelt(formData.form, beltLevel)) {
      alert('Cette forme n\'est pas valide pour ce niveau de ceinture');
      return;
    }

    const performance: PoomsaePerformance = {
      id: `perf-${Date.now()}`,
      categoryId,
      athleteId: formData.athleteId,
      form: formData.form,
      order: 0, // Sera défini lors du tirage
      judgeScores: [],
      deductions: 0,
      deductionReasons: [],
      status: 'attente',
    };

    onSubmit(performance);
  };

  return (
    <div className="fixed inset-0 z-50 bg-night/80 flex items-center justify-center p-4">
      <div className="bg-coal border border-husk rounded-lg max-w-2xl w-full">
        <div className="sticky top-0 bg-coal border-b border-husk p-6">
          <h2 className="font-display text-2xl text-bone">Inscrire un athlète</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* ID de l'athlète */}
          <div>
            <label className="label">ID de l'athlète</label>
            <input
              type="text"
              value={formData.athleteId}
              onChange={(e) => setFormData({ ...formData, athleteId: e.target.value })}
              placeholder="Ex: ath-123"
              className="input"
              required
            />
            <p className="text-xs text-dune mt-1">
              Entrez l'identifiant unique de l'athlète
            </p>
          </div>

          {/* Sélection de la forme */}
          <div>
            <label className="label">Forme à exécuter</label>
            {requiredForm ? (
              <div className="input bg-bark/50">
                <div className="font-semibold text-bone">{requiredForm}</div>
                <div className="text-xs text-dune mt-1">
                  Forme imposée pour cette catégorie
                </div>
              </div>
            ) : (
              <select
                value={formData.form}
                onChange={(e) => setFormData({ ...formData, form: e.target.value as PoomsaeForm })}
                className="input"
              >
                {availableForms.map(form => (
                  <option key={form} value={form}>
                    {form}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Informations sur les formes */}
          <div className="bg-bark/30 border border-husk rounded-lg p-4">
            <h3 className="font-semibold text-bone mb-2">💡 Informations sur les formes</h3>
            <div className="text-sm text-dune space-y-2">
              <p>
                <strong className="text-bone">Taegeuk 1-8 Jang :</strong> Formes de base pour les ceintures de couleur (9ᵉ à 1ᵉʳ Gup)
              </p>
              <p>
                <strong className="text-bone">Koryo à Ilyeo :</strong> Formes avancées pour les ceintures noires (1ᵉʳ à 9ᵉ Dan)
              </p>
              <p>
                <strong className="text-bone">Freestyle :</strong> Forme libre avec mouvements créatifs (ceintures noires uniquement)
              </p>
            </div>
          </div>

          {/* Correspondance grade/forme */}
          <div className="bg-bark/30 border border-husk rounded-lg p-4">
            <h3 className="font-semibold text-bone mb-2">📋 Correspondance Grade/Forme</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(GRADE_TO_FORM).slice(0, 10).map(([grade, form]) => (
                <div key={grade} className="flex justify-between">
                  <span className="text-dune">{grade}:</span>
                  <span className="text-bone font-semibold">{form}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-husk">
            <button type="button" onClick={onCancel} className="btn btn-ghost flex-1">
              Annuler
            </button>
            <button type="submit" className="btn btn-primary flex-1">
              <IconCheck className="w-4 h-4" />
              Inscrire l'athlète
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

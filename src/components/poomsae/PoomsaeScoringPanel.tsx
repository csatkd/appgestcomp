import { useState } from 'react';
import { PoomsaeScores, PoomsaeCategory, calculateFinalScore } from '../../lib/poomsae/types';
import { IconCheck, IconX } from '../Icons';

interface PoomsaeScoringPanelProps {
  categoryId: string;
  categoryType: PoomsaeCategory;
  athleteName: string;
  form: string;
  onSubmit: (scores: PoomsaeScores, deductions: number, comments: string) => void;
  onCancel: () => void;
}

/**
 * Panneau de notation pour les juges Poomsae
 * Permet de noter chaque critère de 0 à 10 et d'appliquer des déductions
 */
export default function PoomsaeScoringPanel({
  categoryId,
  categoryType,
  athleteName,
  form,
  onSubmit,
  onCancel,
}: PoomsaeScoringPanelProps) {
  const [scores, setScores] = useState<PoomsaeScores>({
    accuracy: 7,
    power: 7,
    balance: 7,
    rhythm: 7,
    expression: 7,
    presentation: 7,
  });

  const [deductions, setDeductions] = useState(0);
  const [comments, setComments] = useState('');
  const [showDeductionModal, setShowDeductionModal] = useState(false);

  // Calcul du score final en temps réel
  const finalScore = calculateFinalScore(scores, categoryType, deductions);

  // Critères avec descriptions et poids
  const criteria = [
    {
      key: 'accuracy' as keyof PoomsaeScores,
      label: 'Précision',
      description: 'Exactitude des techniques et des positions',
      icon: '🎯',
      weight: categoryType === 'individuel-reconnu' ? 30 : 20,
    },
    {
      key: 'power' as keyof PoomsaeScores,
      label: 'Puissance',
      description: 'Force et vitesse d\'exécution',
      icon: '💪',
      weight: categoryType === 'individuel-freestyle' ? 25 : 20,
    },
    {
      key: 'balance' as keyof PoomsaeScores,
      label: 'Équilibre',
      description: 'Stabilité et contrôle du corps',
      icon: '⚖️',
      weight: 20,
    },
    {
      key: 'rhythm' as keyof PoomsaeScores,
      label: 'Rythme',
      description: 'Tempo et fluidité des mouvements',
      icon: '🎵',
      weight: categoryType.includes('equipe') ? 25 : 15,
    },
    {
      key: 'expression' as keyof PoomsaeScores,
      label: 'Expression',
      description: 'Confiance et présence scénique',
      icon: '✨',
      weight: categoryType === 'individuel-freestyle' ? 20 : 10,
    },
    {
      key: 'presentation' as keyof PoomsaeScores,
      label: 'Présentation',
      description: 'Tenue, attitude et salut',
      icon: '👔',
      weight: categoryType.includes('equipe') ? 10 : 5,
    },
  ];

  // Raisons de déduction courantes
  const deductionReasons = [
    { label: 'Erreur de forme', points: 0.5 },
    { label: 'Perte d\'équilibre', points: 0.5 },
    { label: 'Mouvement incorrect', points: 1.0 },
    { label: 'Oubli de technique', points: 1.5 },
    { label: 'Sortie de zone', points: 1.0 },
    { label: 'Temps dépassé', points: 1.0 },
    { label: 'Tenue incorrecte', points: 0.5 },
    { label: 'Autre', points: 0 },
  ];

  const handleScoreChange = (key: keyof PoomsaeScores, value: number) => {
    setScores(prev => ({ ...prev, [key]: Math.max(0, Math.min(10, value)) }));
  };

  const handleAddDeduction = (reason: string, points: number) => {
    setDeductions(prev => prev + points);
    setComments(prev => prev ? `${prev}\n• ${reason} (-${points})` : `• ${reason} (-${points})`);
    setShowDeductionModal(false);
  };

  const handleSubmit = () => {
    onSubmit(scores, deductions, comments);
  };

  return (
    <div className="fixed inset-0 z-50 bg-night/90 flex items-center justify-center p-4">
      <div className="bg-coal border border-husk rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="sticky top-0 bg-coal border-b border-husk p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl text-bone">Notation Poomsae</h2>
              <p className="text-sm text-dune mt-1">
                {athleteName} • {form}
              </p>
            </div>
            <div className="text-right">
              <div className="font-display text-4xl text-gold">{finalScore.toFixed(2)}</div>
              <div className="text-xs text-dune">Score final / 10</div>
            </div>
          </div>
        </div>

        {/* Critères de notation */}
        <div className="p-6 space-y-6">
          {criteria.map((criterion) => (
            <div key={criterion.key} className="border border-husk rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{criterion.icon}</span>
                  <div>
                    <h3 className="font-semibold text-bone">{criterion.label}</h3>
                    <p className="text-xs text-dune">{criterion.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-dune">Poids</div>
                  <div className="font-semibold text-gold">{criterion.weight}%</div>
                </div>
              </div>

              {/* Slider de notation */}
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleScoreChange(criterion.key, scores[criterion.key] - 0.5)}
                    disabled={scores[criterion.key] <= 0}
                    className="btn btn-ghost btn-sm"
                  >
                    -0.5
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={scores[criterion.key]}
                    onChange={(e) => handleScoreChange(criterion.key, parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-husk rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #f0a41c 0%, #f0a41c ${(scores[criterion.key] / 10) * 100}%, #3d2f1d ${(scores[criterion.key] / 10) * 100}%, #3d2f1d 100%)`
                    }}
                  />
                  <button
                    onClick={() => handleScoreChange(criterion.key, scores[criterion.key] + 0.5)}
                    disabled={scores[criterion.key] >= 10}
                    className="btn btn-ghost btn-sm"
                  >
                    +0.5
                  </button>
                </div>
                <div className="flex justify-between text-xs text-dune">
                  <span>0</span>
                  <span className="font-semibold text-bone">{scores[criterion.key].toFixed(1)}</span>
                  <span>10</span>
                </div>
              </div>
            </div>
          ))}

          {/* Déductions */}
          <div className="border border-flame/30 bg-flame/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-bone flex items-center gap-2">
                  <IconX className="w-5 h-5 text-flame" />
                  Déductions
                </h3>
                <p className="text-xs text-dune mt-1">
                  Points retirés pour erreurs ou infractions
                </p>
              </div>
              <div className="text-right">
                <div className="font-display text-2xl text-flame">-{deductions.toFixed(1)}</div>
                <button
                  onClick={() => setShowDeductionModal(true)}
                  className="btn btn-ghost btn-sm mt-2"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>

          {/* Commentaires */}
          <div>
            <label className="label">Commentaires du juge</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Observations, remarques, conseils..."
              className="input min-h-[100px]"
            />
          </div>
        </div>

        {/* Pied de page */}
        <div className="sticky bottom-0 bg-coal border-t border-husk p-6 flex gap-3">
          <button onClick={onCancel} className="btn btn-ghost flex-1">
            Annuler
          </button>
          <button onClick={handleSubmit} className="btn btn-primary flex-1">
            <IconCheck className="w-4 h-4" />
            Valider la notation
          </button>
        </div>

        {/* Modal de déduction */}
        {showDeductionModal && (
          <div className="fixed inset-0 z-[60] bg-night/80 flex items-center justify-center p-4">
            <div className="bg-coal border border-husk rounded-lg max-w-md w-full">
              <div className="border-b border-husk p-4">
                <h3 className="font-display text-xl text-bone">Ajouter une déduction</h3>
              </div>
              <div className="p-4 space-y-2">
                {deductionReasons.map((reason, index) => (
                  <button
                    key={index}
                    onClick={() => handleAddDeduction(reason.label, reason.points)}
                    className="w-full p-3 border border-husk rounded-lg text-left hover:border-gold transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-bone">{reason.label}</span>
                      <span className="text-flame font-semibold">-{reason.points}</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="border-t border-husk p-4">
                <button
                  onClick={() => setShowDeductionModal(false)}
                  className="btn btn-ghost w-full"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

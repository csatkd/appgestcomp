import { useState } from 'react';
import { BreakingAttempt, AttemptResult, Material, Technique, DEFAULT_MATERIALS, DEFAULT_TECHNIQUES } from '../../lib/casse/types';
import { IconCheck, IconX, IconAlert } from '../Icons';

interface CasseScoringPanelProps {
  performanceId: string;
  athleteName: string;
  attemptNumber: number;
  maxAttempts: number;
  onSubmit: (attempt: Omit<BreakingAttempt, 'id' | 'performanceId' | 'attemptNumber' | 'timestamp' | 'duration'>) => void;
  onCancel: () => void;
}

export default function CasseScoringPanel({
  performanceId,
  athleteName,
  attemptNumber,
  maxAttempts,
  onSubmit,
  onCancel,
}: CasseScoringPanelProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<Material>(DEFAULT_MATERIALS[0]);
  const [selectedTechnique, setSelectedTechnique] = useState<Technique>(DEFAULT_TECHNIQUES[0]);
  const [result, setResult] = useState<AttemptResult>('reussi');
  const [scores, setScores] = useState({
    score: 7,
    powerScore: 7,
    techniqueScore: 7,
    formScore: 7,
  });
  const [comments, setComments] = useState('');
  const [injuries, setInjuries] = useState<string[]>([]);
  const [showInjuryModal, setShowInjuryModal] = useState(false);

  const injuryTypes = [
    'Entorse cheville',
    'Foulure poignet',
    'Contusion pied',
    'Entorse genou',
    'Coupure main',
    'Autre blessure'
  ];

  const handleScoreChange = (key: keyof typeof scores, value: number) => {
    setScores(prev => ({ ...prev, [key]: Math.max(0, Math.min(10, value)) }));
  };

  const handleAddInjury = (injury: string) => {
    if (!injuries.includes(injury)) {
      setInjuries([...injuries, injury]);
    }
    setShowInjuryModal(false);
  };

  const handleRemoveInjury = (injury: string) => {
    setInjuries(injuries.filter(i => i !== injury));
  };

  const handleSubmit = () => {
    const attempt: Omit<BreakingAttempt, 'id' | 'performanceId' | 'attemptNumber' | 'timestamp' | 'duration'> = {
      materialId: selectedMaterial.id,
      techniqueId: selectedTechnique.id,
      result,
      score: scores.score,
      powerScore: scores.powerScore,
      techniqueScore: scores.techniqueScore,
      formScore: scores.formScore,
      comments,
      injuries,
      judges: ['judge-1'], // TODO: gérer les vrais juges
    };

    onSubmit(attempt);
  };

  const getResultColor = (r: AttemptResult) => {
    switch (r) {
      case 'reussi': return 'bg-forest text-bone';
      case 'echoue': return 'bg-flame text-bone';
      case 'partiel': return 'bg-gold text-night';
      case 'disqualifie': return 'bg-flame text-bone';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-night/90 flex items-center justify-center p-4">
      <div className="bg-coal border border-husk rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="sticky top-0 bg-coal border-b border-husk p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl text-bone">Tentative de Casse</h2>
              <p className="text-sm text-dune mt-1">
                {athleteName} • Tentative {attemptNumber}/{maxAttempts}
              </p>
            </div>
            <div className="text-right">
              <div className="font-display text-4xl text-gold">{attemptNumber}</div>
              <div className="text-xs text-dune">/ {maxAttempts}</div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Sélection du matériau */}
          <div>
            <label className="label">Matériau à casser</label>
            <select
              value={selectedMaterial.id}
              onChange={(e) => setSelectedMaterial(DEFAULT_MATERIALS.find(m => m.id === e.target.value)!)}
              className="input"
            >
              {DEFAULT_MATERIALS.map(material => (
                <option key={material.id} value={material.id}>
                  {material.name} ({material.thickness}cm) - Difficulté: {'⭐'.repeat(material.difficulty)}
                </option>
              ))}
            </select>
            <div className="mt-2 text-xs text-dune">
              Dimensions: {selectedMaterial.width}×{selectedMaterial.height}×{selectedMaterial.thickness} cm
            </div>
          </div>

          {/* Sélection de la technique */}
          <div>
            <label className="label">Technique utilisée</label>
            <select
              value={selectedTechnique.id}
              onChange={(e) => setSelectedTechnique(DEFAULT_TECHNIQUES.find(t => t.id === e.target.value)!)}
              className="input"
            >
              {DEFAULT_TECHNIQUES.map(technique => (
                <option key={technique.id} value={technique.id}>
                  {technique.name} ({technique.bodyPart}) - Difficulté: {'⭐'.repeat(technique.difficulty)}
                </option>
              ))}
            </select>
            <div className="mt-2 text-xs text-dune">
              {selectedTechnique.description}
            </div>
          </div>

          {/* Résultat */}
          <div>
            <label className="label">Résultat</label>
            <div className="grid grid-cols-4 gap-2">
              {(['reussi', 'echoue', 'partiel', 'disqualifie'] as AttemptResult[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setResult(r)}
                  className={`p-3 border-2 rounded-lg transition-colors ${
                    result === r
                      ? getResultColor(r) + ' border-current'
                      : 'border-husk hover:border-gold/50'
                  }`}
                >
                  <div className="font-semibold text-sm">
                    {r === 'reussi' && '✓ Réussi'}
                    {r === 'echoue' && '✗ Échoué'}
                    {r === 'partiel' && '◐ Partiel'}
                    {r === 'disqualifie' && '⊘ DQ'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Notation (si pas disqualifié) */}
          {result !== 'disqualifie' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-bone">Notation (0-10)</h3>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-dune">Score global</span>
                  <span className="text-bone font-semibold">{scores.score.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={scores.score}
                  onChange={(e) => handleScoreChange('score', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-dune">Puissance</span>
                  <span className="text-bone font-semibold">{scores.powerScore.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={scores.powerScore}
                  onChange={(e) => handleScoreChange('powerScore', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-dune">Technique</span>
                  <span className="text-bone font-semibold">{scores.techniqueScore.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={scores.techniqueScore}
                  onChange={(e) => handleScoreChange('techniqueScore', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-dune">Forme</span>
                  <span className="text-bone font-semibold">{scores.formScore.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={scores.formScore}
                  onChange={(e) => handleScoreChange('formScore', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {/* Blessures */}
          <div>
            <label className="label">Blessures</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {injuries.map((injury) => (
                <span
                  key={injury}
                  className="badge bg-flame/20 text-flame border-flame flex items-center gap-2"
                >
                  {injury}
                  <button
                    onClick={() => handleRemoveInjury(injury)}
                    className="hover:text-bone"
                  >
                    <IconX className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <button
              onClick={() => setShowInjuryModal(true)}
              className="btn btn-ghost btn-sm"
            >
              <IconAlert className="w-4 h-4" />
              Ajouter une blessure
            </button>
          </div>

          {/* Commentaires */}
          <div>
            <label className="label">Commentaires</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Observations sur la tentative..."
              className="input min-h-[80px]"
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
            Valider la tentative
          </button>
        </div>

        {/* Modal de blessure */}
        {showInjuryModal && (
          <div className="fixed inset-0 z-[60] bg-night/80 flex items-center justify-center p-4">
            <div className="bg-coal border border-husk rounded-lg max-w-md w-full">
              <div className="border-b border-husk p-4">
                <h3 className="font-display text-xl text-bone">Sélectionner une blessure</h3>
              </div>
              <div className="p-4 space-y-2">
                {injuryTypes.map((injury) => (
                  <button
                    key={injury}
                    onClick={() => handleAddInjury(injury)}
                    className="w-full p-3 border border-husk rounded-lg text-left hover:border-flame transition-colors"
                  >
                    <span className="text-bone">{injury}</span>
                  </button>
                ))}
              </div>
              <div className="border-t border-husk p-4">
                <button
                  onClick={() => setShowInjuryModal(false)}
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

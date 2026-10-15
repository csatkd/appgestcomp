import { useState } from 'react';
import { ExamEvaluation, GradeExam, ExamRegistration } from '../../lib/grades/types';
import { IconCheck, IconX } from '../Icons';

interface ExamEvaluationPanelProps {
  exam: GradeExam;
  registration: ExamRegistration;
  onSubmit: (evaluation: Omit<ExamEvaluation, 'id' | 'finalScore' | 'passed' | 'result'>) => void;
  onCancel: () => void;
}

export default function ExamEvaluationPanel({
  exam,
  registration,
  onSubmit,
  onCancel,
}: ExamEvaluationPanelProps) {
  const [scores, setScores] = useState({
    techniquesScore: 7,
    poomsaeScore: 7,
    sparringScore: exam.evaluationCriteria.sparring ? 7 : undefined,
    theoryScore: exam.evaluationCriteria.theory ? 7 : undefined,
    breakingScore: exam.evaluationCriteria.breaking ? 7 : undefined,
    attitudeScore: 8,
  });

  const [strengths, setStrengths] = useState<string[]>([]);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [examinerComments, setExaminerComments] = useState('');

  const handleScoreChange = (key: keyof typeof scores, value: number) => {
    setScores(prev => ({ ...prev, [key]: Math.max(0, Math.min(10, value)) }));
  };

  const handleSubmit = () => {
    const evaluation: Omit<ExamEvaluation, 'id' | 'finalScore' | 'passed' | 'result'> = {
      registrationId: registration.id,
      athleteId: registration.athleteId,
      examId: exam.id,
      ...scores,
      strengths,
      weaknesses,
      recommendations,
      examinerComments,
      evaluatedBy: ['examiner-1'], // TODO: gérer les vrais examinateurs
      evaluationDate: new Date().toISOString(),
    };

    onSubmit(evaluation);
  };

  const addCriterion = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
  ) => {
    if (value.trim() && !list.includes(value.trim())) {
      setList([...list, value.trim()]);
    }
  };

  const removeCriterion = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
  ) => {
    setList(list.filter(item => item !== value));
  };

  return (
    <div className="fixed inset-0 z-50 bg-night/90 flex items-center justify-center p-4">
      <div className="bg-coal border border-husk rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="sticky top-0 bg-coal border-b border-husk p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl text-bone">Évaluation de l'athlète</h2>
              <p className="text-sm text-dune mt-1">
                {registration.athleteName} • {exam.previousBelt.name} → {exam.targetBelt.name}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Scores par catégorie */}
          <div className="space-y-4">
            <h3 className="font-semibold text-bone">Scores par catégorie (0-10)</h3>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-dune">
                  Techniques ({exam.evaluationCriteria.techniques.weight}%)
                </span>
                <span className="text-bone font-semibold">{scores.techniquesScore.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={scores.techniquesScore}
                onChange={(e) => handleScoreChange('techniquesScore', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-dune">
                  Poomsae ({exam.evaluationCriteria.poomsae.weight}%)
                </span>
                <span className="text-bone font-semibold">{scores.poomsaeScore.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={scores.poomsaeScore}
                onChange={(e) => handleScoreChange('poomsaeScore', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {exam.evaluationCriteria.sparring && (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-dune">
                    Combat ({exam.evaluationCriteria.sparring.weight}%)
                  </span>
                  <span className="text-bone font-semibold">{scores.sparringScore?.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={scores.sparringScore || 0}
                  onChange={(e) => handleScoreChange('sparringScore', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            )}

            {exam.evaluationCriteria.theory && (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-dune">
                    Théorie ({exam.evaluationCriteria.theory.weight}%)
                  </span>
                  <span className="text-bone font-semibold">{scores.theoryScore?.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={scores.theoryScore || 0}
                  onChange={(e) => handleScoreChange('theoryScore', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            )}

            {exam.evaluationCriteria.breaking && (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-dune">
                    Casse ({exam.evaluationCriteria.breaking.weight}%)
                  </span>
                  <span className="text-bone font-semibold">{scores.breakingScore?.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={scores.breakingScore || 0}
                  onChange={(e) => handleScoreChange('breakingScore', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            )}

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-dune">
                  Attitude et comportement
                </span>
                <span className="text-bone font-semibold">{scores.attitudeScore.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={scores.attitudeScore}
                onChange={(e) => handleScoreChange('attitudeScore', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Points forts */}
          <div>
            <label className="label">Points forts</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {strengths.map((strength) => (
                <span
                  key={strength}
                  className="badge bg-forest/20 text-forest border-forest flex items-center gap-2"
                >
                  {strength}
                  <button
                    onClick={() => removeCriterion(strengths, setStrengths, strength)}
                    className="hover:text-bone"
                  >
                    <IconX className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Ajouter un point fort..."
              className="input"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addCriterion(strengths, setStrengths, (e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
          </div>

          {/* Points à améliorer */}
          <div>
            <label className="label">Points à améliorer</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {weaknesses.map((weakness) => (
                <span
                  key={weakness}
                  className="badge bg-flame/20 text-flame border-flame flex items-center gap-2"
                >
                  {weakness}
                  <button
                    onClick={() => removeCriterion(weaknesses, setWeaknesses, weakness)}
                    className="hover:text-bone"
                  >
                    <IconX className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Ajouter un point à améliorer..."
              className="input"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addCriterion(weaknesses, setWeaknesses, (e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
          </div>

          {/* Recommandations */}
          <div>
            <label className="label">Recommandations</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {recommendations.map((rec) => (
                <span
                  key={rec}
                  className="badge bg-gold/20 text-gold border-gold flex items-center gap-2"
                >
                  {rec}
                  <button
                    onClick={() => removeCriterion(recommendations, setRecommendations, rec)}
                    className="hover:text-bone"
                  >
                    <IconX className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Ajouter une recommandation..."
              className="input"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addCriterion(recommendations, setRecommendations, (e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
          </div>

          {/* Commentaires de l'examinateur */}
          <div>
            <label className="label">Commentaires généraux</label>
            <textarea
              value={examinerComments}
              onChange={(e) => setExaminerComments(e.target.value)}
              placeholder="Observations générales sur la performance de l'athlète..."
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
            Valider l'évaluation
          </button>
        </div>
      </div>
    </div>
  );
}

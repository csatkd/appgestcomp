import { useState } from 'react';
import { useGradesStore } from '../../lib/grades/useGradesStore';
import { GradeExam, ExamStatus, Belt, DEFAULT_BELTS } from '../../lib/grades/types';
import { PageHead } from '../ui';
import { IconPlus, IconCalendar, IconUsers, IconCheck, IconX } from '../Icons';
import PageBackground from '../PageBackground';
import { PAGE_BACKGROUNDS } from '../../config/backgrounds';

export default function GradeManager() {
  const store = useGradesStore();
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [showCreateExamModal, setShowCreateExamModal] = useState(false);

  const selectedExam = selectedExamId
    ? store.exams.find(e => e.id === selectedExamId)
    : null;

  const upcomingExams = store.getUpcomingExams();
  const pastExams = store.getPastExams();

  const getStatusColor = (status: ExamStatus) => {
    switch (status) {
      case 'planifie': return 'text-chong';
      case 'inscrit': return 'text-gold';
      case 'en_cours': return 'text-flame';
      case 'evalue': return 'text-forest';
      case 'reussi': return 'text-forest';
      case 'echoue': return 'text-flame';
      case 'reporte': return 'text-gold';
      case 'annule': return 'text-dune';
      default: return 'text-dune';
    }
  };

  const getStatusLabel = (status: ExamStatus) => {
    const labels: Record<ExamStatus, string> = {
      planifie: 'Planifié',
      inscrit: 'Inscriptions ouvertes',
      en_cours: 'En cours',
      evalue: 'Évalué',
      reussi: 'Réussi',
      echoue: 'Échoué',
      reporte: 'Reporté',
      annule: 'Annulé'
    };
    return labels[status];
  };

  const getBeltColor = (color: string) => {
    const colors: Record<string, string> = {
      'blanche': 'bg-white border-2 border-gray-300',
      'jaune': 'bg-yellow-400',
      'jaune-vert': 'bg-gradient-to-r from-yellow-400 to-green-400',
      'vert': 'bg-green-500',
      'vert-bleu': 'bg-gradient-to-r from-green-500 to-blue-500',
      'bleu': 'bg-blue-500',
      'bleu-rouge': 'bg-gradient-to-r from-blue-500 to-red-500',
      'rouge': 'bg-red-500',
      'rouge-noire': 'bg-gradient-to-r from-red-500 to-black',
      'noire': 'bg-black'
    };
    return colors[color] || 'bg-gray-500';
  };

  const handleCreateExam = (exam: GradeExam) => {
    store.createExam(exam);
    setShowCreateExamModal(false);
  };

  return (
    <div className="fade-up mx-auto max-w-7xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.dashboard} opacity={0.08} blur={3} />
      <PageHead
        title="Passages de Grades"
        subtitle="Gestion des examens et certifications"
        actions={
          <button
            onClick={() => setShowCreateExamModal(true)}
            className="btn btn-primary"
          >
            <IconPlus className="w-4 h-4" />
            Nouvel examen
          </button>
        }
      />

      {/* Statistiques globales */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="panel p-6">
          <div className="text-3xl font-display text-bone mb-2">
            {store.exams.length}
          </div>
          <div className="text-sm text-dune">Examens totaux</div>
        </div>
        <div className="panel p-6">
          <div className="text-3xl font-display text-chong mb-2">
            {upcomingExams.length}
          </div>
          <div className="text-sm text-dune">À venir</div>
        </div>
        <div className="panel p-6">
          <div className="text-3xl font-display text-forest mb-2">
            {store.certificates.length}
          </div>
          <div className="text-sm text-dune">Certificats délivrés</div>
        </div>
        <div className="panel p-6">
          <div className="text-3xl font-display text-gold mb-2">
            {store.config.belts.length}
          </div>
          <div className="text-sm text-dune">Niveaux de ceinture</div>
        </div>
      </div>

      {/* Examens à venir */}
      {upcomingExams.length > 0 && (
        <div className="mb-8">
          <h2 className="font-display text-2xl text-bone mb-4 flex items-center gap-2">
            <IconCalendar className="w-6 h-6 text-chong" />
            Examens à venir
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingExams.map(exam => {
              const stats = store.getExamStats(exam.id);
              const isSelected = selectedExamId === exam.id;

              return (
                <button
                  key={exam.id}
                  onClick={() => setSelectedExamId(exam.id)}
                  className={`panel p-6 text-left transition-all ${
                    isSelected ? 'border-gold border-2' : 'hover:border-gold/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-display text-lg text-bone">{exam.name}</h3>
                      <p className="text-xs text-dune mt-1">
                        {new Date(exam.date).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <span className={`badge ${getStatusColor(exam.status)}`}>
                      {getStatusLabel(exam.status)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-8 h-8 rounded-full ${getBeltColor(exam.targetBelt.color)}`} />
                    <div>
                      <div className="text-xs text-dune">Objectif</div>
                      <div className="text-sm font-semibold text-bone">{exam.targetBelt.name}</div>
                    </div>
                  </div>

                  {stats && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-dune">Inscrits:</span>
                        <span className="ml-1 font-semibold text-bone">{stats.totalRegistered}</span>
                      </div>
                      <div>
                        <span className="text-dune">Payés:</span>
                        <span className="ml-1 font-semibold text-forest">{stats.totalPaid}</span>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Détail de l'examen sélectionné */}
      {selectedExam && (
        <div className="panel p-6 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl text-bone mb-2">{selectedExam.name}</h2>
              <p className="text-dune">
                {new Date(selectedExam.date).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })} • {selectedExam.location}
              </p>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedExam.status}
                onChange={(e) => store.updateExamStatus(selectedExam.id, e.target.value as ExamStatus)}
                className="input"
              >
                <option value="planifie">Planifié</option>
                <option value="inscrit">Inscriptions ouvertes</option>
                <option value="en_cours">En cours</option>
                <option value="evalue">Évalué</option>
                <option value="reussi">Réussi</option>
                <option value="echoue">Échoué</option>
                <option value="reporte">Reporté</option>
                <option value="annule">Annulé</option>
              </select>
            </div>
          </div>

          {/* Progression de la ceinture */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-bark/50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className={`w-12 h-12 rounded-full ${getBeltColor(selectedExam.previousBelt.color)}`} />
              <div>
                <div className="text-xs text-dune">Ceinture actuelle</div>
                <div className="text-sm font-semibold text-bone">{selectedExam.previousBelt.name}</div>
              </div>
            </div>
            <IconCheck className="w-6 h-6 text-gold" />
            <div className="flex items-center gap-2">
              <div className={`w-12 h-12 rounded-full ${getBeltColor(selectedExam.targetBelt.color)}`} />
              <div>
                <div className="text-xs text-dune">Objectif</div>
                <div className="text-sm font-semibold text-bone">{selectedExam.targetBelt.name}</div>
              </div>
            </div>
          </div>

          {/* Statistiques de l'examen */}
          {(() => {
            const stats = store.getExamStats(selectedExam.id);
            if (!stats) return null;

            return (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-bark/50 p-4 rounded-lg">
                  <div className="text-2xl font-display text-bone">{stats.totalRegistered}</div>
                  <div className="text-xs text-dune">Inscrits</div>
                </div>
                <div className="bg-bark/50 p-4 rounded-lg">
                  <div className="text-2xl font-display text-forest">{stats.totalPaid}</div>
                  <div className="text-xs text-dune">Paiements</div>
                </div>
                <div className="bg-bark/50 p-4 rounded-lg">
                  <div className="text-2xl font-display text-gold">{stats.totalEvaluated}</div>
                  <div className="text-xs text-dune">Évalués</div>
                </div>
                <div className="bg-bark/50 p-4 rounded-lg">
                  <div className="text-2xl font-display text-forest">{stats.passRate}%</div>
                  <div className="text-xs text-dune">Taux de réussite</div>
                </div>
              </div>
            );
          })()}

          {/* Liste des inscrits */}
          <div>
            <h3 className="font-display text-xl text-bone mb-4 flex items-center gap-2">
              <IconUsers className="w-5 h-5 text-gold" />
              Athlètes inscrits ({selectedExam.registeredAthletes.length})
            </h3>
            {selectedExam.registeredAthletes.length === 0 ? (
              <p className="text-dune text-center py-8">Aucun athlète inscrit</p>
            ) : (
              <div className="space-y-2">
                {selectedExam.registeredAthletes.map(registration => {
                  const result = selectedExam.results?.find(r => r.registrationId === registration.id);
                  
                  return (
                    <div
                      key={registration.id}
                      className="flex items-center justify-between p-4 border border-husk rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full ${getBeltColor(registration.currentBelt.color)}`} />
                          <div>
                            <div className="font-semibold text-bone">{registration.athleteName}</div>
                            <div className="text-xs text-dune">
                              {registration.currentBelt.name} → {registration.targetBelt.name}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {registration.paid ? (
                          <span className="badge text-forest">Payé</span>
                        ) : (
                          <span className="badge text-flame">Non payé</span>
                        )}
                        {registration.eligible ? (
                          <span className="badge text-forest">Éligible</span>
                        ) : (
                          <span className="badge text-flame">Non éligible</span>
                        )}
                        {result && (
                          <div className="text-right">
                            <div className={`font-display text-lg ${
                              result.passed ? 'text-forest' : 'text-flame'
                            }`}>
                              {result.finalScore.toFixed(2)}
                            </div>
                            <div className="text-xs text-dune">
                              {result.result === 'reussi' ? 'Réussi' : 
                               result.result === 'conditionnel' ? 'Conditionnel' : 'Échoué'}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Examens passés */}
      {pastExams.length > 0 && (
        <div>
          <h2 className="font-display text-2xl text-bone mb-4 flex items-center gap-2">
            <IconCalendar className="w-6 h-6 text-dune" />
            Examens passés
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastExams.slice(0, 6).map(exam => {
              const stats = store.getExamStats(exam.id);

              return (
                <div key={exam.id} className="panel p-6 opacity-75">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-display text-lg text-bone">{exam.name}</h3>
                      <p className="text-xs text-dune mt-1">
                        {new Date(exam.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <span className={`badge ${getStatusColor(exam.status)}`}>
                      {getStatusLabel(exam.status)}
                    </span>
                  </div>

                  {stats && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-dune">Participants:</span>
                        <span className="ml-1 font-semibold text-bone">{stats.totalEvaluated}</span>
                      </div>
                      <div>
                        <span className="text-dune">Réussite:</span>
                        <span className="ml-1 font-semibold text-forest">{stats.passRate}%</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal de création d'examen */}
      {showCreateExamModal && (
        <CreateExamModal
          belts={store.config.belts}
          onSubmit={handleCreateExam}
          onCancel={() => setShowCreateExamModal(false)}
        />
      )}
    </div>
  );
}

interface CreateExamModalProps {
  belts: Belt[];
  onSubmit: (exam: GradeExam) => void;
  onCancel: () => void;
}

function CreateExamModal({ belts, onSubmit, onCancel }: CreateExamModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    previousBeltId: '',
    targetBeltId: '',
    maxParticipants: 50,
    registrationFee: 50000,
    registrationDeadline: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const previousBelt = belts.find(b => b.id === formData.previousBeltId);
    const targetBelt = belts.find(b => b.id === formData.targetBeltId);

    if (!previousBelt || !targetBelt) return;

    const exam: GradeExam = {
      id: `exam-${Date.now()}`,
      name: formData.name,
      date: formData.date,
      location: formData.location,
      targetBelt,
      previousBelt,
      status: 'planifie',
      organizerId: 'org-1',
      examiners: [],
      maxParticipants: formData.maxParticipants,
      registrationDeadline: formData.registrationDeadline,
      registrationFee: formData.registrationFee,
      registeredAthletes: [],
      evaluationCriteria: {
        techniques: { weight: 40, minScore: 6 },
        poomsae: { weight: 30, minScore: 6 },
        sparring: { weight: 15, minScore: 6 },
        theory: { weight: 10, minScore: 6 },
        breaking: { weight: 5, minScore: 6 },
        attitude: { weight: 0, minScore: 6 }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSubmit(exam);
  };

  return (
    <div className="fixed inset-0 z-50 bg-night/80 flex items-center justify-center p-4">
      <div className="bg-coal border border-husk rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-coal border-b border-husk p-6">
          <h2 className="font-display text-2xl text-bone">Nouvel examen de grade</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="label">Nom de l'examen</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              placeholder="Ex: Passage de grade ceinture verte"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Date limite d'inscription</label>
              <input
                type="date"
                value={formData.registrationDeadline}
                onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                className="input"
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Lieu</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="input"
              placeholder="Ex: Dojang principal, Abidjan"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Ceinture actuelle</label>
              <select
                value={formData.previousBeltId}
                onChange={(e) => setFormData({ ...formData, previousBeltId: e.target.value })}
                className="input"
                required
              >
                <option value="">Sélectionner</option>
                {belts.map(belt => (
                  <option key={belt.id} value={belt.id}>
                    {belt.name} ({belt.color})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Ceinture objectif</label>
              <select
                value={formData.targetBeltId}
                onChange={(e) => setFormData({ ...formData, targetBeltId: e.target.value })}
                className="input"
                required
              >
                <option value="">Sélectionner</option>
                {belts.map(belt => (
                  <option key={belt.id} value={belt.id}>
                    {belt.name} ({belt.color})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Nombre maximum de participants</label>
              <input
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                className="input"
                min="1"
                required
              />
            </div>
            <div>
              <label className="label">Frais d'inscription (FCFA)</label>
              <input
                type="number"
                value={formData.registrationFee}
                onChange={(e) => setFormData({ ...formData, registrationFee: parseInt(e.target.value) })}
                className="input"
                min="0"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-husk">
            <button type="button" onClick={onCancel} className="btn btn-ghost flex-1">
              Annuler
            </button>
            <button type="submit" className="btn btn-primary flex-1">
              <IconCheck className="w-4 h-4" />
              Créer l'examen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

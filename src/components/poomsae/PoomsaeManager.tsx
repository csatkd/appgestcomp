import { useState } from 'react';
import { usePoomsaeStore } from '../../lib/poomsae/usePoomsaeStore';
import { PoomsaeCategoryConfig, PoomsaePerformance, PoomsaeForm, GRADE_TO_FORM } from '../../lib/poomsae/types';
import { PageHead } from '../ui';
import { IconPlus, IconPlay, IconCheck, IconX, IconTrophy } from '../Icons';
import PoomsaeScoringPanel from './PoomsaeScoringPanel';
import CreateCategoryModal from './CreateCategoryModal';
import RegisterAthleteModal from './RegisterAthleteModal';

export default function PoomsaeManager() {
  const store = usePoomsaeStore();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [scoringPerformance, setScoringPerformance] = useState<PoomsaePerformance | null>(null);

  const selectedCategory = selectedCategoryId
    ? store.categories.find(c => c.id === selectedCategoryId)
    : null;

  const categoryPerformances = selectedCategoryId
    ? store.getCategoryPerformances(selectedCategoryId)
    : [];

  const categoryRankings = selectedCategoryId
    ? store.getCategoryRankings(selectedCategoryId)
    : [];

  const categoryStats = selectedCategoryId
    ? store.getCategoryStats(selectedCategoryId)
    : null;

  // ============================================
  // CRÉATION DE CATÉGORIE
  // ============================================

  const handleCreateCategory = (category: PoomsaeCategoryConfig) => {
    store.addCategory(category);
    setShowCategoryModal(false);
  };

  // ============================================
  // INSCRIPTION D'UN ATHLÈTE
  // ============================================

  const handleRegisterAthlete = (performance: PoomsaePerformance) => {
    store.registerPerformance(performance);
    setShowPerformanceModal(false);
  };

  // ============================================
  // GESTION DES PERFORMANCES
  // ============================================

  const handleStartPerformance = (performanceId: string) => {
    store.startPerformance(performanceId);
  };

  const handleOpenScoring = (performance: PoomsaePerformance) => {
    setScoringPerformance(performance);
  };

  const handleScoringSubmit = (scores: any, deductions: number, comments: string) => {
    if (!scoringPerformance) return;

    const judgeScore = {
      judgeId: 'judge-1', // TODO: gérer les vrais juges
      scores,
      deductions,
      comments,
      timestamp: new Date().toISOString()
    };

    store.addJudgeScore(scoringPerformance.id, judgeScore);
    store.endPerformance(scoringPerformance.id);
    setScoringPerformance(null);
  };

  const handleShuffleOrder = () => {
    if (selectedCategoryId) {
      store.shufflePassingOrder(selectedCategoryId);
    }
  };

  // ============================================
  // RENDU
  // ============================================

  return (
    <div className="fade-up mx-auto max-w-7xl">
      <PageHead
        title="Gestion Poomsae"
        subtitle="Compétitions de formes"
        actions={
          <button
            onClick={() => setShowCategoryModal(true)}
            className="btn btn-primary"
          >
            <IconPlus className="w-4 h-4" />
            Nouvelle catégorie
          </button>
        }
      />

      {/* Liste des catégories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {store.categories.map(category => {
          const stats = store.getCategoryStats(category.id);
          const isSelected = selectedCategoryId === category.id;

          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategoryId(category.id)}
              className={`panel p-6 text-left transition-all ${
                isSelected ? 'border-gold border-2' : 'hover:border-gold/50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-display text-lg text-bone">{category.name}</h3>
                  <p className="text-xs text-dune mt-1">
                    {category.type.replace('-', ' ')} • {category.division}
                  </p>
                </div>
                <span className="badge text-gold">
                  {category.beltLevel === 'color' ? 'Couleur' : 'Noire'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-dune">Inscrits:</span>
                  <span className="ml-2 font-semibold text-bone">{stats.total}</span>
                </div>
                <div>
                  <span className="text-dune">Terminés:</span>
                  <span className="ml-2 font-semibold text-forest">{stats.completed}</span>
                </div>
                <div>
                  <span className="text-dune">En cours:</span>
                  <span className="ml-2 font-semibold text-gold">{stats.inProgress}</span>
                </div>
                <div>
                  <span className="text-dune">Score moy:</span>
                  <span className="ml-2 font-semibold text-bone">{stats.avgScore}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Détail de la catégorie sélectionnée */}
      {selectedCategory && categoryStats && (
        <div className="space-y-6">
          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="panel p-4 text-center">
              <div className="font-display text-3xl text-bone">{categoryStats.total}</div>
              <div className="text-xs text-dune mt-1">Total inscrits</div>
            </div>
            <div className="panel p-4 text-center">
              <div className="font-display text-3xl text-forest">{categoryStats.completed}</div>
              <div className="text-xs text-dune mt-1">Terminés</div>
            </div>
            <div className="panel p-4 text-center">
              <div className="font-display text-3xl text-gold">{categoryStats.inProgress}</div>
              <div className="text-xs text-dune mt-1">En cours</div>
            </div>
            <div className="panel p-4 text-center">
              <div className="font-display text-3xl text-bone">{categoryStats.avgScore}</div>
              <div className="text-xs text-dune mt-1">Score moyen</div>
            </div>
            <div className="panel p-4 text-center">
              <div className="font-display text-3xl text-bone">{categoryStats.avgDuration}s</div>
              <div className="text-xs text-dune mt-1">Durée moy.</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowPerformanceModal(true)}
              className="btn btn-primary"
            >
              <IconPlus className="w-4 h-4" />
              Inscrire un athlète
            </button>
            <button
              onClick={handleShuffleOrder}
              className="btn btn-ghost"
            >
              Mélanger l'ordre
            </button>
          </div>

          {/* Classement */}
          {categoryRankings.length > 0 && (
            <div className="panel p-6">
              <h3 className="font-display text-xl text-bone mb-4 flex items-center gap-2">
                <IconTrophy className="w-5 h-5 text-gold" />
                Classement
              </h3>
              <div className="space-y-2">
                {categoryRankings.slice(0, 10).map(({ rank, performance }) => (
                  <div
                    key={performance.id}
                    className="flex items-center gap-4 p-3 border border-husk rounded-lg"
                  >
                    <div className={`font-display text-2xl w-12 text-center ${
                      rank === 1 ? 'text-gold' :
                      rank === 2 ? 'text-gray-300' :
                      rank === 3 ? 'text-orange-400' :
                      'text-dune'
                    }`}>
                      {rank}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-bone">
                        Athlète {performance.athleteId}
                      </div>
                      <div className="text-xs text-dune">{performance.form}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-xl text-gold">
                        {performance.finalScore?.toFixed(2)}
                      </div>
                      <div className="text-xs text-dune">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Liste des performances */}
          <div className="panel p-6">
            <h3 className="font-display text-xl text-bone mb-4">
              Ordre de passage ({categoryPerformances.length})
            </h3>
            <div className="space-y-2">
              {categoryPerformances.map(performance => (
                <div
                  key={performance.id}
                  className="flex items-center gap-4 p-4 border border-husk rounded-lg"
                >
                  <div className="font-display text-xl text-dune w-8">
                    #{performance.order}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-bone">
                      Athlète {performance.athleteId}
                    </div>
                    <div className="text-xs text-dune">{performance.form}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`badge ${
                      performance.status === 'terminee' ? 'text-forest' :
                      performance.status === 'en_cours' ? 'text-gold' :
                      performance.status === 'disqualifie' ? 'text-flame' :
                      'text-dune'
                    }`}>
                      {performance.status === 'terminee' ? 'Terminé' :
                       performance.status === 'en_cours' ? 'En cours' :
                       performance.status === 'disqualifie' ? 'DQ' :
                       'En attente'}
                    </span>

                    {performance.status === 'attente' && (
                      <button
                        onClick={() => handleStartPerformance(performance.id)}
                        className="btn btn-primary btn-sm"
                      >
                        <IconPlay className="w-4 h-4" />
                        Démarrer
                      </button>
                    )}

                    {performance.status === 'en_cours' && (
                      <button
                        onClick={() => handleOpenScoring(performance)}
                        className="btn btn-primary btn-sm"
                      >
                        Noter
                      </button>
                    )}

                    {performance.status === 'terminee' && (
                      <div className="font-display text-lg text-gold">
                        {performance.finalScore?.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal de notation */}
      {scoringPerformance && selectedCategory && (
        <PoomsaeScoringPanel
          categoryId={selectedCategory.id}
          categoryType={selectedCategory.type}
          athleteName={`Athlète ${scoringPerformance.athleteId}`}
          form={scoringPerformance.form}
          onSubmit={handleScoringSubmit}
          onCancel={() => setScoringPerformance(null)}
        />
      )}

      {/* Modal de création de catégorie */}
      {showCategoryModal && (
        <CreateCategoryModal
          onSubmit={handleCreateCategory}
          onCancel={() => setShowCategoryModal(false)}
        />
      )}

      {/* Modal d'inscription d'athlète */}
      {showPerformanceModal && selectedCategory && (
        <RegisterAthleteModal
          categoryId={selectedCategory.id}
          beltLevel={selectedCategory.beltLevel}
          requiredForm={selectedCategory.requiredForm}
          onSubmit={handleRegisterAthlete}
          onCancel={() => setShowPerformanceModal(false)}
        />
      )}
    </div>
  );
}

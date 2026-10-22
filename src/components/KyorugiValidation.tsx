import { useState } from 'react';
import { useApp } from '../lib/store';
import { PageHead } from './ui';
import PageBackground from './PageBackground';
import { PAGE_BACKGROUNDS } from '../config/backgrounds';
import { IconCheck, IconAlert, IconTrophy } from './Icons';

interface ValidationStep {
  id: string;
  name: string;
  module: string;
  check: () => boolean;
  message: string;
}

export default function KyorugiValidation() {
  const { state } = useApp();
  const [validationResults, setValidationResults] = useState<Map<string, boolean>>(new Map());

  const validationSteps: ValidationStep[] = [
    {
      id: 'event-config',
      name: 'Configuration de la compétition',
      module: '/admin',
      check: () => {
        return state.event.name !== '' && 
               state.event.date !== '' && 
               state.event.venue !== '' &&
               state.event.arenas > 0;
      },
      message: 'Compétition configurée'
    },
    {
      id: 'athletes-registered',
      name: 'Athlètes inscrits',
      module: '/athletes',
      check: () => state.athletes.length > 0,
      message: `${state.athletes.length} athlète(s) inscrit(s)`
    },
    {
      id: 'clubs-created',
      name: 'Clubs créés',
      module: '/clubs',
      check: () => state.clubs.length > 0,
      message: `${state.clubs.length} club(s) créé(s)`
    },
    {
      id: 'athletes-weighed',
      name: 'Pesée des athlètes',
      module: '/pesee',
      check: () => {
        const weighed = state.athletes.filter(a => a.status === 'pesé').length;
        return weighed === state.athletes.length && weighed > 0;
      },
      message: `${state.athletes.filter(a => a.status === 'pesé').length}/${state.athletes.length} athlète(s) pesé(s)`
    },
    {
      id: 'categories-assigned',
      name: 'Catégories assignées',
      module: '/pesee',
      check: () => {
        return state.athletes.every(a => a.category !== null);
      },
      message: 'Tous les athlètes ont une catégorie'
    },
    {
      id: 'brackets-generated',
      name: 'Tirages au sort générés',
      module: '/tirages',
      check: () => {
        const categoriesWithBrackets = Object.keys(state.brackets).length;
        return categoriesWithBrackets > 0;
      },
      message: `${Object.keys(state.brackets).length} catégorie(s) avec tirage`
    },
    {
      id: 'matches-created',
      name: 'Matchs créés',
      module: '/tirages',
      check: () => {
        const totalMatches = Object.values(state.brackets)
          .flat()
          .length;
        return totalMatches > 0;
      },
      message: `${Object.values(state.brackets).flat().length} match(s) créé(s)`
    },
    {
      id: 'matches-ready',
      name: 'Matchs prêts à être dirigés',
      module: '/live',
      check: () => {
        const readyMatches = Object.values(state.brackets)
          .flat()
          .filter(m => m.status === 'pret');
        return readyMatches.length > 0;
      },
      message: `${Object.values(state.brackets).flat().filter(m => m.status === 'pret').length} match(s) prêt(s)`
    },
    {
      id: 'matches-completed',
      name: 'Matchs terminés',
      module: '/resultats',
      check: () => {
        const completedMatches = Object.values(state.brackets)
          .flat()
          .filter(m => m.status === 'termine');
        return completedMatches.length > 0;
      },
      message: `${Object.values(state.brackets).flat().filter(m => m.status === 'termine').length} match(s) terminé(s)`
    },
    {
      id: 'results-validated',
      name: 'Résultats validés',
      module: '/resultats',
      check: () => {
        return Object.keys(state.results).length > 0;
      },
      message: `${Object.keys(state.results).length} catégorie(s) avec résultats`
    },
    {
      id: 'referees-assigned',
      name: 'Arbitres assignés',
      module: '/referees',
      check: () => {
        return state.referees.length > 0;
      },
      message: `${state.referees.length} arbitre(s) enregistré(s)`
    },
    {
      id: 'sponsors-active',
      name: 'Sponsors actifs',
      module: '/sponsors',
      check: () => {
        const activeSponsors = state.sponsors.filter(s => s.status === 'actif');
        return activeSponsors.length > 0;
      },
      message: `${state.sponsors.filter(s => s.status === 'actif').length} sponsor(s) actif(s)`
    }
  ];

  const runValidation = () => {
    const results = new Map<string, boolean>();
    validationSteps.forEach(step => {
      results.set(step.id, step.check());
    });
    setValidationResults(results);
  };

  const allValid = validationResults.size > 0 && 
                   Array.from(validationResults.values()).every(v => v);

  const completedSteps = Array.from(validationResults.values()).filter(v => v).length;
  const totalSteps = validationSteps.length;
  const progressPercent = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="fade-up mx-auto max-w-6xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.dashboard} opacity={0.08} blur={3} />
      <PageHead
        title="Validation du Cycle de Vie Kyorugi"
        subtitle="Vérification de tous les modules opérationnels"
      />

      {/* Bouton de validation */}
      <div className="panel p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-xl text-bone mb-2">
              Statut de la Compétition
            </h3>
            <p className="text-dune">
              {validationResults.size === 0 
                ? "Cliquez sur 'Valider' pour vérifier tous les modules"
                : allValid 
                  ? "✅ Tous les modules sont opérationnels - Prêt pour la compétition !"
                  : `⚠️ ${completedSteps}/${totalSteps} modules validés`}
            </p>
          </div>
          <button
            onClick={runValidation}
            className="btn btn-primary"
          >
            <IconCheck className="w-4 h-4" />
            Valider
          </button>
        </div>

        {/* Barre de progression */}
        {validationResults.size > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-dune">Progression</span>
              <span className="text-bone font-semibold">{progressPercent}%</span>
            </div>
            <div className="h-3 bg-husk rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  allValid ? 'bg-forest' : 'bg-gold'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Liste des validations */}
      <div className="space-y-3">
        {validationSteps.map((step) => {
          const isValid = validationResults.get(step.id);
          const isPending = isValid === undefined;

          return (
            <div
              key={step.id}
              className={`panel p-4 flex items-center justify-between ${
                isPending ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isPending ? 'bg-husk' :
                  isValid ? 'bg-forest/20' : 'bg-flame/20'
                }`}>
                  {isPending ? (
                    <span className="text-dune text-xl">?</span>
                  ) : isValid ? (
                    <IconCheck className="w-5 h-5 text-forest" />
                  ) : (
                    <IconAlert className="w-5 h-5 text-flame" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-bone">{step.name}</h4>
                  <p className="text-sm text-dune">{step.message}</p>
                </div>
              </div>
              <a
                href={`#${step.module}`}
                className="btn btn-ghost btn-sm"
              >
                Ouvrir
              </a>
            </div>
          );
        })}
      </div>

      {/* Résumé final */}
      {validationResults.size > 0 && (
        <div className={`panel p-6 mt-6 ${
          allValid ? 'border-2 border-forest' : 'border-2 border-gold'
        }`}>
          <div className="flex items-center gap-4">
            <IconTrophy className={`w-12 h-12 ${allValid ? 'text-forest' : 'text-gold'}`} />
            <div>
              <h3 className="font-display text-2xl text-bone mb-2">
                {allValid ? 'Compétition Prête !' : 'Validation Incomplète'}
              </h3>
              <p className="text-dune">
                {allValid 
                  ? 'Tous les modules sont opérationnels. Vous pouvez démarrer la compétition.'
                  : `${totalSteps - completedSteps} module(s) doivent être complétés avant de démarrer.`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

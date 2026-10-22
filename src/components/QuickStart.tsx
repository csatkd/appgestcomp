import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../lib/store';
import { PageHead, Modal, useToast } from './ui';
import PageBackground from './PageBackground';
import { PAGE_BACKGROUNDS } from '../config/backgrounds';
import { IconCheck, IconChevron, IconUsers, IconCalendar } from './Icons';

interface CompetitionSetup {
  name: string;
  date: string;
  venue: string;
  arenas: number;
}

export default function QuickStart() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const toast = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [setup, setSetup] = useState<CompetitionSetup>({
    name: '',
    date: '',
    venue: '',
    arenas: 2
  });

  const steps = [
    {
      title: 'Configuration de la Compétition',
      description: 'Définir les informations de base',
      icon: IconCalendar,
      action: () => navigate('/admin')
    },
    {
      title: 'Inscription des Athlètes',
      description: 'Ajouter les participants',
      icon: IconUsers,
      action: () => navigate('/athletes')
    },
    {
      title: 'Pesée Officielle',
      description: 'Enregistrer les poids et catégories',
      icon: IconCheck,
      action: () => navigate('/pesee')
    },
    {
      title: 'Tirages au Sort',
      description: 'Générer les brackets',
      icon: IconCheck,
      action: () => navigate('/tirages')
    },
    {
      title: 'Planning des Combats',
      description: 'Assigner les aires et horaires',
      icon: IconCheck,
      action: () => navigate('/schedule')
    },
    {
      title: 'Appel des Athlètes',
      description: 'Vérifier les présences',
      icon: IconCheck,
      action: () => navigate('/call')
    },
    {
      title: 'Live Scoring',
      description: 'Diriger les combats',
      icon: IconCheck,
      action: () => navigate('/live')
    },
    {
      title: 'Validation des Résultats',
      description: 'Officialiser les podiums',
      icon: IconCheck,
      action: () => navigate('/resultats')
    },
    {
      title: 'Génération des Certificats',
      description: 'Créer les certificats officiels',
      icon: IconCheck,
      action: () => navigate('/certificates')
    },
    {
      title: 'Cérémonie de Remise',
      description: 'Afficher les résultats en mode TV',
      icon: IconCheck,
      action: () => navigate('/tv')
    },
    {
      title: 'Rapport Final',
      description: 'Générer le rapport de compétition',
      icon: IconCheck,
      action: () => navigate('/report')
    }
  ];

  const handleQuickSetup = () => {
    if (!setup.name || !setup.date || !setup.venue) {
      toast('Veuillez remplir tous les champs', 'error');
      return;
    }

    // Mettre à jour la configuration de l'événement
    dispatch({
      type: 'UPDATE_EVENT',
      event: {
        ...state.event,
        name: setup.name,
        date: setup.date,
        venue: setup.venue,
        arenas: setup.arenas
      }
    });

    toast('Compétition configurée avec succès !', 'success');
    setCurrentStep(1);
  };

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      steps[currentStep].action();
    }
  };

  const isStepCompleted = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return state.event.name !== '' && state.event.date !== '';
      case 1:
        return state.athletes.length > 0;
      case 2:
        return state.athletes.every(a => a.status === 'pesé');
      case 3:
        return Object.keys(state.brackets).length > 0;
      case 4:
        return Object.values(state.brackets).flat().some(m => m.arenaId);
      case 5:
        return Object.values(state.brackets).flat().some(m => m.called);
      case 6:
        return Object.values(state.brackets).flat().some(m => m.status === 'termine');
      case 7:
        return Object.keys(state.results).length > 0;
      case 8:
        return true; // Certificats générés
      case 9:
        return true; // Cérémonie effectuée
      case 10:
        return true; // Rapport généré
      default:
        return false;
    }
  };

  return (
    <div className="fade-up mx-auto max-w-6xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.dashboard} opacity={0.08} blur={3} />
      <PageHead
        title="Démarrage Rapide"
        subtitle="Configuration guidée de votre compétition"
      />

      {/* Configuration rapide */}
      {currentStep === 0 && (
        <div className="panel p-6 mb-6">
          <h3 className="font-display text-2xl text-bone mb-4">
            Configuration Initiale
          </h3>
          <div className="space-y-4">
            <div>
              <label className="label">Nom de la compétition</label>
              <input
                type="text"
                value={setup.name}
                onChange={(e) => setSetup({ ...setup, name: e.target.value })}
                placeholder="Ex: Championnat National FITKD 2026"
                className="input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Date</label>
                <input
                  type="date"
                  value={setup.date}
                  onChange={(e) => setSetup({ ...setup, date: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Nombre d'aires</label>
                <input
                  type="number"
                  value={setup.arenas}
                  onChange={(e) => setSetup({ ...setup, arenas: parseInt(e.target.value) })}
                  min="1"
                  max="10"
                  className="input"
                />
              </div>
            </div>
            <div>
              <label className="label">Lieu</label>
              <input
                type="text"
                value={setup.venue}
                onChange={(e) => setSetup({ ...setup, venue: e.target.value })}
                placeholder="Ex: Palais des Sports, Abidjan"
                className="input"
              />
            </div>
            <button
              onClick={handleQuickSetup}
              className="btn btn-primary w-full"
            >
              <IconCheck className="w-4 h-4" />
              Configurer la Compétition
            </button>
          </div>
        </div>
      )}

      {/* Étapes du cycle de vie */}
      <div className="panel p-6">
        <h3 className="font-display text-2xl text-bone mb-6">
          Cycle de Vie de la Compétition
        </h3>
        <div className="space-y-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = isStepCompleted(index);
            const isCurrent = index === currentStep;
            const isAccessible = index === 0 || isStepCompleted(index - 1);

            return (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                  isCompleted ? 'border-forest bg-forest/5' :
                  isCurrent ? 'border-gold bg-gold/5' :
                  isAccessible ? 'border-husk hover:border-gold/50 cursor-pointer' :
                  'border-husk opacity-50'
                }`}
                onClick={() => isAccessible && setCurrentStep(index)}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isCompleted ? 'bg-forest text-bone' :
                  isCurrent ? 'bg-gold text-night' :
                  'bg-husk text-dune'
                }`}>
                  {isCompleted ? (
                    <IconCheck className="w-6 h-6" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-bone">
                    Étape {index + 1} : {step.title}
                  </h4>
                  <p className="text-sm text-dune">{step.description}</p>
                </div>
                {isCurrent && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextStep();
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    Commencer
                    <IconChevron className="w-4 h-4 ml-2" />
                  </button>
                )}
                {isCompleted && !isCurrent && (
                  <span className="badge text-forest">Complété</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Progression globale */}
      <div className="panel p-6 mt-6">
        <h3 className="font-display text-xl text-bone mb-4">
          Progression Globale
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-dune">Étapes complétées</span>
            <span className="text-bone font-semibold">
              {steps.filter((_, i) => isStepCompleted(i)).length} / {steps.length}
            </span>
          </div>
          <div className="h-3 bg-husk rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold to-forest transition-all duration-500"
              style={{ 
                width: `${(steps.filter((_, i) => isStepCompleted(i)).length / steps.length) * 100}%` 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

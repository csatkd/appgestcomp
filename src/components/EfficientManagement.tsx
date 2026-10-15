import { useState } from 'react';
import { useApp } from '../lib/store';
import { usePoomsaeStore } from '../lib/poomsae/usePoomsaeStore';
import { PageHead } from './ui';
import PageBackground from './PageBackground';
import { PAGE_BACKGROUNDS } from '../config/backgrounds';
import { 
  IconTrophy, 
  IconUsers, 
  IconCalendar, 
  IconBell, 
  IconCheck,
  IconAlert,
  IconTrendUp,
  IconHandshake
} from './Icons';

export default function EfficientManagement() {
  const appStore = useApp();
  const poomsaeStore = usePoomsaeStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'kyorugi' | 'poomsae' | 'actions'>('overview');

  // Statistiques globales consolidées
  const globalStats = {
    // Kyorugi
    kyorugiAthletes: appStore.state.athletes.length,
    kyorugiWeighed: appStore.state.athletes.filter(a => a.status === 'pesé').length,
    kyorugiMatches: Object.values(appStore.state.brackets).flat().length,
    kyorugiCompleted: Object.values(appStore.state.brackets).flat().filter(m => m.status === 'termine').length,
    kyorugiReady: Object.values(appStore.state.brackets).flat().filter(m => m.status === 'pret').length,
    kyorugiLive: Object.values(appStore.state.brackets).flat().filter(m => m.status === 'encours').length,
    
    // Poomsae
    poomsaeCategories: poomsaeStore.categories.length,
    poomsaePerformances: poomsaeStore.performances.length,
    poomsaeCompleted: poomsaeStore.performances.filter(p => p.status === 'terminee').length,
    poomsaeInProgress: poomsaeStore.performances.filter(p => p.status === 'en_cours').length,
    
    // Commun
    clubs: appStore.state.clubs.length,
    sponsors: appStore.state.sponsors.filter(s => s.status === 'actif').length,
    competitions: appStore.state.competitions.filter(c => c.status === 'active').length,
    claims: appStore.state.claims.filter(c => c.status === 'soumise').length,
  };

  // Alertes prioritaires
  const alerts = [
    {
      type: 'urgent',
      icon: IconAlert,
      message: `${globalStats.kyorugiReady} combat(s) Kyorugi prêt(s) à être dirigé(s)`,
      action: '/live',
      color: 'text-flame'
    },
    {
      type: 'warning',
      icon: IconBell,
      message: `${globalStats.poomsaeInProgress} performance(s) Poomsae en cours`,
      action: '/poomsae',
      color: 'text-gold'
    },
    {
      type: 'info',
      icon: IconUsers,
      message: `${globalStats.kyorugiAthletes - globalStats.kyorugiWeighed} athlète(s) non pesé(s)`,
      action: '/pesee',
      color: 'text-chong'
    },
    {
      type: 'warning',
      icon: IconBell,
      message: `${globalStats.claims} réclamation(s) en attente`,
      action: '/reclamations',
      color: 'text-gold'
    }
  ].filter(alert => {
    if (alert.message.includes('0')) return false;
    return true;
  });

  // Actions rapides
  const quickActions = [
    {
      label: 'Diriger un combat',
      icon: IconTrophy,
      path: '/live',
      description: 'Accéder à la régie live Kyorugi',
      color: 'bg-flame'
    },
    {
      label: 'Noter une performance',
      icon: IconCheck,
      path: '/poomsae',
      description: 'Ouvrir le panneau de notation Poomsae',
      color: 'bg-forest'
    },
    {
      label: 'Gérer les pesées',
      icon: IconUsers,
      path: '/pesee',
      description: 'Enregistrer les poids des athlètes',
      color: 'bg-gold'
    },
    {
      label: 'Voir les réclamations',
      icon: IconBell,
      path: '/reclamations',
      description: 'Traiter les contestations',
      color: 'bg-chong'
    },
    {
      label: 'Calendrier',
      icon: IconCalendar,
      path: '/calendar',
      description: 'Planning des compétitions',
      color: 'bg-gold'
    },
    {
      label: 'Sponsors',
      icon: IconHandshake,
      path: '/sponsors',
      description: 'Gérer les partenaires',
      color: 'bg-forest'
    }
  ];

  return (
    <div className="fade-up mx-auto max-w-7xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.dashboard} opacity={0.08} blur={3} />
      <PageHead
        title="Gestion Efficace"
        subtitle="Tableau de bord centralisé"
      />

      {/* Onglets */}
      <div className="flex gap-2 mb-6 border-b border-husk">
        {(['overview', 'kyorugi', 'poomsae', 'actions'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === tab
                ? 'text-gold border-b-2 border-gold'
                : 'text-dune hover:text-bone'
            }`}
          >
            {tab === 'overview' && 'Vue d\'ensemble'}
            {tab === 'kyorugi' && 'Kyorugi'}
            {tab === 'poomsae' && 'Poomsae'}
            {tab === 'actions' && 'Actions Rapides'}
          </button>
        ))}
      </div>

      {/* Vue d'ensemble */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Alertes prioritaires */}
          {alerts.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-display text-xl text-bone flex items-center gap-2">
                <IconAlert className="w-5 h-5 text-flame" />
                Alertes Prioritaires
              </h3>
              {alerts.map((alert, index) => {
                const Icon = alert.icon;
                return (
                  <a
                    key={index}
                    href={`#${alert.action}`}
                    className="panel p-4 flex items-center gap-4 hover:border-gold transition-colors"
                  >
                    <Icon className={`w-6 h-6 ${alert.color}`} />
                    <div className="flex-1">
                      <p className="text-bone">{alert.message}</p>
                    </div>
                    <span className="text-gold text-sm">→</span>
                  </a>
                );
              })}
            </div>
          )}

          {/* Statistiques globales */}
          <div>
            <h3 className="font-display text-xl text-bone mb-4">Statistiques Globales</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="panel p-6">
                <div className="text-3xl font-display text-bone mb-2">
                  {globalStats.kyorugiAthletes + globalStats.poomsaePerformances}
                </div>
                <div className="text-sm text-dune">Participants totaux</div>
              </div>
              <div className="panel p-6">
                <div className="text-3xl font-display text-forest mb-2">
                  {globalStats.kyorugiCompleted + globalStats.poomsaeCompleted}
                </div>
                <div className="text-sm text-dune">Épreuves terminées</div>
              </div>
              <div className="panel p-6">
                <div className="text-3xl font-display text-gold mb-2">
                  {globalStats.kyorugiLive + globalStats.poomsaeInProgress}
                </div>
                <div className="text-sm text-dune">En cours maintenant</div>
              </div>
              <div className="panel p-6">
                <div className="text-3xl font-display text-chong mb-2">
                  {globalStats.competitions}
                </div>
                <div className="text-sm text-dune">Compétitions actives</div>
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div>
            <h3 className="font-display text-xl text-bone mb-4">Actions Rapides</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <a
                    key={index}
                    href={`#${action.path}`}
                    className="panel p-6 hover:border-gold transition-colors"
                  >
                    <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                      <Icon className="w-6 h-6 text-night" />
                    </div>
                    <h4 className="font-semibold text-bone mb-1">{action.label}</h4>
                    <p className="text-xs text-dune">{action.description}</p>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Onglet Kyorugi */}
      {activeTab === 'kyorugi' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-display text-xl text-bone mb-4">Statistiques Kyorugi</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="panel p-6">
                <div className="text-3xl font-display text-bone mb-2">
                  {globalStats.kyorugiAthletes}
                </div>
                <div className="text-sm text-dune">Athlètes inscrits</div>
              </div>
              <div className="panel p-6">
                <div className="text-3xl font-display text-forest mb-2">
                  {globalStats.kyorugiWeighed}
                </div>
                <div className="text-sm text-dune">Pesées validées</div>
              </div>
              <div className="panel p-6">
                <div className="text-3xl font-display text-gold mb-2">
                  {globalStats.kyorugiMatches}
                </div>
                <div className="text-sm text-dune">Matchs programmés</div>
              </div>
              <div className="panel p-6">
                <div className="text-3xl font-display text-chong mb-2">
                  {globalStats.kyorugiCompleted}
                </div>
                <div className="text-sm text-dune">Matchs terminés</div>
              </div>
            </div>
          </div>

          {/* Taux de progression */}
          <div className="panel p-6">
            <h3 className="font-display text-xl text-bone mb-4">Progression</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-dune">Pesées</span>
                  <span className="text-bone font-semibold">
                    {globalStats.kyorugiAthletes > 0 
                      ? Math.round((globalStats.kyorugiWeighed / globalStats.kyorugiAthletes) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="h-2 bg-husk rounded-full overflow-hidden">
                  <div
                    className="h-full bg-forest transition-all duration-500"
                    style={{
                      width: `${globalStats.kyorugiAthletes > 0 
                        ? (globalStats.kyorugiWeighed / globalStats.kyorugiAthletes) * 100 
                        : 0}%`
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-dune">Matchs terminés</span>
                  <span className="text-bone font-semibold">
                    {globalStats.kyorugiMatches > 0 
                      ? Math.round((globalStats.kyorugiCompleted / globalStats.kyorugiMatches) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="h-2 bg-husk rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold transition-all duration-500"
                    style={{
                      width: `${globalStats.kyorugiMatches > 0 
                        ? (globalStats.kyorugiCompleted / globalStats.kyorugiMatches) * 100 
                        : 0}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions Kyorugi */}
          <div>
            <h3 className="font-display text-xl text-bone mb-4">Actions Kyorugi</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="#/live" className="panel p-6 hover:border-flame transition-colors">
                <IconTrophy className="w-8 h-8 text-flame mb-3" />
                <h4 className="font-semibold text-bone mb-1">Régie Live</h4>
                <p className="text-xs text-dune">{globalStats.kyorugiReady} combat(s) prêt(s)</p>
              </a>
              <a href="#/pesee" className="panel p-6 hover:border-forest transition-colors">
                <IconUsers className="w-8 h-8 text-forest mb-3" />
                <h4 className="font-semibold text-bone mb-1">Pesées</h4>
                <p className="text-xs text-dune">
                  {globalStats.kyorugiAthletes - globalStats.kyorugiWeighed} en attente
                </p>
              </a>
              <a href="#/tirages" className="panel p-6 hover:border-gold transition-colors">
                <IconTrophy className="w-8 h-8 text-gold mb-3" />
                <h4 className="font-semibold text-bone mb-1">Tirages</h4>
                <p className="text-xs text-dune">Générer les brackets</p>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Onglet Poomsae */}
      {activeTab === 'poomsae' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-display text-xl text-bone mb-4">Statistiques Poomsae</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="panel p-6">
                <div className="text-3xl font-display text-bone mb-2">
                  {globalStats.poomsaeCategories}
                </div>
                <div className="text-sm text-dune">Catégories</div>
              </div>
              <div className="panel p-6">
                <div className="text-3xl font-display text-forest mb-2">
                  {globalStats.poomsaePerformances}
                </div>
                <div className="text-sm text-dune">Performances inscrites</div>
              </div>
              <div className="panel p-6">
                <div className="text-3xl font-display text-gold mb-2">
                  {globalStats.poomsaeCompleted}
                </div>
                <div className="text-sm text-dune">Terminées</div>
              </div>
              <div className="panel p-6">
                <div className="text-3xl font-display text-chong mb-2">
                  {globalStats.poomsaeInProgress}
                </div>
                <div className="text-sm text-dune">En cours</div>
              </div>
            </div>
          </div>

          {/* Liste des catégories */}
          {poomsaeStore.categories.length > 0 && (
            <div>
              <h3 className="font-display text-xl text-bone mb-4">Catégories Actives</h3>
              <div className="space-y-3">
                {poomsaeStore.categories.map(category => {
                  const stats = poomsaeStore.getCategoryStats(category.id);
                  return (
                    <a
                      key={category.id}
                      href="#/poomsae"
                      className="panel p-4 flex items-center justify-between hover:border-gold transition-colors"
                    >
                      <div>
                        <h4 className="font-semibold text-bone">{category.name}</h4>
                        <p className="text-xs text-dune mt-1">
                          {stats.total} inscrit(s) • {stats.completed} terminé(s)
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-xl text-gold">
                          {stats.avgScore.toFixed(2)}
                        </div>
                        <div className="text-xs text-dune">Score moy.</div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions Poomsae */}
          <div>
            <h3 className="font-display text-xl text-bone mb-4">Actions Poomsae</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="#/poomsae" className="panel p-6 hover:border-forest transition-colors">
                <IconCheck className="w-8 h-8 text-forest mb-3" />
                <h4 className="font-semibold text-bone mb-1">Gérer les catégories</h4>
                <p className="text-xs text-dune">Créer et configurer les catégories</p>
              </a>
              <a href="#/poomsae" className="panel p-6 hover:border-gold transition-colors">
                <IconTrophy className="w-8 h-8 text-gold mb-3" />
                <h4 className="font-semibold text-bone mb-1">Noter les performances</h4>
                <p className="text-xs text-dune">Panneau de notation professionnel</p>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Onglet Actions Rapides */}
      {activeTab === 'actions' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-display text-xl text-bone mb-4">Toutes les Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <a
                    key={index}
                    href={`#${action.path}`}
                    className="panel p-6 hover:border-gold transition-colors"
                  >
                    <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                      <Icon className="w-6 h-6 text-night" />
                    </div>
                    <h4 className="font-semibold text-bone mb-1">{action.label}</h4>
                    <p className="text-xs text-dune">{action.description}</p>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Raccourcis clavier */}
          <div className="panel p-6">
            <h3 className="font-display text-xl text-bone mb-4">Raccourcis Clavier</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-dune">Recherche</span>
                <kbd className="px-2 py-1 bg-bark border border-husk rounded text-bone">Ctrl+K</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-dune">Dashboard</span>
                <kbd className="px-2 py-1 bg-bark border border-husk rounded text-bone">Ctrl+D</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-dune">Athlètes</span>
                <kbd className="px-2 py-1 bg-bark border border-husk rounded text-bone">Ctrl+A</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-dune">Live Scoring</span>
                <kbd className="px-2 py-1 bg-bark border border-husk rounded text-bone">Ctrl+L</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-dune">Résultats</span>
                <kbd className="px-2 py-1 bg-bark border border-husk rounded text-bone">Ctrl+R</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-dune">Calendrier</span>
                <kbd className="px-2 py-1 bg-bark border border-husk rounded text-bone">Ctrl+C</kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

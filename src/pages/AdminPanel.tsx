import { useState } from 'react';
import { PageHead } from '../components/ui';
import ThemeSwitcher from '../components/ThemeSwitcher';
import PushNotificationsManager from '../components/PushNotificationsManager';
import OnlineStatus from '../components/OnlineStatus';
import CacheManager from '../components/CacheManager';
import PerformanceMonitor from '../components/PerformanceMonitor';
import UpdateNotification from '../components/UpdateNotification';
import { IconSettings, IconDownload, IconUpload, IconTrash } from '../components/Icons';
import { useApp } from '../lib/store';

export default function AdminPanel() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState<'general' | 'cache' | 'performance' | 'data'>('general');

  const handleExportData = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dojang-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        dispatch({ type: 'IMPORT_STATE', state: data });
        alert('Données importées avec succès');
      } catch (error) {
        alert('Erreur lors de l\'importation des données');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer toutes les données ? Cette action est irréversible.')) return;
    
    localStorage.clear();
    indexedDB.deleteDatabase('dojang-db');
    dispatch({ type: 'RESET_ALL' });
    alert('Toutes les données ont été supprimées');
  };

  return (
    <div className="fade-up mx-auto max-w-6xl">
      <PageHead
        title="Panneau d'administration"
        subtitle="Outils avancés et paramètres"
      />

      <UpdateNotification />

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-husk">
        {(['general', 'cache', 'performance', 'data'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === tab
                ? 'text-gold border-b-2 border-gold'
                : 'text-dune hover:text-bone'
            }`}
          >
            {tab === 'general' && 'Général'}
            {tab === 'cache' && 'Cache'}
            {tab === 'performance' && 'Performance'}
            {tab === 'data' && 'Données'}
          </button>
        ))}
      </div>

      {/* General Tab */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="panel p-6">
            <h3 className="font-semibold text-bone mb-4 flex items-center gap-2">
              <IconSettings className="w-5 h-5 text-gold" />
              Paramètres généraux
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-bone">Thème</p>
                  <p className="text-sm text-dune">Choisir le thème de l'application</p>
                </div>
                <ThemeSwitcher />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-bone">Notifications push</p>
                  <p className="text-sm text-dune">Activer les notifications en temps réel</p>
                </div>
                <PushNotificationsManager />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-bone">Statut de connexion</p>
                  <p className="text-sm text-dune">État de la connexion réseau</p>
                </div>
                <OnlineStatus />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cache Tab */}
      {activeTab === 'cache' && (
        <div className="space-y-6">
          <CacheManager />
          <div className="panel p-6">
            <h3 className="font-semibold text-bone mb-4">Informations sur le cache</h3>
            <div className="space-y-2 text-sm">
              <p className="text-dune">
                Le cache IndexedDB stocke les données de l'application pour un accès rapide et un fonctionnement hors-ligne.
              </p>
              <p className="text-dune">
                Le Service Worker met en cache les ressources statiques pour améliorer les performances.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <PerformanceMonitor />
          <div className="panel p-6">
            <h3 className="font-semibold text-bone mb-4">Optimisations</h3>
            <ul className="space-y-2 text-sm text-dune">
              <li>✓ Virtualisation des listes longues</li>
              <li>✓ Cache IndexedDB pour les données fréquentes</li>
              <li>✓ Service Worker pour le mode hors-ligne</li>
              <li>✓ Compression du bundle JavaScript</li>
              <li>✓ Lazy loading des composants</li>
              <li>✓ Optimisation des re-renders React</li>
            </ul>
          </div>
        </div>
      )}

      {/* Data Tab */}
      {activeTab === 'data' && (
        <div className="space-y-6">
          <div className="panel p-6">
            <h3 className="font-semibold text-bone mb-4 flex items-center gap-2">
              <IconDownload className="w-5 h-5 text-gold" />
              Exporter les données
            </h3>
            <p className="text-sm text-dune mb-4">
              Exportez toutes les données de l'application au format JSON pour sauvegarde ou migration.
            </p>
            <button onClick={handleExportData} className="btn btn-primary">
              <IconDownload className="w-4 h-4" />
              Exporter en JSON
            </button>
          </div>

          <div className="panel p-6">
            <h3 className="font-semibold text-bone mb-4 flex items-center gap-2">
              <IconUpload className="w-5 h-5 text-gold" />
              Importer les données
            </h3>
            <p className="text-sm text-dune mb-4">
              Importez des données depuis un fichier JSON de sauvegarde.
            </p>
            <label className="btn btn-ghost cursor-pointer">
              <IconUpload className="w-4 h-4" />
              Importer depuis JSON
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
          </div>

          <div className="panel p-6 border-flame">
            <h3 className="font-semibold text-flame mb-4 flex items-center gap-2">
              <IconTrash className="w-5 h-5" />
              Zone dangereuse
            </h3>
            <p className="text-sm text-dune mb-4">
              Cette action supprimera définitivement toutes les données de l'application.
            </p>
            <button onClick={handleClearAllData} className="btn btn-danger">
              <IconTrash className="w-4 h-4" />
              Supprimer toutes les données
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

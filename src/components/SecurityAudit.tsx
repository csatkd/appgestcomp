import { useState, useEffect } from 'react';
import { getSecurityLogs, clearSecurityLogs } from '../utils/security';
import { PageHead } from './ui';
import { IconShield, IconTrash, IconDownload } from './Icons';

export default function SecurityAudit() {
  const [logs, setLogs] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'info' | 'warning' | 'error'>('all');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = () => {
    const securityLogs = getSecurityLogs();
    setLogs(securityLogs);
  };

  const handleClear = () => {
    if (!confirm('Êtes-vous sûr de vouloir effacer tous les logs de sécurité ?')) return;
    clearSecurityLogs();
    loadLogs();
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `security-logs-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredLogs = filter === 'all' ? logs : logs.filter(log => log.level === filter);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'text-flame border-flame';
      case 'warning':
        return 'text-gold border-gold';
      case 'info':
        return 'text-forest border-forest';
      default:
        return 'text-dune border-husk';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📝';
    }
  };

  return (
    <div className="fade-up mx-auto max-w-6xl">
      <PageHead
        title="Audit de Sécurité"
        subtitle="Journal des événements de sécurité"
        actions={
          <>
            <button onClick={handleExport} className="btn btn-ghost btn-sm">
              <IconDownload className="w-4 h-4" />
              Exporter
            </button>
            <button onClick={handleClear} className="btn btn-danger btn-sm">
              <IconTrash className="w-4 h-4" />
              Effacer
            </button>
          </>
        }
      />

      {/* Statistiques */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="panel p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-dune">Total</p>
          <p className="font-display text-3xl text-bone mt-2">{logs.length}</p>
        </div>
        <div className="panel p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-dune">Erreurs</p>
          <p className="font-display text-3xl text-flame mt-2">
            {logs.filter(l => l.level === 'error').length}
          </p>
        </div>
        <div className="panel p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-dune">Avertissements</p>
          <p className="font-display text-3xl text-gold mt-2">
            {logs.filter(l => l.level === 'warning').length}
          </p>
        </div>
        <div className="panel p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-dune">Info</p>
          <p className="font-display text-3xl text-forest mt-2">
            {logs.filter(l => l.level === 'info').length}
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-6">
        {(['all', 'error', 'warning', 'info'] as const).map((level) => (
          <button
            key={level}
            onClick={() => setFilter(level)}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
              filter === level
                ? 'bg-gold text-night'
                : 'bg-bark text-dune hover:text-bone'
            }`}
          >
            {level === 'all' ? 'Tous' : level}
          </button>
        ))}
      </div>

      {/* Liste des logs */}
      <div className="panel">
        <div className="border-b border-husk px-6 py-4">
          <h3 className="flex items-center gap-2.5 font-display text-xl uppercase tracking-wide text-bone">
            <IconShield className="h-5 w-5 text-gold" />
            Journal de sécurité
          </h3>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center">
            <IconShield className="w-16 h-16 text-dune/30 mx-auto mb-4" />
            <p className="text-dune">Aucun log de sécurité</p>
          </div>
        ) : (
          <div className="divide-y divide-husk/60 max-h-[600px] overflow-y-auto">
            {filteredLogs.map((log, index) => (
              <div key={index} className="p-4 hover:bg-bark/50 transition-colors">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getLevelIcon(log.level)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`badge ${getLevelColor(log.level)}`}>
                        {log.level}
                      </span>
                      <span className="font-mono text-xs text-dune">
                        {new Date(log.timestamp).toLocaleString('fr-FR')}
                      </span>
                    </div>
                    <p className="font-semibold text-bone">{log.event}</p>
                    {log.details && Object.keys(log.details).length > 0 && (
                      <div className="mt-2 text-sm text-dune">
                        <pre className="bg-bark p-2 rounded overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </div>
                    )}
                    <div className="mt-2 text-xs text-dune/60">
                      <p>URL: {log.url}</p>
                      <p>User-Agent: {log.userAgent}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

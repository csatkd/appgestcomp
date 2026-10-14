import { useState, useEffect } from 'react';
import { IconActivity, IconCpu, IconHardDrive } from './Icons';

interface PerformanceMetrics {
  loadTime: number;
  memoryUsage: number;
  cacheSize: number;
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    memoryUsage: 0,
    cacheSize: 0,
  });

  useEffect(() => {
    // Mesurer le temps de chargement
    const loadTime = performance.now();
    setMetrics((prev) => ({ ...prev, loadTime: Math.round(loadTime) }));

    // Mesurer l'utilisation de la mémoire (si disponible)
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      setMetrics((prev) => ({
        ...prev,
        memoryUsage: Math.round(memory.usedJSHeapSize / 1048576), // Convertir en MB
      }));
    }

    // Estimer la taille du cache
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then((estimate) => {
        setMetrics((prev) => ({
          ...prev,
          cacheSize: Math.round((estimate.usage || 0) / 1048576), // Convertir en MB
        }));
      });
    }
  }, []);

  return (
    <div className="panel p-4">
      <h3 className="font-semibold text-bone mb-3 flex items-center gap-2">
        <IconActivity className="w-5 h-5 text-gold" />
        Performance
      </h3>
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-dune flex items-center gap-2">
            <IconCpu className="w-4 h-4" />
            Temps de chargement
          </span>
          <span className="text-bone font-mono">{metrics.loadTime} ms</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-dune flex items-center gap-2">
            <IconActivity className="w-4 h-4" />
            Mémoire utilisée
          </span>
          <span className="text-bone font-mono">{metrics.memoryUsage} MB</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-dune flex items-center gap-2">
            <IconHardDrive className="w-4 h-4" />
            Taille du cache
          </span>
          <span className="text-bone font-mono">{metrics.cacheSize} MB</span>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useIndexedDB } from '../hooks/useIndexedDB';
import { IconDatabase, IconTrash } from './Icons';

export default function CacheManager() {
  const { isReady, getAll, clear } = useIndexedDB();
  const [cacheSize, setCacheSize] = useState(0);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    if (isReady) {
      loadCacheSize();
    }
  }, [isReady]);

  const loadCacheSize = async () => {
    const items = await getAll();
    setCacheSize(items.length);
  };

  const handleClear = async () => {
    if (!confirm('Êtes-vous sûr de vouloir vider le cache ?')) return;
    
    setIsClearing(true);
    await clear();
    await loadCacheSize();
    setIsClearing(false);
  };

  if (!isReady) return null;

  return (
    <div className="panel p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <IconDatabase className="w-5 h-5 text-gold" />
          <div>
            <p className="font-semibold text-bone">Cache IndexedDB</p>
            <p className="text-xs text-dune">{cacheSize} élément(s) en cache</p>
          </div>
        </div>
        <button
          onClick={handleClear}
          disabled={isClearing || cacheSize === 0}
          className="btn btn-ghost btn-sm"
          title="Vider le cache"
        >
          <IconTrash className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

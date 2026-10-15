import { useServiceWorker } from '../hooks/useServiceWorker';
import { IconRefresh } from './Icons';

export default function UpdateNotification() {
  const { updateAvailable, skipWaiting } = useServiceWorker();

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[200] bg-gold text-night px-6 py-4 rounded-lg shadow-lg animate-fade-in">
      <div className="flex items-center gap-3">
        <IconRefresh className="w-6 h-6 animate-spin" />
        <div>
          <p className="font-bold">Mise à jour disponible</p>
          <p className="text-sm">Une nouvelle version est prête</p>
        </div>
        <button
          onClick={skipWaiting}
          className="ml-4 px-4 py-2 bg-night text-gold rounded hover:bg-bark transition-colors"
        >
          Mettre à jour
        </button>
      </div>
    </div>
  );
}

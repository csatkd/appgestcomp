import { useState, useEffect } from 'react';
import { IconWifi, IconWifiOff } from './Icons';

export default function OnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      {isOnline ? (
        <>
          <IconWifi className="w-4 h-4 text-forest" />
          <span className="text-xs text-forest">En ligne</span>
        </>
      ) : (
        <>
          <IconWifiOff className="w-4 h-4 text-flame" />
          <span className="text-xs text-flame">Hors ligne</span>
        </>
      )}
    </div>
  );
}

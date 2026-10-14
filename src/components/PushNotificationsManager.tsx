import { usePushNotifications } from '../hooks/usePushNotifications';
import { IconBell, IconBellOff } from './Icons';

export default function PushNotificationsManager() {
  const { permission, isSupported, requestPermission, sendNotification } = usePushNotifications();

  if (!isSupported) return null;

  const handleToggle = async () => {
    if (permission === 'granted') {
      // Désactiver les notifications
      sendNotification('Notifications désactivées', {
        body: 'Vous ne recevrez plus de notifications push',
      });
    } else {
      // Activer les notifications
      const result = await requestPermission();
      if (result === 'granted') {
        sendNotification('Notifications activées', {
          body: 'Vous recevrez maintenant des notifications push',
        });
      }
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-lg transition-all hover:bg-bark"
      title={permission === 'granted' ? 'Désactiver les notifications' : 'Activer les notifications'}
    >
      {permission === 'granted' ? (
        <IconBell className="w-5 h-5 text-gold" />
      ) : (
        <IconBellOff className="w-5 h-5 text-dune" />
      )}
    </button>
  );
}

import { useState, useEffect } from 'react';
import { IconBell, IconX, IconCheck, IconAlert, IconInfo } from './Icons';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const stored = localStorage.getItem('dojang_notifications');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('dojang_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (type: Notification['type'], title: string, message: string) => {
    const notification: Notification = {
      id: `notif-${Date.now()}`,
      type,
      title,
      message,
      timestamp: Date.now(),
      read: false
    };
    setNotifications(prev => [notification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
  };
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();

  if (!isOpen) return null;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <IconCheck className="w-5 h-5 text-forest" />;
      case 'error': return <IconX className="w-5 h-5 text-flame" />;
      case 'warning': return <IconAlert className="w-5 h-5 text-gold" />;
      case 'info': return <IconInfo className="w-5 h-5 text-chong" />;
    }
  };

  const getBorderColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'border-l-forest';
      case 'error': return 'border-l-flame';
      case 'warning': return 'border-l-gold';
      case 'info': return 'border-l-chong';
    }
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes}min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${days}j`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-night/80 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-coal border border-husk rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-coal border-b border-husk p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IconBell className="w-6 h-6 text-gold" />
            <h2 className="text-xl font-display text-bone">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-flame text-bone text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-dune hover:text-bone transition-colors">
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Actions */}
        {notifications.length > 0 && (
          <div className="border-b border-husk p-3 flex gap-2">
            <button
              onClick={markAllAsRead}
              className="btn btn-ghost btn-sm flex-1"
              disabled={unreadCount === 0}
            >
              Tout marquer comme lu
            </button>
            <button
              onClick={clearAll}
              className="btn btn-danger btn-sm"
            >
              Tout effacer
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="max-h-[600px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-12 text-center">
              <IconBell className="w-16 h-16 text-dune/30 mx-auto mb-4" />
              <p className="text-dune">Aucune notification</p>
            </div>
          ) : (
            <div className="divide-y divide-husk/50">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-l-4 ${getBorderColor(notification.type)} ${
                    !notification.read ? 'bg-bark/30' : ''
                  } hover:bg-bark/50 transition-colors`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-bone text-sm">
                          {notification.title}
                        </h3>
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-dune hover:text-flame transition-colors flex-shrink-0"
                        >
                          <IconX className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-dune mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-dune/60">
                          {formatTime(notification.timestamp)}
                        </span>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-gold hover:text-bone transition-colors"
                          >
                            Marquer comme lu
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function NotificationButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount } = useNotifications();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-dune hover:text-gold transition-colors"
        title="Notifications"
      >
        <IconBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-flame text-bone text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>
      <NotificationPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

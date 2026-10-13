import { useState } from "react";
import { useApp } from "../lib/store";
import { PageHead, useToast } from "../components/ui";
import { IconBell, IconPlus, IconTrash } from "../components/Icons";
import PageBackground from "../components/PageBackground";
import { PAGE_BACKGROUNDS } from "../config/backgrounds";

interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export default function Notifications() {
  const { state } = useApp();
  const toast = useToast();
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem("dojang_notifications");
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: "info" as Notification["type"],
    title: "",
    message: "",
  });

  const saveNotifications = (notifs: Notification[]) => {
    setNotifications(notifs);
    localStorage.setItem("dojang_notifications", JSON.stringify(notifs));
  };

  const addNotification = () => {
    if (!formData.title || !formData.message) {
      toast("Veuillez remplir tous les champs");
      return;
    }

    const newNotification: Notification = {
      id: Date.now().toString(),
      type: formData.type,
      title: formData.title,
      message: formData.message,
      date: new Date().toISOString(),
      read: false,
    };

    saveNotifications([newNotification, ...notifications]);
    setFormData({ type: "info", title: "", message: "" });
    setShowForm(false);
    toast("Notification ajoutée");
  };

  const deleteNotification = (id: string) => {
    saveNotifications(notifications.filter(n => n.id !== id));
    toast("Notification supprimée");
  };

  const markAsRead = (id: string) => {
    saveNotifications(
      notifications.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    saveNotifications(notifications.map(n => ({ ...n, read: true })));
    toast("Toutes les notifications marquées comme lues");
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "success": return "text-forest border-forest";
      case "warning": return "text-gold border-gold";
      case "error": return "text-flame border-flame";
      default: return "text-chong border-chong";
    }
  };

  const getTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success": return "✓";
      case "warning": return "⚠";
      case "error": return "✕";
      default: return "ℹ";
    }
  };

  return (
    <div className="fade-up mx-auto max-w-6xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.dashboard} opacity={0.08} blur={3} />
      <PageHead
        title="Notifications"
        subtitle="Centre de messages et alertes"
        actions={
          <>
            <button onClick={markAllAsRead} className="btn btn-ghost btn-sm">
              Tout marquer comme lu
            </button>
            <button onClick={() => setShowForm(!showForm)} className="btn btn-primary btn-sm">
              <IconPlus className="w-4 h-4" />
              Nouvelle notification
            </button>
          </>
        }
      />

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="panel p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-dune mb-2">Total</p>
          <p className="font-display text-3xl text-bone">{notifications.length}</p>
        </div>
        <div className="panel p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-dune mb-2">Non lues</p>
          <p className="font-display text-3xl text-flame">{unreadCount}</p>
        </div>
        <div className="panel p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-dune mb-2">Lues</p>
          <p className="font-display text-3xl text-forest">{notifications.length - unreadCount}</p>
        </div>
        <div className="panel p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-dune mb-2">Aujourd'hui</p>
          <p className="font-display text-3xl text-bone">
            {notifications.filter(n => {
              const today = new Date();
              const notifDate = new Date(n.date);
              return notifDate.toDateString() === today.toDateString();
            }).length}
          </p>
        </div>
      </div>

      {/* Formulaire d'ajout */}
      {showForm && (
        <div className="panel p-6 mb-6">
          <h3 className="font-display text-xl uppercase tracking-wide text-bone mb-4">
            Nouvelle notification
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-mono text-dune mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="input w-full"
              >
                <option value="info">Information</option>
                <option value="success">Succès</option>
                <option value="warning">Avertissement</option>
                <option value="error">Erreur</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-mono text-dune mb-2">Titre</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input w-full"
                placeholder="Titre de la notification"
              />
            </div>
            <div>
              <label className="block text-sm font-mono text-dune mb-2">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="input w-full"
                rows={3}
                placeholder="Contenu de la notification"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={addNotification} className="btn btn-primary">
                Ajouter
              </button>
              <button onClick={() => setShowForm(false)} className="btn btn-ghost">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Liste des notifications */}
      <div className="panel p-6">
        <h3 className="font-display text-xl uppercase tracking-wide text-bone mb-4">
          Toutes les notifications
        </h3>
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <IconBell className="w-16 h-16 text-dune mx-auto mb-4" />
            <p className="text-dune">Aucune notification</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`border-l-4 p-4 transition-colors ${
                  notif.read ? "bg-bark/20" : "bg-bark/40"
                } ${getTypeColor(notif.type)}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{getTypeIcon(notif.type)}</span>
                      <h4 className="font-semibold text-bone">{notif.title}</h4>
                      {!notif.read && (
                        <span className="badge bg-flame text-night text-xs">Nouveau</span>
                      )}
                    </div>
                    <p className="text-sm text-dune mb-2">{notif.message}</p>
                    <p className="text-xs text-dune">
                      {new Date(notif.date).toLocaleString("fr-FR")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!notif.read && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="btn btn-ghost btn-sm"
                      >
                        Marquer comme lu
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notif.id)}
                      className="btn btn-ghost btn-sm text-flame hover:bg-flame/10"
                    >
                      <IconTrash className="w-4 h-4" />
                    </button>
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

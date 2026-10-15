import { useState, useMemo } from "react";
import { useApp } from "../lib/store";
import { PageHead, useToast } from "../components/ui";
import { IconBell, IconCheck, IconTrash } from "../components/Icons";
import PageBackground from "../components/PageBackground";
import { PAGE_BACKGROUNDS } from "../config/backgrounds";

export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function Notifications() {
  const { state } = useApp();
  const toast = useToast();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  // Générer des notifications basées sur l'état actuel
  const notifications = useMemo(() => {
    const notifs: Notification[] = [];

    // Notifications de pesée
    const pendingWeighIns = state.athletes.filter((a) => a.status === "inscrit").length;
    if (pendingWeighIns > 0) {
      notifs.push({
        id: "weigh-in-pending",
        type: "warning",
        title: "Pesées en attente",
        message: `${pendingWeighIns} athlète(s) n'ont pas encore été pesé(s)`,
        timestamp: new Date().toISOString(),
        read: false,
      });
    }

    // Notifications de tirages
    const openCategories = Object.entries(state.catStatus).filter(
      ([, status]) => status === "ouverte"
    ).length;
    if (openCategories > 0) {
      notifs.push({
        id: "brackets-pending",
        type: "info",
        title: "Tirages à générer",
        message: `${openCategories} catégorie(s) n'ont pas encore de tirage au sort`,
        timestamp: new Date().toISOString(),
        read: false,
      });
    }

    // Notifications de réclamations
    const pendingClaims = state.claims.filter((c) => c.status === "soumise").length;
    if (pendingClaims > 0) {
      notifs.push({
        id: "claims-pending",
        type: "error",
        title: "Réclamations en attente",
        message: `${pendingClaims} réclamation(s) doivent être traitée(s)`,
        timestamp: new Date().toISOString(),
        read: false,
      });
    }

    // Notifications de matchs
    const readyMatches = Object.values(state.brackets)
      .flat()
      .filter((m) => m.status === "pret").length;
    if (readyMatches > 0) {
      notifs.push({
        id: "matches-ready",
        type: "success",
        title: "Matchs prêts",
        message: `${readyMatches} match(s) sont prêts à être dirigé(s)`,
        timestamp: new Date().toISOString(),
        read: false,
      });
    }

    // Notifications de compétitions
    const activeComps = state.competitions.filter((c) => c.status === "active").length;
    if (activeComps > 0) {
      notifs.push({
        id: "comps-active",
        type: "info",
        title: "Compétitions actives",
        message: `${activeComps} compétition(s) en cours`,
        timestamp: new Date().toISOString(),
        read: false,
      });
    }

    return notifs;
  }, [state]);

  const filteredNotifications = useMemo(() => {
    if (filter === "unread") {
      return notifications.filter((n) => !n.read);
    }
    return notifications;
  }, [notifications, filter]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "info": return "border-chong bg-chong/10";
      case "success": return "border-forest bg-forest/10";
      case "warning": return "border-gold bg-gold/10";
      case "error": return "border-flame bg-flame/10";
    }
  };

  const getTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "info": return "ℹ";
      case "success": return "✓";
      case "warning": return "⚠";
      case "error": return "✗";
    }
  };

  const markAsRead = (id: string) => {
    toast("Notification marquée comme lue");
  };

  const markAllAsRead = () => {
    toast("Toutes les notifications marquées comme lues");
  };

  return (
    <div className="fade-up mx-auto max-w-4xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.dashboard} opacity={0.08} blur={3} />
      <PageHead
        title="Notifications"
        subtitle="Alertes et messages"
        actions={
          unreadCount > 0 && (
            <button onClick={markAllAsRead} className="btn btn-ghost btn-sm">
              <IconCheck className="w-4 h-4" />
              Tout marquer comme lu
            </button>
          )
        }
      />

      {/* Statistiques */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="panel p-4">
          <div className="flex items-center gap-2 mb-2">
            <IconBell className="w-5 h-5 text-gold" />
            <span className="font-mono text-xs uppercase tracking-wider text-dune">
              Total
            </span>
          </div>
          <p className="font-display text-2xl text-bone">{notifications.length}</p>
        </div>
        <div className="panel p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-5 bg-flame rounded-full flex items-center justify-center text-white text-xs">
              {unreadCount}
            </span>
            <span className="font-mono text-xs uppercase tracking-wider text-dune">
              Non lues
            </span>
          </div>
          <p className="font-display text-2xl text-flame">{unreadCount}</p>
        </div>
        <div className="panel p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs uppercase tracking-wider text-dune">
              Filtre
            </span>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | "unread")}
            className="input text-sm"
          >
            <option value="all">Toutes</option>
            <option value="unread">Non lues</option>
          </select>
        </div>
      </div>

      {/* Liste des notifications */}
      {filteredNotifications.length === 0 ? (
        <div className="panel p-12 text-center">
          <IconBell className="w-16 h-16 text-dune/30 mx-auto mb-4" />
          <p className="text-dune text-lg">Aucune notification</p>
          <p className="text-dune text-sm mt-2">
            {filter === "unread"
              ? "Toutes les notifications ont été lues"
              : "Vous n'avez pas de notifications pour le moment"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`panel border-l-4 p-5 ${getTypeColor(notif.type)} ${
                !notif.read ? "ring-2 ring-gold/20" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-night/50 flex items-center justify-center text-xl">
                  {getTypeIcon(notif.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-bone">{notif.title}</h3>
                    {!notif.read && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="btn btn-ghost btn-sm flex-shrink-0"
                        title="Marquer comme lu"
                      >
                        <IconCheck className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-dune mb-2">{notif.message}</p>
                  <p className="text-xs text-dune/60">
                    {new Date(notif.timestamp).toLocaleString("fr-FR")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions rapides */}
      {notifications.length > 0 && (
        <div className="panel p-6 mt-6">
          <h3 className="font-display text-lg uppercase tracking-wide text-bone mb-4">
            Actions rapides
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a href="#/pesee" className="btn btn-ghost">
              Aller aux pesées
            </a>
            <a href="#/tirages" className="btn btn-ghost">
              Générer les tirages
            </a>
            <a href="#/live" className="btn btn-ghost">
              Diriger les matchs
            </a>
            <a href="#/reclamations" className="btn btn-ghost">
              Traiter les réclamations
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

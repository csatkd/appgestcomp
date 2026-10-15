import { useState, useEffect } from 'react';
import { useApp } from '../lib/store';
import { IconUsers, IconTrophy, IconCalendar, IconHandshake, IconBell, IconGrid } from './Icons';

export interface Widget {
  id: string;
  type: 'stats' | 'recent' | 'quick-actions' | 'notifications' | 'upcoming';
  title: string;
  enabled: boolean;
  order: number;
  size: 'small' | 'medium' | 'large';
}

const DEFAULT_WIDGETS: Widget[] = [
  { id: 'stats', type: 'stats', title: 'Statistiques', enabled: true, order: 0, size: 'large' },
  { id: 'recent', type: 'recent', title: 'Activité récente', enabled: true, order: 1, size: 'medium' },
  { id: 'quick-actions', type: 'quick-actions', title: 'Actions rapides', enabled: true, order: 2, size: 'medium' },
  { id: 'notifications', type: 'notifications', title: 'Notifications', enabled: true, order: 3, size: 'medium' },
  { id: 'upcoming', type: 'upcoming', title: 'Événements à venir', enabled: true, order: 4, size: 'medium' },
];

const STORAGE_KEY = 'dojang_dashboard_widgets';

export function useDashboardWidgets() {
  const [widgets, setWidgets] = useState<Widget[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_WIDGETS;
    } catch {
      return DEFAULT_WIDGETS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
  }, [widgets]);

  const toggleWidget = (id: string) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w))
    );
  };

  const updateWidgetSize = (id: string, size: Widget['size']) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, size } : w))
    );
  };

  const reorderWidgets = (fromIndex: number, toIndex: number) => {
    setWidgets((prev) => {
      const newWidgets = [...prev];
      const [removed] = newWidgets.splice(fromIndex, 1);
      newWidgets.splice(toIndex, 0, removed);
      return newWidgets.map((w, i) => ({ ...w, order: i }));
    });
  };

  const resetToDefault = () => {
    setWidgets(DEFAULT_WIDGETS);
  };

  const enabledWidgets = widgets.filter((w) => w.enabled).sort((a, b) => a.order - b.order);

  return {
    widgets,
    enabledWidgets,
    toggleWidget,
    updateWidgetSize,
    reorderWidgets,
    resetToDefault,
  };
}

// Composants de widgets individuels
export function StatsWidget() {
  const { state } = useApp();

  const stats = [
    {
      icon: IconUsers,
      label: 'Athlètes',
      value: state.athletes.length,
      color: 'text-gold',
    },
    {
      icon: IconTrophy,
      label: 'Matchs terminés',
      value: Object.values(state.brackets)
        .flat()
        .filter((m) => m.status === 'termine').length,
      color: 'text-forest',
    },
    {
      icon: IconCalendar,
      label: 'Compétitions',
      value: state.competitions.length,
      color: 'text-chong',
    },
    {
      icon: IconHandshake,
      label: 'Sponsors',
      value: state.sponsors.filter((s) => s.status === 'actif').length,
      color: 'text-flame',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="panel p-4">
            <div className="flex items-center gap-3 mb-2">
              <Icon className={`h-5 w-5 ${stat.color}`} />
              <span className="text-xs uppercase tracking-wider text-dune">
                {stat.label}
              </span>
            </div>
            <p className="font-display text-3xl text-bone">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
}

export function QuickActionsWidget() {
  const actions = [
    { label: 'Nouvel athlète', path: '/athletes', icon: IconUsers },
    { label: 'Live Scoring', path: '/live', icon: IconTrophy },
    { label: 'Calendrier', path: '/calendar', icon: IconCalendar },
    { label: 'Sponsors', path: '/sponsors', icon: IconHandshake },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <a
            key={action.path}
            href={`#${action.path}`}
            className="panel p-4 flex items-center gap-3 hover:bg-bark transition-colors"
          >
            <Icon className="h-5 w-5 text-gold" />
            <span className="text-sm font-semibold text-bone">{action.label}</span>
          </a>
        );
      })}
    </div>
  );
}

export function NotificationsWidget() {
  const { state } = useApp();
  const recentActivity = state.activity?.slice(0, 5) || [];

  if (recentActivity.length === 0) {
    return (
      <div className="panel p-6 text-center text-dune">
        Aucune notification récente
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {recentActivity.map((activity) => (
        <div key={activity.id} className="panel p-3 flex items-start gap-3">
          <IconBell className="h-4 w-4 text-gold mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-bone truncate">{activity.label}</p>
            <p className="text-xs text-dune mt-1">
              {new Date(activity.time).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function UpcomingEventsWidget() {
  const { state } = useApp();
  const now = new Date();
  const upcoming = state.competitions
    .filter((c) => new Date(c.startDate) > now)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 3);

  if (upcoming.length === 0) {
    return (
      <div className="panel p-6 text-center text-dune">
        Aucun événement à venir
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {upcoming.map((comp) => (
        <div key={comp.id} className="panel p-4">
          <p className="font-semibold text-bone mb-1">{comp.name}</p>
          <p className="text-xs text-dune">
            {new Date(comp.startDate).toLocaleDateString('fr-FR')}
          </p>
          <p className="text-xs text-dune mt-1">{comp.venue}</p>
        </div>
      ))}
    </div>
  );
}

export function RecentActivityWidget() {
  const { state } = useApp();
  const recentActivity = state.activity?.slice(0, 5) || [];

  if (recentActivity.length === 0) {
    return (
      <div className="panel p-6 text-center text-dune">
        Aucune activité récente
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {recentActivity.map((activity) => (
        <div key={activity.id} className="panel p-3 flex items-start gap-3">
          <IconGrid className="h-4 w-4 text-gold mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-bone truncate">{activity.label}</p>
            <p className="text-xs text-dune mt-1">
              {new Date(activity.time).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

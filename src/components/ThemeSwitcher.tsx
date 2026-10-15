import { useTheme } from '../hooks/useTheme';
import { IconSun, IconMoon, IconMonitor } from './Icons';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light' as const, label: 'Clair', icon: IconSun },
    { value: 'dark' as const, label: 'Sombre', icon: IconMoon },
    { value: 'system' as const, label: 'Système', icon: IconMonitor },
  ];

  return (
    <div className="flex items-center gap-2">
      {themes.map((t) => {
        const Icon = t.icon;
        const isActive = theme === t.value;
        return (
          <button
            key={t.value}
            onClick={() => setTheme(t.value)}
            className={`p-2 rounded-lg transition-all ${
              isActive
                ? 'bg-gold text-night'
                : 'bg-bark text-dune hover:text-gold'
            }`}
            title={t.label}
          >
            <Icon className="w-5 h-5" />
          </button>
        );
      })}
    </div>
  );
}

import { useEffect, useState, type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../lib/store";
import { readyMatches } from "../lib/data";
import { useToast } from "./ui";
import GlobalSearch from "./GlobalSearch";
import FavoritesSidebar from "./FavoritesSidebar";
import ThemeSwitcher from "./ThemeSwitcher";
import { useGlobalShortcuts } from "../hooks/useKeyboardShortcuts";
import {
  LogoMark,
  IconGrid,
  IconUsers,
  IconScale,
  IconBracket,
  IconLive,
  IconTrophy,
  IconGear,
  IconLock,
  IconReset,
  IconFlag,
  IconTv,
  IconQr,
  IconCalendar,
  IconBuilding,
  IconAward,
  IconShield,
  IconBell,
  IconDownload,
  IconFile,
  IconHandshake,
  IconTrendUp,
  IconSearch,
  IconCheck,
  IconChart,
  IconStar,
  IconBook,
} from "./Icons";

const NAV = [
  { to: "/", label: "Tableau de bord", icon: IconGrid, end: true },
  { to: "/competitions", label: "Compétitions", icon: IconCalendar },
  { to: "/organizers", label: "Organisateurs", icon: IconBuilding },
  { to: "/clubs", label: "Clubs", icon: IconAward },
  { to: "/referees", label: "Arbitres", icon: IconShield },
  { to: "/athletes", label: "Athlètes", icon: IconUsers },
  { to: "/pesee", label: "Pesée", icon: IconScale },
  { to: "/tirages", label: "Tirages au sort", icon: IconBracket },
  { to: "/live", label: "Live Scoring", icon: IconLive },
  { to: "/resultats", label: "Résultats", icon: IconTrophy },
  { to: "/reclamations", label: "Réclamations", icon: IconFlag },
  { to: "/tv", label: "Mode TV", icon: IconTv },
  { to: "/qr", label: "QR Présences", icon: IconQr },
  { to: "/calendar", label: "Calendrier", icon: IconCalendar },
  { to: "/reports", label: "Rapports", icon: IconDownload },
  { to: "/notifications", label: "Notifications", icon: IconBell },
  { to: "/export", label: "Export & Import", icon: IconFile },
  { to: "/sponsors", label: "Sponsors & Partenaires", icon: IconHandshake },
  { to: "/sponsors/report", label: "Rapport Sponsors", icon: IconTrendUp },
  { to: "/workflow", label: "Cycle de Vie", icon: IconCheck },
  { to: "/arenas", label: "Aires de Combat", icon: IconGrid },
  { to: "/schedule", label: "Planning Combats", icon: IconCalendar },
  { to: "/call", label: "Appel Athlètes", icon: IconBell },
  { to: "/certificates", label: "Certificats", icon: IconAward },
  { to: "/report", label: "Rapport Compétition", icon: IconFile },
  { to: "/analytics", label: "Analytics Avancés", icon: IconChart },
  { to: "/ranking", label: "Classement ELO", icon: IconTrophy },
  { to: "/gamification", label: "Gamification", icon: IconStar },
  { to: "/profiles", label: "Profils Sociaux", icon: IconUsers },
  { to: "/training", label: "Formation", icon: IconBook },
  { to: "/poomsae", label: "Poomsae", icon: IconTrophy },
  { to: "/admin", label: "Administration", icon: IconGear },
];

const UPCOMING: string[] = [];

function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="font-mono text-sm tabular-nums text-bone">
      {now.toLocaleTimeString("fr-FR")}
    </span>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  const { state, dispatch } = useApp();
  const toast = useToast();
  const navigate = useNavigate();
  const liveCount = readyMatches(state).length;

  // Activer les raccourcis clavier globaux
  useGlobalShortcuts();

  return (
    <div className="mud-bg flex min-h-screen">
      <div className="noise-layer" aria-hidden="true" />
      
      {/* Recherche globale */}
      <GlobalSearch />

      {/* ————— Sidebar ————— */}
      <aside className="fixed inset-y-0 left-0 z-[100] hidden w-[248px] flex-col border-r border-husk bg-coal lg:flex">
        <div className="kente h-1.5 w-full" aria-hidden="true" />

        <div className="flex items-center gap-3 px-5 pb-5 pt-6">
          <LogoMark className="h-10 w-10 text-gold" />
          <div>
            <p className="font-display text-2xl leading-none uppercase tracking-wide text-bone">
              Dojang
            </p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.24em] text-dune">
              Régie des tatamis
            </p>
          </div>
        </div>

        <div className="border-t border-husk px-5 py-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
            {state.event.name}
          </p>
          <p className="mt-1 text-xs text-dune">{state.event.venue}</p>
          <p className="text-xs text-dune">{state.event.date}</p>
        </div>

        <nav className="flex-1 overflow-y-auto border-t border-husk py-3" aria-label="Navigation principale">
          {NAV.map((item) => {
            const Icon = item.icon;
            const count =
              item.to === "/athletes"
                ? state.athletes.length
                : item.to === "/live"
                  ? liveCount || undefined
                  : undefined;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 px-5 py-3 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-bark text-gold"
                      : "text-dune hover:bg-bark/60 hover:text-bone"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="kente-vert absolute left-0 top-0 h-full w-1" aria-hidden="true" />
                    )}
                    <Icon className="h-[18px] w-[18px] shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.to === "/live" && count !== undefined && count > 0 ? (
                      <span className="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-flame">
                        <span className="dot-live inline-block h-1.5 w-1.5 rounded-full bg-flame" aria-hidden="true" />
                        {count}
                      </span>
                    ) : count !== undefined ? (
                      <span className="font-mono text-[10px] text-dune">{count}</span>
                    ) : null}
                  </>
                )}
              </NavLink>
            );
          })}

          {/* Favoris */}
          <FavoritesSidebar />

          <p className="mt-6 px-5 font-mono text-[9px] uppercase tracking-[0.24em] text-dune/70">
            Modules à venir
          </p>
          {UPCOMING.map((m) => (
            <p
              key={m}
              className="flex cursor-not-allowed items-center gap-3 px-5 py-2.5 text-sm text-dune/50"
              title="Module prévu dans une prochaine version"
            >
              <IconLock className="h-4 w-4 shrink-0" />
              {m}
              <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.14em]">bientôt</span>
            </p>
          ))}
        </nav>

        <div className="border-t border-husk p-4">
          <button
            type="button"
            onClick={() => {
              dispatch({ type: "RESET_ALL" });
              navigate("/");
              toast("Données de démonstration réinitialisées", "info");
            }}
            className="flex w-full cursor-pointer items-center justify-center gap-2 border border-husk px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-dune transition-colors hover:border-flame hover:text-flame"
          >
            <IconReset className="h-3.5 w-3.5" />
            Réinitialiser la démo
          </button>
          <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-dune/60">
            v1.0 — architecture évolutive
          </p>
        </div>
      </aside>

      {/* ————— Colonne principale ————— */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-[248px]">
        {/* Topbar */}
        <header className="sticky top-0 z-[90] border-b border-husk bg-night/95 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
            <div className="flex items-center gap-3 lg:hidden">
              <LogoMark className="h-8 w-8 text-gold" />
              <span className="font-display text-xl uppercase tracking-wide text-bone">Dojang</span>
            </div>
            <p className="hidden items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-dune lg:flex">
              <span className="dot-soft inline-block h-2 w-2 rounded-full bg-forest" aria-hidden="true" />
              Régie ouverte — {state.event.arenas} aires de combat
            </p>
            <div className="flex items-center gap-4">
              <ThemeSwitcher />
              <button
                onClick={() => {
                  // Déclencher l'ouverture de la recherche globale
                  const event = new KeyboardEvent('keydown', {
                    key: 'k',
                    ctrlKey: true,
                  });
                  window.dispatchEvent(event);
                }}
                className="flex items-center gap-2 border border-husk px-3 py-1.5 text-sm text-dune hover:border-gold hover:text-bone transition-colors"
                title="Rechercher (Ctrl+K)"
              >
                <IconSearch className="h-4 w-4" />
                <span className="hidden sm:inline">Rechercher...</span>
                <kbd className="hidden md:inline px-1.5 py-0.5 bg-bark border border-husk rounded text-xs">Ctrl+K</kbd>
              </button>
              <span className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-gold sm:inline">
                {state.event.name}
              </span>
              <span className="h-5 w-px bg-husk" aria-hidden="true" />
              <Clock />
            </div>
          </div>
          {/* Nav mobile */}
          <nav
            className="flex gap-1 overflow-x-auto border-t border-husk px-3 py-2 lg:hidden"
            aria-label="Navigation mobile"
          >
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `shrink-0 px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
                    isActive ? "bg-gold font-semibold text-night" : "text-dune hover:text-bone"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="flex-1 px-5 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}

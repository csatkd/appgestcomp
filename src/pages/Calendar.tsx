import { useState, useMemo } from "react";
import { useApp } from "../lib/store";
import { PageHead } from "../components/ui";
import { IconCalendar, IconChevron } from "../components/Icons";
import type { Competition } from "../lib/types";
import PageBackground from "../components/PageBackground";
import { PAGE_BACKGROUNDS } from "../config/backgrounds";

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export default function Calendar() {
  const { state } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Générer les jours du mois
  const daysInMonth = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];

    // Jours vides avant le premier jour du mois
    const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // Jours du mois
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  }, [year, month]);

  // Trouver les compétitions pour une date donnée
  const getCompetitionsForDate = (date: Date) => {
    return state.competitions.filter((comp) => {
      const startDate = new Date(comp.startDate);
      const endDate = new Date(comp.endDate);
      return date >= startDate && date <= endDate;
    });
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const today = new Date();
  const isToday = (date: Date) => {
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  return (
    <div className="fade-up mx-auto max-w-6xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.competitions} opacity={0.08} blur={3} />
      <PageHead
        title="Calendrier"
        subtitle="Vue calendrier des compétitions"
      />

      {/* Navigation du mois */}
      <div className="panel p-6 mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={prevMonth}
            className="btn btn-ghost btn-sm"
          >
            <IconChevron className="w-4 h-4 rotate-180" />
            Précédent
          </button>
          <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-wide text-bone">
            {MONTHS[month]} {year}
          </h2>
          <button
            onClick={nextMonth}
            className="btn btn-ghost btn-sm"
          >
            Suivant
            <IconChevron className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grille du calendrier */}
      <div className="panel overflow-hidden">
        {/* En-tête des jours */}
        <div className="grid grid-cols-7 border-b border-husk">
          {DAYS.map((day) => (
            <div
              key={day}
              className="p-3 text-center font-mono text-xs uppercase tracking-wider text-dune border-r border-husk last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Jours du mois */}
        <div className="grid grid-cols-7">
          {daysInMonth.map((date, i) => {
            if (!date) {
              return <div key={i} className="aspect-square border-r border-b border-husk bg-night/50" />;
            }

            const competitions = getCompetitionsForDate(date);
            const hasEvents = competitions.length > 0;
            const isTodayDate = isToday(date);

            return (
              <div
                key={i}
                className={`aspect-square border-r border-b border-husk p-2 transition-colors ${
                  isTodayDate ? "bg-gold/10" : "hover:bg-bark/50"
                }`}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-sm font-semibold ${
                        isTodayDate ? "text-gold" : "text-bone"
                      }`}
                    >
                      {date.getDate()}
                    </span>
                    {hasEvents && (
                      <span className="w-2 h-2 bg-flame rounded-full" />
                    )}
                  </div>
                  {hasEvents && (
                    <div className="flex-1 overflow-hidden">
                      {competitions.slice(0, 2).map((comp) => (
                        <button
                          key={comp.id}
                          onClick={() => setSelectedCompetition(comp)}
                          className="w-full text-left mb-1 px-1.5 py-0.5 bg-flame/20 border border-flame/40 text-xs text-bone truncate hover:bg-flame/30 transition-colors"
                        >
                          {comp.name}
                        </button>
                      ))}
                      {competitions.length > 2 && (
                        <p className="text-xs text-dune">+{competitions.length - 2} autre(s)</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Liste des compétitions du mois */}
      <div className="panel p-6 mt-6">
        <h3 className="font-display text-xl uppercase tracking-wide text-bone mb-4">
          Compétitions ce mois
        </h3>
        {state.competitions.filter((comp) => {
          const startDate = new Date(comp.startDate);
          const endDate = new Date(comp.endDate);
          return (
            (startDate.getMonth() === month && startDate.getFullYear() === year) ||
            (endDate.getMonth() === month && endDate.getFullYear() === year) ||
            (startDate < new Date(year, month, 1) && endDate > new Date(year, month + 1, 0))
          );
        }).length === 0 ? (
          <p className="text-dune text-center py-8">Aucune compétition ce mois</p>
        ) : (
          <div className="space-y-3">
            {state.competitions
              .filter((comp) => {
                const startDate = new Date(comp.startDate);
                const endDate = new Date(comp.endDate);
                return (
                  (startDate.getMonth() === month && startDate.getFullYear() === year) ||
                  (endDate.getMonth() === month && endDate.getFullYear() === year) ||
                  (startDate < new Date(year, month, 1) && endDate > new Date(year, month + 1, 0))
                );
              })
              .map((comp) => (
                <div
                  key={comp.id}
                  className="flex items-center justify-between p-4 border border-husk hover:border-gold/50 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-bone">{comp.name}</p>
                    <p className="text-sm text-dune mt-1">
                      {new Date(comp.startDate).toLocaleDateString("fr-FR")} -{" "}
                      {new Date(comp.endDate).toLocaleDateString("fr-FR")}
                    </p>
                    <p className="text-sm text-dune">{comp.venue}</p>
                  </div>
                  <span className={`badge ${
                    comp.status === "active" ? "text-forest" :
                    comp.status === "terminee" ? "text-dune" :
                    comp.status === "brouillon" ? "text-gold" : "text-dune"
                  }`}>
                    {comp.status}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Modal de détail de compétition */}
      {selectedCompetition && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-night/80 backdrop-blur-sm p-4"
          onClick={() => setSelectedCompetition(null)}
        >
          <div
            className="panel max-w-2xl w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-2xl uppercase tracking-wide text-bone mb-4">
              {selectedCompetition.name}
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-dune">Dates</p>
                <p className="text-bone mt-1">
                  {new Date(selectedCompetition.startDate).toLocaleDateString("fr-FR")} -{" "}
                  {new Date(selectedCompetition.endDate).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-dune">Lieu</p>
                <p className="text-bone mt-1">{selectedCompetition.venue}</p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-dune">Type</p>
                <p className="text-bone mt-1 capitalize">{selectedCompetition.type}</p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-dune">Statut</p>
                <p className="text-bone mt-1 capitalize">{selectedCompetition.status}</p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-dune">Aires de combat</p>
                <p className="text-bone mt-1">{selectedCompetition.arenas}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedCompetition(null)}
              className="btn btn-primary w-full mt-6"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

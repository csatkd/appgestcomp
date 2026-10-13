import { useState, useMemo } from "react";
import { useApp } from "../lib/store";
import { PageHead } from "../components/ui";
import { IconCalendar, IconChevron } from "../components/Icons";
import PageBackground from "../components/PageBackground";
import { PAGE_BACKGROUNDS } from "../config/backgrounds";

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export default function Calendar() {
  const { state } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // Mars 2026

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Générer les jours du mois
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay() || 7; // Lundi = 1

    const days = [];
    
    // Jours du mois précédent
    for (let i = startingDayOfWeek - 1; i > 0; i--) {
      days.push({ day: new Date(year, month, -i).getDate(), isCurrentMonth: false });
    }
    
    // Jours du mois actuel
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }
    
    // Jours du mois suivant
    const remainingDays = 42 - days.length; // 6 semaines * 7 jours
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ day: i, isCurrentMonth: false });
    }
    
    return days;
  }, [year, month]);

  // Événements du mois
  const monthEvents = useMemo(() => {
    return state.competitions.filter((comp) => {
      const startDate = new Date(comp.startDate);
      const endDate = new Date(comp.endDate);
      return (
        (startDate.getFullYear() === year && startDate.getMonth() === month) ||
        (endDate.getFullYear() === year && endDate.getMonth() === month) ||
        (startDate < new Date(year, month + 1, 0) && endDate >= new Date(year, month, 1))
      );
    });
  }, [state.competitions, year, month]);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getEventsForDay = (day: number) => {
    const date = new Date(year, month, day);
    return monthEvents.filter((comp) => {
      const start = new Date(comp.startDate);
      const end = new Date(comp.endDate);
      return date >= start && date <= end;
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "locale": return "bg-forest";
      case "nationale": return "bg-gold";
      case "internationale": return "bg-flame";
      default: return "bg-dune";
    }
  };

  return (
    <div className="fade-up mx-auto max-w-6xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.competitions} opacity={0.08} blur={3} />
      <PageHead title="Calendrier" subtitle="Planning des compétitions" />

      {/* Navigation du mois */}
      <div className="panel p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prevMonth}
            className="btn btn-ghost btn-sm"
            aria-label="Mois précédent"
          >
            <IconChevron className="w-4 h-4 rotate-180" />
          </button>
          <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-wide text-bone">
            {MONTHS[month]} {year}
          </h2>
          <button
            onClick={nextMonth}
            className="btn btn-ghost btn-sm"
            aria-label="Mois suivant"
          >
            <IconChevron className="w-4 h-4" />
          </button>
        </div>

        {/* Grille du calendrier */}
        <div className="grid grid-cols-7 gap-1">
          {/* En-têtes des jours */}
          {DAYS.map((day) => (
            <div
              key={day}
              className="text-center font-mono text-xs uppercase tracking-wider text-dune py-2"
            >
              {day}
            </div>
          ))}

          {/* Jours du calendrier */}
          {calendarDays.map((dayInfo, idx) => {
            const events = dayInfo.isCurrentMonth ? getEventsForDay(dayInfo.day) : [];
            const isToday =
              dayInfo.isCurrentMonth &&
              dayInfo.day === new Date().getDate() &&
              month === new Date().getMonth() &&
              year === new Date().getFullYear();

            return (
              <div
                key={idx}
                className={`min-h-[80px] sm:min-h-[100px] border border-husk p-1 sm:p-2 ${
                  dayInfo.isCurrentMonth ? "bg-coal" : "bg-night/50"
                } ${isToday ? "border-gold border-2" : ""}`}
              >
                <div
                  className={`text-sm font-semibold mb-1 ${
                    dayInfo.isCurrentMonth ? "text-bone" : "text-dune/50"
                  } ${isToday ? "text-gold" : ""}`}
                >
                  {dayInfo.day}
                </div>
                <div className="space-y-1">
                  {events.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className={`${getTypeColor(event.type)} text-white text-[10px] px-1 py-0.5 rounded truncate`}
                      title={event.name}
                    >
                      {event.name}
                    </div>
                  ))}
                  {events.length > 2 && (
                    <div className="text-[10px] text-dune text-center">
                      +{events.length - 2} autres
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Légende */}
      <div className="panel p-6">
        <h3 className="font-display text-lg uppercase tracking-wide text-bone mb-4">
          Légende
        </h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-forest rounded" />
            <span className="text-sm text-dune">Locale</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gold rounded" />
            <span className="text-sm text-dune">Nationale</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-flame rounded" />
            <span className="text-sm text-dune">Internationale</span>
          </div>
        </div>
      </div>

      {/* Liste des événements du mois */}
      {monthEvents.length > 0 && (
        <div className="panel p-6 mt-6">
          <h3 className="font-display text-lg uppercase tracking-wide text-bone mb-4">
            Événements du mois ({monthEvents.length})
          </h3>
          <div className="space-y-3">
            {monthEvents.map((event) => (
              <div key={event.id} className="border-l-4 border-gold bg-bark/50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-bone mb-1">{event.name}</h4>
                    <p className="text-sm text-dune">
                      {new Date(event.startDate).toLocaleDateString("fr-FR")} -{" "}
                      {new Date(event.endDate).toLocaleDateString("fr-FR")}
                    </p>
                    <p className="text-sm text-dune mt-1">{event.venue}</p>
                  </div>
                  <span className={`badge ${getTypeColor(event.type)} text-white`}>
                    {event.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

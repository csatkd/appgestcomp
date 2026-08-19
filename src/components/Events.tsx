import { useMemo, useState } from "react";
import { EVENTS, type Discipline, type EventItem } from "../data";
import { useInView } from "../hooks";
import Reveal, { Eyebrow } from "./Reveal";
import { ArrowRight, IconCal, IconPin } from "./Icons";

const DISCIPLINE_COLORS: Record<Discipline, string> = {
  Kyorugi: "var(--color-flame)",
  Poomsae: "var(--color-gold)",
  Casse: "var(--color-forest)",
  Démonstration: "var(--color-chong)",
  Formation: "var(--color-dune)",
  "Passage de Grade": "var(--color-bone)",
};

function EventCard({ event, index }: { event: EventItem; index: number }) {
  const [ref, inView] = useInView<HTMLElement>(0.1);
  const pct = Math.round((event.registered / event.capacity) * 100);

  return (
    <article
      ref={ref}
      className="ev-in group flex flex-col overflow-hidden border border-husk bg-coal transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/60 hover:shadow-[0_28px_70px_-28px_rgba(240,164,28,0.3)]"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.08]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-night/80 via-night/10 to-transparent"
          aria-hidden="true"
        />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span
            className="px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-night"
            style={{ background: DISCIPLINE_COLORS[event.discipline] }}
          >
            {event.discipline}
          </span>
          <span className="border border-bone/25 bg-night/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-bone">
            {event.scope}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl uppercase leading-snug text-bone transition-colors duration-300 group-hover:text-gold">
          {event.title}
        </h3>

        <div className="mt-4 space-y-2 text-sm text-dune">
          <p className="flex items-center gap-2.5">
            <IconCal className="h-4 w-4 shrink-0 text-gold" />
            {event.date}
          </p>
          <p className="flex items-center gap-2.5">
            <IconPin className="h-4 w-4 shrink-0 text-gold" />
            {event.venue} — {event.city}
          </p>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.12em]">
            <span className="text-dune">
              {event.registered} inscrits / {event.capacity} places
            </span>
            <span className="font-semibold text-gold">{pct}% complet</span>
          </div>
          <div className="relative mt-2 h-1.5 overflow-hidden bg-husk">
            <div
              className="bar-shine h-full bg-gold transition-[width] duration-1000 ease-out"
              style={{ width: inView ? `${pct}%` : "0%" }}
            />
          </div>
        </div>

        <a
          href="https://tkd365.pro/event-checkout"
          target="_blank"
          rel="noreferrer"
          className="group/link mt-6 flex items-center justify-between border-t border-husk pt-4 text-sm font-bold text-bone transition-colors hover:text-gold"
        >
          S'inscrire
          <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-gold">
            Réserver
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1.5" />
          </span>
        </a>
      </div>
    </article>
  );
}

export default function Events() {
  const filters: ("Tous" | Discipline)[] = useMemo(
    () => ["Tous", ...Array.from(new Set(EVENTS.map((e) => e.discipline)))],
    []
  );
  const [filter, setFilter] = useState<(typeof filters)[number]>("Tous");

  const visible = useMemo(
    () => (filter === "Tous" ? EVENTS : EVENTS.filter((e) => e.discipline === filter)),
    [filter]
  );

  const countFor = (f: (typeof filters)[number]) =>
    f === "Tous" ? EVENTS.length : EVENTS.filter((e) => e.discipline === f).length;

  return (
    <section id="evenements" className="mud-bg relative scroll-mt-24 border-y border-husk bg-coal/40 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Reveal>
            <div>
              <Eyebrow>Prochains événements</Eyebrow>
              <h2 className="mt-6 font-display text-4xl uppercase leading-[1.02] text-bone sm:text-5xl lg:text-6xl">
                Compétitions
                <br />& <span className="text-gold">formations</span>
              </h2>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div className="lg:mb-2">
              <p className="max-w-md font-mono text-xs uppercase tracking-[0.2em] text-dune">
                Kyorugi · Poomsae · Casse · Démonstration · Passages de Grade
              </p>
              <a
                href="https://tkd365.pro/events-publics"
                target="_blank"
                rel="noreferrer"
                className="group mt-4 inline-flex items-center gap-3 border-b-2 border-gold pb-1 font-bold text-bone transition-colors hover:text-gold"
              >
                Tous les événements
                <ArrowRight className="h-4 w-4 text-gold transition-transform duration-300 group-hover:translate-x-1.5" />
              </a>
            </div>
          </Reveal>
        </div>

        {/* Filtres par discipline */}
        <Reveal delay={100}>
          <div className="mt-12 flex flex-wrap gap-2.5" role="tablist" aria-label="Filtrer par discipline">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={`cursor-pointer border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-all duration-300 ${
                  filter === f
                    ? "border-gold bg-gold font-semibold text-night"
                    : "border-husk text-dune hover:border-gold/60 hover:text-bone"
                }`}
              >
                {f} <span className={filter === f ? "opacity-70" : "text-gold/70"}>{countFor(f)}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <div key={filter} className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((e, i) => (
            <EventCard key={e.id} event={e} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

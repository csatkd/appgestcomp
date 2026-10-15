import { Link } from "react-router-dom";
import { useApp } from "../lib/store";
import {
  athleteName,
  classLabel,
  finishedMatches,
  readyMatches,
  totalMatches,
  WEIGHT_CLASSES,
} from "../lib/data";
import { PageHead, ProgressBar, EmptyState } from "../components/ui";
import { IconChevron, IconLive, IconTrophy, IconBracket } from "../components/Icons";
import PageBackground from "../components/PageBackground";
import { PAGE_BACKGROUNDS } from "../config/backgrounds";

export default function Dashboard() {
  const { state } = useApp();
  const athletes = state.athletes;
  const weighed = athletes.filter((a) => a.status === "pesé").length;
  const drawn = WEIGHT_CLASSES.filter((c) => state.catStatus[c.id] !== "ouverte").length;
  const done = finishedMatches(state);
  const total = totalMatches(state);
  const ready = readyMatches(state).slice(0, 6);

  const kpis = [
    { value: athletes.length, label: "Athlètes inscrits" },
    { value: weighed, label: "Pesées validées" },
    { value: `${drawn}/8`, label: "Catégories tirées" },
    { value: total ? `${done}/${total}` : "0", label: "Combats disputés" },
  ];

  const recentResults = Object.entries(state.results)
    .map(([catId, p]) => ({ catId, ...p }))
    .slice(0, 4);

  return (
    <div className="fade-up mx-auto max-w-6xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.dashboard} opacity={0.12} blur={3} />
      <PageHead
        title="Tableau de bord"
        subtitle="Vue d'ensemble de la compétition"
        actions={
          <>
            <Link to="/pesee" className="btn btn-ghost btn-sm">
              Continuer la pesée
            </Link>
            <Link to="/tirages" className="btn btn-primary btn-sm">
              Gérer les tirages
            </Link>
          </>
        }
      />

      {/* Bandeau événement */}
      <div className="panel relative overflow-hidden">
        <div className="kente absolute left-0 top-0 h-full w-1.5" aria-hidden="true" />
        <div className="flex flex-col gap-4 px-7 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold">
              Événement actif
            </p>
            <h2 className="mt-2 font-display text-3xl uppercase tracking-wide text-bone sm:text-4xl">
              {state.event.name}
            </h2>
            <p className="mt-1.5 text-sm text-dune">
              {state.event.date} · {state.event.venue}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="badge text-flame">
              <span className="dot-live inline-block h-1.5 w-1.5 rounded-full bg-flame" aria-hidden="true" />
              Live
            </span>
            <span className="badge text-dune">{state.event.arenas} tatamis</span>
            <span className="badge text-forest">WT Rules</span>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="mt-6 grid grid-cols-2 gap-px border border-husk bg-husk lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="group bg-coal px-6 py-6 transition-colors hover:bg-bark">
            <p className="font-display text-4xl tabular-nums text-bone transition-colors group-hover:text-gold">
              {k.value}
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-dune">
              {k.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Combats à venir */}
        <section className="panel">
          <div className="flex items-center justify-between border-b border-husk px-6 py-4">
            <h3 className="flex items-center gap-2.5 font-display text-xl uppercase tracking-wide text-bone">
              <IconLive className="h-5 w-5 text-flame" />
              Combats à diriger
            </h3>
            <Link to="/live" className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.16em] text-gold transition-colors hover:text-bone">
              Régie live <IconChevron className="h-3.5 w-3.5" />
            </Link>
          </div>

          {ready.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={<IconBracket className="h-7 w-7" />}
                title="Aucun combat prêt"
                text="Terminez la pesée puis générez les tirages au sort pour ouvrir les premiers combats."
                action={
                  <Link to="/tirages" className="btn btn-primary btn-sm">
                    Générer des tirages
                  </Link>
                }
              />
            </div>
          ) : (
            <ul className="divide-y divide-husk/60">
              {ready.map((m) => (
                <li key={m.id} className="row-hover flex items-center gap-4 px-6 py-4">
                  <span
                    className={`badge shrink-0 ${m.status === "encours" ? "text-flame" : "text-gold"}`}
                  >
                    {m.status === "encours" ? "En cours" : "Prêt"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-bone">
                      {athleteName(athletes, m.a)}{" "}
                      <span className="font-mono text-[10px] text-dune">VS</span>{" "}
                      {athleteName(athletes, m.b)}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-dune">
                      {classLabel(m.catId)}
                    </p>
                  </div>
                  <Link
                    to={`/live/${m.id}`}
                    className="btn btn-ghost btn-sm shrink-0 hover:border-flame hover:text-flame"
                  >
                    <IconLive className="h-3.5 w-3.5" />
                    Diriger
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Colonne droite */}
        <div className="flex flex-col gap-6">
          {/* Progression catégories */}
          <section className="panel">
            <div className="border-b border-husk px-6 py-4">
              <h3 className="flex items-center gap-2.5 font-display text-xl uppercase tracking-wide text-bone">
                <IconBracket className="h-5 w-5 text-gold" />
                Progression des catégories
              </h3>
            </div>
            <ul className="divide-y divide-husk/60">
              {WEIGHT_CLASSES.map((c) => {
                const status = state.catStatus[c.id];
                const pes = athletes.filter((a) => a.category === c.id && a.status === "pesé").length;
                const matches = state.brackets[c.id] ?? [];
                const doneM = matches.filter((m) => m.status === "termine").length;
                const pct = matches.length ? (doneM / matches.length) * 100 : 0;
                return (
                  <li key={c.id} className="row-hover px-6 py-3.5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-bone">{c.label}</p>
                      <span
                        className={`font-mono text-[10px] uppercase tracking-[0.14em] ${
                          status === "terminée"
                            ? "text-forest"
                            : status === "tirée"
                              ? "text-gold"
                              : "text-dune"
                        }`}
                      >
                        {status === "ouverte" ? `${pes} pesés` : matches.length ? `${doneM}/${matches.length}` : "—"}
                      </span>
                    </div>
                    <ProgressBar value={status === "terminée" ? 100 : pct} className="mt-2" />
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Derniers podiums */}
          <section className="panel">
            <div className="flex items-center justify-between border-b border-husk px-6 py-4">
              <h3 className="flex items-center gap-2.5 font-display text-xl uppercase tracking-wide text-bone">
                <IconTrophy className="h-5 w-5 text-gold" />
                Podiums officiels
              </h3>
              <Link to="/resultats" className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.16em] text-gold transition-colors hover:text-bone">
                Résultats <IconChevron className="h-3.5 w-3.5" />
              </Link>
            </div>
            {recentResults.length === 0 ? (
              <p className="px-6 py-6 text-sm text-dune">
                Aucun podium officialisé pour l'instant — les résultats apparaîtront dès la fin des
                finales.
              </p>
            ) : (
              <ul className="divide-y divide-husk/60">
                {recentResults.map((r) => (
                  <li key={r.catId} className="row-hover px-6 py-3.5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-gold">
                      {classLabel(r.catId)}
                    </p>
                    <p className="mt-1 text-sm font-bold text-bone">
                      {athleteName(athletes, r.gold)}{" "}
                      <span className="font-normal text-dune">remporte l'or</span>
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

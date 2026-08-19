import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { canResetBracket, useApp, weighedIn } from "../lib/store";
import { athleteName, classLabel, totalRounds, WEIGHT_CLASSES } from "../lib/data";
import { roundName, totalScore } from "../lib/bracket";
import type { Match } from "../lib/types";
import { PageHead, StatusBadge, useToast } from "../components/ui";
import { IconBracket, IconLive, IconReset } from "../components/Icons";

function MatchCard({ m, catDone }: { m: Match; catDone: boolean }) {
  const { state } = useApp();
  const scoreA = totalScore(m, "a");
  const scoreB = totalScore(m, "b");

  const row = (side: "a" | "b") => {
    const id = side === "a" ? m.a : m.b;
    const isWinner = m.winner === side && m.status === "termine";
    const score = side === "a" ? scoreA : scoreB;
    const gam = side === "a" ? m.gamA : m.gamB;
    return (
      <div
        className={`flex items-center justify-between gap-2 px-3 py-2 ${
          isWinner ? "bg-bark text-gold" : "text-bone"
        } ${side === "a" ? "border-b border-husk/70" : ""}`}
      >
        <span className={`truncate text-xs font-semibold ${id ? "" : "text-dune/50"}`}>
          {m.bye && !id ? "Exempt" : athleteName(state.athletes, id)}
        </span>
        <span className="flex shrink-0 items-center gap-2">
          {gam > 0 && (
            <span className="font-mono text-[9px] uppercase text-flame">GJ×{gam}</span>
          )}
          {m.status === "termine" || m.status === "encours" ? (
            <span className={`font-display text-base leading-none ${isWinner ? "text-gold" : "text-dune"}`}>
              {score}
            </span>
          ) : null}
        </span>
      </div>
    );
  };

  return (
    <div
      className={`w-56 shrink-0 border transition-colors ${
        m.status === "encours"
          ? "border-flame/70"
          : m.status === "pret"
            ? "border-gold/50 hover:border-gold"
            : "border-husk"
      } bg-coal`}
    >
      {row("a")}
      {row("b")}
      <div className="flex items-center justify-between border-t border-husk/70 px-3 py-1.5">
        {m.status === "pret" ? (
          <>
            <span className="badge text-gold">Prêt</span>
            <Link
              to={`/live/${m.id}`}
              className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-flame transition-colors hover:text-bone"
            >
              <IconLive className="h-3 w-3" /> Diriger
            </Link>
          </>
        ) : m.status === "encours" ? (
          <>
            <span className="badge text-flame">
              <span className="dot-live inline-block h-1.5 w-1.5 rounded-full bg-flame" aria-hidden="true" />
              Live
            </span>
            <Link
              to={`/live/${m.id}`}
              className="font-mono text-[9px] uppercase tracking-[0.14em] text-gold transition-colors hover:text-bone"
            >
              Reprendre →
            </Link>
          </>
        ) : m.status === "termine" ? (
          <span className="badge text-forest">Terminé{m.bye ? " · bye" : ""}</span>
        ) : (
          <span className="badge text-dune/60">{catDone ? "—" : "Attente"}</span>
        )}
      </div>
    </div>
  );
}

export default function Brackets() {
  const { state, dispatch } = useApp();
  const toast = useToast();

  const defaultCat = useMemo(() => {
    const drawn = WEIGHT_CLASSES.find((c) => state.catStatus[c.id] === "tirée");
    return (drawn ?? WEIGHT_CLASSES[0]).id;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [selected, setSelected] = useState(defaultCat);

  const matches = state.brackets[selected] ?? [];
  const rounds = totalRounds(matches);
  const status = state.catStatus[selected];
  const eligible = weighedIn(state, selected);

  const generate = () => {
    dispatch({ type: "GENERATE_BRACKET", catId: selected, athleteIds: eligible.map((a) => a.id) });
    toast(`Tirage généré — ${classLabel(selected)} (${eligible.length} athlètes)`);
  };

  const reset = () => {
    dispatch({ type: "RESET_BRACKET", catId: selected });
    toast(`Tirage annulé — ${classLabel(selected)} repasse en "ouverte"`, "info");
  };

  return (
    <div className="fade-up mx-auto max-w-[1400px]">
      <PageHead title="Tirages au sort" subtitle="Tableaux à élimination directe" />

      {/* Cartes catégories */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {WEIGHT_CLASSES.map((c) => {
          const st = state.catStatus[c.id];
          const n = weighedIn(state, c.id).length;
          const on = selected === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelected(c.id)}
              className={`cursor-pointer border px-4 py-4 text-left transition-all duration-200 ${
                on ? "border-gold bg-bark" : "border-husk bg-coal hover:border-gold/50"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className={`font-display text-lg uppercase tracking-wide ${on ? "text-gold" : "text-bone"}`}>
                  {c.id}
                </p>
                <StatusBadge status={st} />
              </div>
              <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-dune">
                {n} pesé{n > 1 ? "s" : ""}
              </p>
            </button>
          );
        })}
      </div>

      {/* Panneau catégorie */}
      <div className="panel mt-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-husk px-6 py-5">
          <div>
            <h2 className="font-display text-2xl uppercase tracking-wide text-bone">
              {classLabel(selected)}
            </h2>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-dune">
              {eligible.length} athlètes éligibles · statut :{" "}
              <span className={status === "terminée" ? "text-forest" : status === "tirée" ? "text-gold" : "text-dune"}>
                {status}
              </span>
            </p>
          </div>
          <div className="flex gap-3">
            {status === "ouverte" && (
              <button
                type="button"
                onClick={generate}
                disabled={eligible.length < 2}
                className="btn btn-primary btn-sm"
                title={eligible.length < 2 ? "Au moins 2 athlètes pesés requis" : undefined}
              >
                <IconBracket className="h-4 w-4" />
                Générer le tirage
              </button>
            )}
            {status !== "ouverte" && canResetBracket(state.brackets[selected]) && (
              <button type="button" onClick={reset} className="btn btn-danger btn-sm">
                <IconReset className="h-3.5 w-3.5" />
                Annuler le tirage
              </button>
            )}
            {status === "terminée" && (
              <span className="badge self-center text-forest">Catégorie officiellement terminée</span>
            )}
          </div>
        </div>

        {matches.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <IconBracket className="mx-auto h-10 w-10 text-dune/40" />
            <p className="mt-4 font-display text-2xl uppercase tracking-wide text-bone">
              Aucun tableau pour cette catégorie
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-dune">
              {eligible.length < 2
                ? `Il faut au moins 2 athlètes pesés pour générer un tirage — actuellement ${eligible.length}.`
                : `${eligible.length} athlètes sont prêts : lancez la génération pour construire le tableau (exempts gérés automatiquement).`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto p-6">
            <div className="flex gap-8">
              {Array.from({ length: rounds }, (_, r) => (
                <div key={r} className="flex flex-col">
                  <p className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-gold">
                    {roundName(r, rounds)}
                  </p>
                  <div
                    className="flex flex-1 flex-col justify-around gap-4"
                    style={{ minHeight: `${Math.pow(2, r) * 96}px` }}
                  >
                    {matches
                      .filter((m) => m.round === r)
                      .map((m) => (
                        <MatchCard key={m.id} m={m} catDone={status === "terminée"} />
                      ))}
                  </div>
                </div>
              ))}

              {/* Vainqueur */}
              <div className="flex flex-col">
                <p className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-gold">
                  Vainqueur
                </p>
                <div className="flex flex-1 items-center">
                  {status === "terminée" && state.results[selected] ? (
                    <div className="relative w-56 border border-gold bg-bark px-4 py-4">
                      <span className="kente absolute left-0 top-0 h-1.5 w-full" aria-hidden="true" />
                      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-gold">
                        Médaille d'or
                      </p>
                      <p className="mt-1.5 font-display text-xl uppercase tracking-wide text-bone">
                        {athleteName(state.athletes, state.results[selected].gold)}
                      </p>
                    </div>
                  ) : (
                    <div className="flex w-56 items-center justify-center border border-dashed border-husk px-4 py-6 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-dune/60">
                      En jeu…
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-dune">
        Seeding aléatoire équilibré · exempts (byes) résolus automatiquement · un tirage est
        verrouillé dès qu'un combat est terminé.
      </p>
    </div>
  );
}

import { useMemo, useState } from "react";
import { useApp } from "../lib/store";
import { athleteName, classLabel, WEIGHT_CLASSES } from "../lib/data";
import { PageHead, EmptyState, StatusBadge, useToast } from "../components/ui";
import { IconTrophy, IconMedal, IconTrash } from "../components/Icons";
import PageBackground from "../components/PageBackground";
import { PAGE_BACKGROUNDS } from "../config/backgrounds";

const MEDAL_COLORS = { gold: "#f0a41c", silver: "#c8ccd4", bronze: "#c97f4a" };

export default function Results() {
  const { state, dispatch } = useApp();
  const toast = useToast();

  const finishedCats = WEIGHT_CLASSES.filter((c) => state.catStatus[c.id] === "terminée");
  const [selected, setSelected] = useState<string | null>(finishedCats[0]?.id ?? null);

  const podium = selected ? state.results[selected] : null;

  const clubTable = useMemo(() => {
    const acc = new Map<string, { club: string; g: number; s: number; b: number; pts: number }>();
    Object.entries(state.results).forEach(([catId, p]) => {
      const add = (id: string, kind: "g" | "s" | "b") => {
        const a = state.athletes.find((x) => x.id === id);
        if (!a) return;
        const row = acc.get(a.club) ?? { club: a.club, g: 0, s: 0, b: 0, pts: 0 };
        row[kind] += 1;
        row.pts += kind === "g" ? 5 : kind === "s" ? 3 : 1;
        acc.set(a.club, row);
      };
      add(p.gold, "g");
      add(p.silver, "s");
      p.bronzes.forEach((b) => add(b, "b"));
    });
    return Array.from(acc.values()).sort(
      (x, y) => y.pts - x.pts || y.g - x.g || y.s - x.s
    );
  }, [state.results, state.athletes]);

  const maxPts = clubTable[0]?.pts ?? 0;

  const publishAll = () => {
    toast("Palmarès synchronisé vers la page publique de l'événement", "info");
  };

  return (
    <div className="fade-up mx-auto max-w-6xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.results} opacity={0.12} blur={3} />
      <PageHead
        title="Résultats"
        subtitle="Podiums & classement des clubs"
        actions={
          finishedCats.length > 0 ? (
            <button type="button" onClick={publishAll} className="btn btn-primary btn-sm">
              <IconTrophy className="h-4 w-4" />
              Publier le palmarès
            </button>
          ) : undefined
        }
      />

      {finishedCats.length === 0 ? (
        <>
          <EmptyState
            icon={<IconTrophy className="h-7 w-7" />}
            title="Aucune finale disputée"
            text="Les podiums apparaissent dès qu'une finale est officialisée. Dirigez les combats depuis la régie live pour remplir cette page."
          />

          {/* Aperçu des catégories en cours */}
          <div className="panel mt-6 overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr>
                  <th className="th">Catégorie</th>
                  <th className="th">Athlètes pesés</th>
                  <th className="th">Statut</th>
                </tr>
              </thead>
              <tbody>
                {WEIGHT_CLASSES.map((c) => {
                  const n = state.athletes.filter(
                    (a) => a.category === c.id && a.status === "pesé"
                  ).length;
                  return (
                    <tr key={c.id} className="row-hover">
                      <td className="td font-semibold text-bone">{c.label}</td>
                      <td className="td tabular-nums text-dune">{n}</td>
                      <td className="td">
                        <StatusBadge status={state.catStatus[c.id]} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Sélecteur + tableau des médailles */}
          <div className="flex flex-col gap-6">
            <section className="panel">
              <div className="border-b border-husk px-6 py-4">
                <h3 className="font-display text-xl uppercase tracking-wide text-bone">
                  Catégories officialisées
                </h3>
              </div>
              <ul className="divide-y divide-husk/60">
                {finishedCats.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(c.id)}
                      className={`flex w-full cursor-pointer items-center justify-between px-6 py-3.5 text-left transition-colors ${
                        selected === c.id ? "bg-bark text-gold" : "text-bone hover:bg-bark/60"
                      }`}
                    >
                      <span className="text-sm font-semibold">{c.label}</span>
                      <IconMedal className="h-4 w-4 shrink-0 text-gold" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <section className="panel">
              <div className="border-b border-husk px-6 py-4">
                <h3 className="font-display text-xl uppercase tracking-wide text-bone">
                  Classement des clubs
                </h3>
              </div>
              <ul className="divide-y divide-husk/60">
                {clubTable.map((row, i) => (
                  <li key={row.club} className="row-hover px-6 py-3.5">
                    <div className="flex items-center justify-between">
                      <p className="flex items-center gap-3 text-sm font-semibold text-bone">
                        <span
                          className={`font-display text-lg leading-none ${
                            i === 0 ? "text-gold" : "text-dune"
                          }`}
                        >
                          {i + 1}
                        </span>
                        {row.club}
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-dune">
                        <span className="text-gold">{row.g}O</span>{" "}
                        <span className="text-dune">{row.s}A</span>{" "}
                        <span className="text-[#c97f4a]">{row.b}B</span> · {row.pts} pts
                      </p>
                    </div>
                    <div className="mt-2 h-1 w-full bg-husk">
                      <div
                        className="h-full bg-gold transition-[width] duration-700"
                        style={{ width: maxPts ? `${(row.pts / maxPts) * 100}%` : "0%" }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Podium */}
          <section className="panel relative self-start overflow-hidden">
            <div className="kente absolute left-0 top-0 h-1.5 w-full" aria-hidden="true" />
            <div className="border-b border-husk px-6 py-4">
              <h3 className="font-display text-xl uppercase tracking-wide text-bone">
                Podium — {selected ? classLabel(selected) : ""}
              </h3>
            </div>

            {podium && selected && (
              <div className="px-6 py-8">
                <div className="flex items-end justify-center gap-3">
                  {/* Argent */}
                  <PodiumBlock
                    place={2}
                    name={athleteName(state.athletes, podium.silver)}
                    club={state.athletes.find((a) => a.id === podium.silver)?.club ?? ""}
                    color={MEDAL_COLORS.silver}
                    height="h-28"
                  />
                  {/* Or */}
                  <PodiumBlock
                    place={1}
                    name={athleteName(state.athletes, podium.gold)}
                    club={state.athletes.find((a) => a.id === podium.gold)?.club ?? ""}
                    color={MEDAL_COLORS.gold}
                    height="h-40"
                    gold
                  />
                  {/* Bronze */}
                  <PodiumBlock
                    place={3}
                    name={
                      podium.bronzes.length > 0
                        ? athleteName(state.athletes, podium.bronzes[0])
                        : "Non attribué"
                    }
                    club={
                      podium.bronzes.length > 0
                        ? state.athletes.find((a) => a.id === podium.bronzes[0])?.club ?? ""
                        : ""
                    }
                    color={MEDAL_COLORS.bronze}
                    height="h-20"
                  />
                </div>

                {podium.bronzes.length > 1 && (
                  <p className="mt-5 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-dune">
                    Seconde médaille de bronze :{" "}
                    <span className="text-bone">{athleteName(state.athletes, podium.bronzes[1])}</span>
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => {
                    dispatch({ type: "RESET_BRACKET", catId: selected });
                    setSelected(null);
                    toast(`${classLabel(selected)} remise en jeu — tirage annulé`, "info");
                  }}
                  className="btn btn-danger btn-sm mx-auto mt-8 flex"
                >
                  <IconTrash className="h-3.5 w-3.5" />
                  Remettre la catégorie en jeu
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

function PodiumBlock({
  place,
  name,
  club,
  color,
  height,
  gold = false,
}: {
  place: number;
  name: string;
  club: string;
  color: string;
  height: string;
  gold?: boolean;
}) {
  return (
    <div className={`flex w-1/3 max-w-[150px] flex-col items-center ${gold ? "order-2" : place === 2 ? "order-1" : "order-3"}`}>
      <span
        className="mb-2 flex h-10 w-10 items-center justify-center border-2 font-display text-xl"
        style={{ borderColor: color, color }}
        aria-hidden="true"
      >
        {place}
      </span>
      <p className={`text-center font-bold leading-tight ${gold ? "text-gold" : "text-bone"}`}>
        {name}
      </p>
      <p className="mt-0.5 max-w-full truncate text-center font-mono text-[9px] uppercase tracking-[0.12em] text-dune">
        {club}
      </p>
      <div
        className={`mt-3 flex w-full items-start justify-center border border-husk ${height} ${
          gold ? "bg-bark" : "bg-coal"
        }`}
      >
        <span className="mt-2 h-1.5 w-2/3" style={{ background: color }} aria-hidden="true" />
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";
import { useApp } from "../lib/store";
import { categoryFor, classLabel, WEIGHT_CLASSES } from "../lib/data";
import { PageHead, StatusBadge, useToast, ProgressBar } from "../components/ui";
import { IconCheck, IconFlag, IconScale, IconX } from "../components/Icons";

type GenderFilter = "tous" | "M" | "F";

export default function WeighIn() {
  const { state, dispatch } = useApp();
  const toast = useToast();
  const [filter, setFilter] = useState<GenderFilter>("tous");
  const [pending, setPending] = useState<Record<string, string>>({});

  const rows = useMemo(
    () =>
      state.athletes
        .filter((a) => filter === "tous" || a.gender === filter)
        .sort((x, y) => {
          if (x.status === y.status) return x.lastName.localeCompare(y.lastName);
          return x.status === "pesé" ? 1 : -1;
        }),
    [state.athletes, filter]
  );

  const weighed = state.athletes.filter((a) => a.status === "pesé").length;
  const pct = state.athletes.length ? (weighed / state.athletes.length) * 100 : 0;

  const save = (id: string) => {
    const raw = pending[id];
    const w = Number(raw);
    if (!raw || !Number.isFinite(w) || w < 20 || w > 200) {
      toast("Poids invalide — valeur attendue entre 20 et 200 kg", "error");
      return;
    }
    const athlete = state.athletes.find((a) => a.id === id);
    if (!athlete) return;
    const cat = categoryFor(athlete.gender, w);
    const catStatus = state.catStatus[cat.id];
    if (catStatus !== "ouverte") {
      toast(`${classLabel(cat.id)} : tirage déjà effectué, pesée verrouillée`, "error");
      return;
    }
    dispatch({ type: "WEIGH_IN", id, weight: w });
    setPending((p) => {
      const n = { ...p };
      delete n[id];
      return n;
    });
    toast(`${athlete.firstName} ${athlete.lastName} → ${classLabel(cat.id)}`);
  };

  return (
    <div className="fade-up mx-auto max-w-6xl">
      <PageHead title="Pesée" subtitle="Contrôle officiel des poids" />

      {/* Synthèse */}
      <div className="panel mb-6 px-7 py-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-display text-4xl tabular-nums text-bone">
              {weighed}
              <span className="text-dune"> / {state.athletes.length}</span>
            </p>
            <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-dune">
              Pesées validées
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {WEIGHT_CLASSES.map((c) => {
              const n = state.athletes.filter(
                (a) => a.category === c.id && a.status === "pesé"
              ).length;
              return (
                <span
                  key={c.id}
                  className={`badge ${n > 0 ? "text-gold" : "text-dune/50"}`}
                  title={c.label}
                >
                  {c.id} · {n}
                </span>
              );
            })}
          </div>
        </div>
        <ProgressBar value={pct} className="mt-5" />
      </div>

      {/* Filtre sexe */}
      <div className="mb-5 flex gap-2">
        {(["tous", "M", "F"] as const).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setFilter(g)}
            className={`cursor-pointer border px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-all ${
              filter === g
                ? "border-gold bg-gold font-semibold text-night"
                : "border-husk text-dune hover:border-gold/60 hover:text-bone"
            }`}
          >
            {g === "tous" ? "Tous" : g === "M" ? "Hommes" : "Femmes"}
          </button>
        ))}
      </div>

      <div className="panel overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr>
              <th className="th">Athlète</th>
              <th className="th">Club</th>
              <th className="th">Poids (kg)</th>
              <th className="th">Catégorie assignée</th>
              <th className="th">Statut</th>
              <th className="th text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => {
              const draft = pending[a.id] ?? (a.weight !== null ? String(a.weight) : "");
              const previewW = Number(draft);
              const previewValid = Number.isFinite(previewW) && previewW >= 20 && previewW <= 200;
              const previewCat = previewValid ? categoryFor(a.gender, previewW) : null;
              const locked =
                previewCat !== null &&
                (state.catStatus[previewCat.id] !== "ouverte" ||
                  state.disabledCats.includes(previewCat.id));

              return (
                <tr key={a.id} className="row-hover">
                  <td className="td">
                    <p className="font-bold text-bone">
                      {a.firstName} <span className="uppercase">{a.lastName}</span>
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dune">
                      {a.license} · {a.gender === "M" ? "H" : "F"} · {a.birthYear}
                    </p>
                  </td>
                  <td className="td text-dune">{a.club}</td>
                  <td className="td">
                    <input
                      type="number"
                      step="0.1"
                      min={20}
                      max={200}
                      value={draft}
                      disabled={a.status === "forfait"}
                      onChange={(e) => setPending((p) => ({ ...p, [a.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") save(a.id);
                      }}
                      className="input w-24 tabular-nums"
                      aria-label={`Poids de ${a.firstName} ${a.lastName}`}
                      placeholder="—"
                    />
                  </td>
                  <td className="td">
                    {previewCat ? (
                      <span className={`text-sm font-semibold ${locked ? "text-flame" : "text-gold"}`}>
                        {classLabel(previewCat.id)}
                        {state.disabledCats.includes(previewCat.id) && (
                          <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.14em] text-flame">
                            · Fermée
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-dune/60">
                        Saisir un poids
                      </span>
                    )}
                  </td>
                  <td className="td">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="td">
                    <div className="flex justify-end gap-2">
                      {a.status === "forfait" ? (
                        <button
                          type="button"
                          onClick={() => {
                            dispatch({ type: "REINSTATE", id: a.id });
                            toast(`${a.firstName} ${a.lastName} réintégré·e`, "info");
                          }}
                          className="btn btn-ghost btn-sm"
                        >
                          <IconX className="h-3 w-3" />
                          Réintégrer
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => save(a.id)}
                            disabled={locked}
                            className="btn btn-primary btn-sm"
                          >
                            <IconCheck className="h-3 w-3" />
                            Valider
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              dispatch({ type: "FORFAIT", id: a.id });
                              toast(`Forfait enregistré pour ${a.firstName} ${a.lastName}`, "info");
                            }}
                            className="btn btn-danger btn-sm"
                            title="Déclarer forfait"
                          >
                            <IconFlag className="h-3 w-3" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-dune">
        <IconScale className="h-4 w-4 text-gold" />
        La catégorie est assignée automatiquement selon les classes de poids WT. Une catégorie déjà
        tirée est verrouillée.
      </p>
    </div>
  );
}

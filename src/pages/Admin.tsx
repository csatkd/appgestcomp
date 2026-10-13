import { useEffect, useMemo, useRef, useState } from "react";
import { useApp, weighedIn } from "../lib/store";
import { classLabel, WEIGHT_CLASSES } from "../lib/data";
import { uid } from "../lib/bracket";
import type { ActivityKind, AppState, EventConfig } from "../lib/types";
import { Modal, PageHead, StatusBadge, useToast } from "../components/ui";
import {
  IconAlert,
  IconBracket,
  IconCheck,
  IconDownload,
  IconGear,
  IconLock,
  IconMedal,
  IconReset,
  IconScale,
  IconTrophy,
  IconUpload,
  IconUsers,
} from "../components/Icons";

/* ————— Utilitaires ————— */

function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (Number.isNaN(s)) return "";
  if (s < 60) return "à l'instant";
  const m = Math.floor(s / 60);
  if (m < 60) return `il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h} h`;
  return `il y a ${Math.floor(h / 24)} j`;
}

const KIND_META: Record<ActivityKind, { icon: React.ReactNode; cls: string; label: string }> = {
  athlete: { icon: <IconUsers className="h-4 w-4" />, cls: "text-gold border-gold/50", label: "Athlètes" },
  pesee: { icon: <IconScale className="h-4 w-4" />, cls: "text-forest border-forest/50", label: "Pesée" },
  tirage: { icon: <IconBracket className="h-4 w-4" />, cls: "text-chong border-chong/50", label: "Tirage" },
  combat: { icon: <IconTrophy className="h-4 w-4" />, cls: "text-flame border-flame/50", label: "Combat" },
  config: { icon: <IconGear className="h-4 w-4" />, cls: "text-dune border-husk", label: "Config" },
  donnees: { icon: <IconUpload className="h-4 w-4" />, cls: "text-gold border-gold/50", label: "Données" },
};

/* ————— Panneau générique ————— */

function Panel({
  title,
  kicker,
  children,
  actions,
}: {
  title: string;
  kicker: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <section className="panel relative overflow-hidden">
      <div className="kente absolute left-0 top-0 h-1 w-full" aria-hidden="true" />
      <header className="flex items-center justify-between gap-4 border-b border-husk px-6 py-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold">{kicker}</p>
          <h2 className="mt-0.5 font-display text-xl uppercase tracking-wide text-bone">{title}</h2>
        </div>
        {actions}
      </header>
      <div className="p-6">{children}</div>
    </section>
  );
}

/* ════════════════ Page Administration ════════════════ */

export default function Admin() {
  const { state, dispatch } = useApp();
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  /* — Formulaire événement — */
  const [form, setForm] = useState<EventConfig>({ ...state.event });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dirty =
    form.name !== state.event.name ||
    form.date !== state.event.date ||
    form.venue !== state.event.venue ||
    form.arenas !== state.event.arenas;

  const saveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 3) errs.name = "Nom trop court (3 caractères min.)";
    else if (form.name.trim().length > 100) errs.name = "Nom trop long (100 caractères max.)";
    if (!form.date.trim()) errs.date = "Date requise";
    else if (form.date.trim().length > 50) errs.date = "Date trop longue (50 caractères max.)";
    if (!form.venue.trim()) errs.venue = "Lieu requis";
    else if (form.venue.trim().length > 100) errs.venue = "Lieu trop long (100 caractères max.)";
    if (!Number.isInteger(form.arenas) || form.arenas < 1 || form.arenas > 8) errs.arenas = "Entre 1 et 8 aires (entier)";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    dispatch({ type: "UPDATE_EVENT", event: { ...form, name: form.name.trim(), date: form.date.trim(), venue: form.venue.trim() } });
    toast("Paramètres de l'événement enregistrés");
  };

  /* — Catégories — */
  const toggleClass = (catId: string) => {
    const closing = !state.disabledCats.includes(catId);
    if (closing) {
      const engaged = state.athletes.filter((a) => a.category === catId).length;
      if (engaged > 0) {
        toast(`Impossible : ${engaged} athlète(s) engagé(s) en ${classLabel(catId)}`, "error");
        return;
      }
      const status = state.catStatus[catId];
      if (status === "tirée" || status === "terminée") {
        toast("Impossible : un tableau est déjà généré pour cette catégorie", "error");
        return;
      }
    }
    dispatch({ type: "TOGGLE_CLASS", catId });
    toast(
      closing
        ? `${classLabel(catId)} fermée aux engagements`
        : `${classLabel(catId)} réouverte aux engagements`,
      "info"
    );
  };

  /* — Statistiques par club — */
  const clubStats = useMemo(() => {
    const map = new Map<string, { athletes: number; weighed: number; g: number; s: number; b: number }>();
    const ensure = (club: string) => {
      if (!map.has(club)) map.set(club, { athletes: 0, weighed: 0, g: 0, s: 0, b: 0 });
      return map.get(club)!;
    };
    state.athletes.forEach((a) => {
      const s = ensure(a.club);
      s.athletes += 1;
      if (a.status === "pesé") s.weighed += 1;
    });
    Object.values(state.results).forEach((p) => {
      const clubOf = (id: string) => state.athletes.find((a) => a.id === id)?.club ?? null;
      const g = clubOf(p.gold);
      const s = clubOf(p.silver);
      if (g) ensure(g).g += 1;
      if (s) ensure(s).s += 1;
      p.bronzes.forEach((id) => {
        const c = clubOf(id);
        if (c) ensure(c).b += 1;
      });
    });
    return Array.from(map.entries())
      .map(([club, s]) => ({ club, ...s }))
      .sort((x, y) => y.g * 3 + y.s + y.b - (x.g * 3 + x.s + x.b) || y.athletes - x.athletes);
  }, [state.athletes, state.results]);

  /* — Export / Import — */
  const exportJson = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dojang-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast("Sauvegarde JSON téléchargée");
  };

  const importJson = (file: File) => {
    if (!file.name.endsWith(".json")) {
      toast("Format de fichier invalide — fichier JSON requis", "error");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast("Fichier trop volumineux (max 10 Mo)", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as AppState;
        if (
          parsed.version !== 3 ||
          !Array.isArray(parsed.athletes) ||
          !parsed.event ||
          typeof parsed.event.name !== "string" ||
          typeof parsed.event.date !== "string" ||
          typeof parsed.event.venue !== "string" ||
          typeof parsed.event.arenas !== "number"
        ) {
          throw new Error("format");
        }
        if (parsed.athletes.length > 1000) {
          toast("Sauvegarde trop volumineuse (max 1000 athlètes)", "error");
          return;
        }
        dispatch({
          type: "IMPORT_STATE",
          state: {
            ...parsed,
            disabledCats: parsed.disabledCats ?? [],
            activity: parsed.activity ?? [],
          },
        });
        toast(`Sauvegarde restaurée — ${parsed.athletes.length} athlètes chargés`);
      } catch {
        toast("Fichier invalide : ce n'est pas une sauvegarde DOJANG (v3)", "error");
      }
    };
    reader.readAsText(file);
  };

  /* — Réinitialisations — */
  const [resetOpen, setResetOpen] = useState(false);
  const [wipeOpen, setWipeOpen] = useState(false);
  const [wipeWord, setWipeWord] = useState("");

  const doReset = () => {
    dispatch({ type: "RESET_ALL" });
    setResetOpen(false);
    toast("Données de démonstration FITKD restaurées", "info");
  };

  const doWipe = () => {
    const empty: AppState = {
      version: 3,
      event: state.event,
      athletes: [],
      brackets: {},
      catStatus: Object.fromEntries(WEIGHT_CLASSES.map((c) => [c.id, "ouverte" as const])),
      results: {},
      disabledCats: [],
      activity: [
        {
          id: uid("act"),
          time: new Date().toISOString(),
          kind: "donnees",
          label: "Compétition remise à zéro — toutes les données ont été effacées",
        },
      ],
    };
    dispatch({ type: "IMPORT_STATE", state: empty, label: "Nouvelle compétition vierge créée" });
    setWipeOpen(false);
    setWipeWord("");
    toast("Toutes les données ont été effacées", "info");
  };

  /* Resynchronise le formulaire après reset/import */
  useEffect(() => {
    setForm({ ...state.event });
  }, [state.event]);

  const totalMedals = clubStats.reduce((s, c) => s + c.g + c.s + c.b, 0);

  return (
    <div className="fade-up mx-auto max-w-7xl">
      <PageHead
        title="Administration"
        subtitle="Supervision & paramètres de la compétition"
        actions={
          <span className="badge text-gold">
            <IconGear className="h-3.5 w-3.5" />
            Accès organisateur
          </span>
        }
      />

      <div className="grid gap-6 xl:grid-cols-5">
        {/* ── Colonne principale ── */}
        <div className="space-y-6 xl:col-span-3">
          {/* Événement */}
          <Panel title="Paramètres de l'événement" kicker="Identité">
            <form onSubmit={saveEvent} className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="ev-name" className="label">Nom officiel</label>
                <input
                  id="ev-name"
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                {errors.name && <p className="mt-1.5 text-xs text-flame">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="ev-date" className="label">Dates</label>
                <input
                  id="ev-date"
                  className="input"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  placeholder="14–16 Mars 2026"
                />
                {errors.date && <p className="mt-1.5 text-xs text-flame">{errors.date}</p>}
              </div>
              <div>
                <label htmlFor="ev-arenas" className="label">Aires de combat</label>
                <input
                  id="ev-arenas"
                  type="number"
                  min={1}
                  max={8}
                  className="input"
                  value={form.arenas}
                  onChange={(e) => setForm({ ...form, arenas: Number(e.target.value) })}
                />
                {errors.arenas && <p className="mt-1.5 text-xs text-flame">{errors.arenas}</p>}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="ev-venue" className="label">Lieu</label>
                <input
                  id="ev-venue"
                  className="input"
                  value={form.venue}
                  onChange={(e) => setForm({ ...form, venue: e.target.value })}
                />
                {errors.venue && <p className="mt-1.5 text-xs text-flame">{errors.venue}</p>}
              </div>
              <div className="flex items-center gap-3 sm:col-span-2">
                <button type="submit" disabled={!dirty} className="btn btn-primary btn-sm">
                  <IconCheck className="h-3.5 w-3.5" />
                  Enregistrer
                </button>
                <button
                  type="button"
                  disabled={!dirty}
                  onClick={() => setForm({ ...state.event })}
                  className="btn btn-ghost btn-sm"
                >
                  Annuler
                </button>
                {dirty && (
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-gold">
                    Modifications non enregistrées
                  </span>
                )}
              </div>
            </form>
          </Panel>

          {/* Catégories de poids */}
          <Panel
            title="Catégories de poids"
            kicker="Engagements"
            actions={
              <span className="badge text-dune">
                {state.disabledCats.length > 0
                  ? `${state.disabledCats.length} fermée(s)`
                  : "Toutes ouvertes"}
              </span>
            }
          >
            <ul className="divide-y divide-husk/60">
              {WEIGHT_CLASSES.map((c) => {
                const disabled = state.disabledCats.includes(c.id);
                const engaged = state.athletes.filter((a) => a.category === c.id).length;
                const weighed = weighedIn(state, c.id).length;
                const status = state.catStatus[c.id];
                const locked = engaged > 0 || status === "tirée" || status === "terminée";
                return (
                  <li key={c.id} className="row-hover flex flex-wrap items-center gap-3 py-3.5">
                    <div className="min-w-0 flex-1">
                      <p className={`font-bold ${disabled ? "text-dune line-through" : "text-bone"}`}>
                        {c.label}
                      </p>
                      <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-dune">
                        {weighed} pesé(s) · {engaged} engagé(s)
                      </p>
                    </div>
                    <StatusBadge status={status} />
                    {disabled ? (
                      <span className="badge text-flame">
                        <IconLock className="h-3 w-3" />
                        Fermée
                      </span>
                    ) : (
                      <span className="badge text-forest">Ouverte</span>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleClass(c.id)}
                      title={
                        locked && !disabled
                          ? "Verrouillée : des athlètes sont engagés ou le tirage est fait"
                          : undefined
                      }
                      className={`btn btn-sm ${disabled ? "btn-ghost" : "btn-danger"}`}
                    >
                      {disabled ? "Rouvrir" : locked ? <IconLock className="h-3.5 w-3.5" /> : "Fermer"}
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 border-t border-husk pt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-dune">
              Une catégorie engagée (athlètes pesés ou tirage généré) ne peut pas être fermée.
            </p>
          </Panel>

          {/* Journal d'activité */}
          <Panel
            title="Journal d'activité"
            kicker="Audit"
            actions={<span className="badge text-dune">{state.activity.length} entrées</span>}
          >
            {state.activity.length === 0 ? (
              <p className="py-6 text-center text-sm text-dune">Aucune activité enregistrée.</p>
            ) : (
              <ol className="max-h-[420px] space-y-2 overflow-y-auto pr-2">
                {state.activity.slice(0, 30).map((a) => {
                  const meta = KIND_META[a.kind];
                  return (
                    <li
                      key={a.id}
                      className="row-hover flex items-start gap-3.5 border border-husk/60 px-4 py-3"
                    >
                      <span
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border ${meta.cls}`}
                        aria-hidden="true"
                      >
                        {meta.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm leading-snug text-bone">{a.label}</p>
                        <p className="mt-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-dune">
                          <span className={meta.cls.split(" ")[0]}>{meta.label}</span>
                          · {timeAgo(a.time)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </Panel>
        </div>

        {/* ── Colonne latérale ── */}
        <div className="space-y-6 xl:col-span-2">
          {/* Sauvegarde & données */}
          <Panel title="Sauvegarde & données" kicker="Intégrité">
            <div className="space-y-3">
              <button type="button" onClick={exportJson} className="btn btn-ghost w-full justify-start">
                <IconDownload className="h-4 w-4 text-gold" />
                Exporter la compétition (JSON)
              </button>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="btn btn-ghost w-full justify-start"
              >
                <IconUpload className="h-4 w-4 text-forest" />
                Restaurer une sauvegarde
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) importJson(f);
                  e.target.value = "";
                }}
              />
            </div>

            <div className="mt-6 border-t border-flame/30 pt-5">
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-flame">
                <IconAlert className="h-4 w-4" />
                Zone sensible
              </p>
              <div className="mt-3 space-y-3">
                <button
                  type="button"
                  onClick={() => setResetOpen(true)}
                  className="btn btn-ghost w-full justify-start hover:border-gold hover:text-gold"
                >
                  <IconReset className="h-4 w-4" />
                  Recharger la démonstration FITKD
                </button>
                <button
                  type="button"
                  onClick={() => setWipeOpen(true)}
                  className="btn btn-danger w-full justify-start"
                >
                  <IconAlert className="h-4 w-4" />
                  Effacer toutes les données
                </button>
              </div>
            </div>
          </Panel>

          {/* Statistiques par club */}
          <Panel
            title="Clubs & médailles"
            kicker="Saison"
            actions={
              <span className="badge text-gold">
                <IconMedal className="h-3.5 w-3.5" />
                {totalMedals} médailles
              </span>
            }
          >
            {clubStats.length === 0 ? (
              <p className="py-6 text-center text-sm text-dune">Aucun club engagé pour le moment.</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="th">Club</th>
                    <th className="th text-center">Ath.</th>
                    <th className="th text-center">Pesés</th>
                    <th className="th text-center">Méd.</th>
                  </tr>
                </thead>
                <tbody>
                  {clubStats.map((c) => (
                    <tr key={c.club} className="row-hover">
                      <td className="td">
                        <p className="font-semibold text-bone">{c.club}</p>
                        {(c.g > 0 || c.s > 0 || c.b > 0) && (
                          <p className="mt-1 flex items-center gap-2 font-mono text-[10px] text-dune">
                            <span className="flex items-center gap-1">
                              <span className="h-2 w-2 rounded-full bg-gold" /> {c.g}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="h-2 w-2 rounded-full bg-[#c8ccd4]" /> {c.s}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="h-2 w-2 rounded-full bg-[#c97f4a]" /> {c.b}
                            </span>
                          </p>
                        )}
                      </td>
                      <td className="td text-center font-mono text-sm text-bone">{c.athletes}</td>
                      <td className="td text-center font-mono text-sm text-forest">{c.weighed}</td>
                      <td className="td text-center font-mono text-sm font-bold text-gold">
                        {c.g + c.s + c.b}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Panel>
        </div>
      </div>

      {/* ── Modale : reset démo ── */}
      <Modal open={resetOpen} onClose={() => setResetOpen(false)} title="Recharger la démonstration">
        <p className="text-sm leading-relaxed text-dune">
          Les données actuelles (athlètes, tirages, résultats, journal) seront remplacées par le jeu
          de démonstration FITKD : 27 athlètes, 8 clubs ivoiriens et le tirage des Hommes −68 kg.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setResetOpen(false)}>
            Annuler
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={doReset}>
            <IconReset className="h-3.5 w-3.5" />
            Recharger
          </button>
        </div>
      </Modal>

      {/* ── Modale : effacement total ── */}
      <Modal open={wipeOpen} onClose={() => setWipeOpen(false)} title="Effacer toutes les données">
        <p className="text-sm leading-relaxed text-dune">
          Cette action supprime définitivement les <strong className="text-bone">{state.athletes.length} athlètes</strong>,{" "}
          tous les tableaux et les résultats de « {state.event.name} ». L'événement repartira à zéro.
        </p>
        <label htmlFor="wipe-word" className="label mt-5">
          Tapez <span className="text-flame">EFFACER</span> pour confirmer
        </label>
        <input
          id="wipe-word"
          className="input"
          value={wipeWord}
          onChange={(e) => setWipeWord(e.target.value)}
          placeholder="EFFACER"
        />
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setWipeOpen(false);
              setWipeWord("");
            }}
          >
            Annuler
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            disabled={wipeWord.trim().toUpperCase() !== "EFFACER"}
            onClick={doWipe}
          >
            <IconAlert className="h-3.5 w-3.5" />
            Tout effacer
          </button>
        </div>
      </Modal>
    </div>
  );
}

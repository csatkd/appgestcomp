import { useMemo, useState } from "react";
import { useApp } from "../lib/store";
import { CLUBS, classLabel } from "../lib/data";
import type { Athlete, Gender } from "../lib/types";
import { PageHead, Modal, EmptyState, StatusBadge, useToast } from "../components/ui";
import { IconPlus, IconSearch, IconTrash, IconUsers } from "../components/Icons";

interface FormState {
  firstName: string;
  lastName: string;
  gender: Gender;
  birthYear: string;
  club: string;
}

const emptyForm: FormState = {
  firstName: "",
  lastName: "",
  gender: "M",
  birthYear: "2002",
  club: CLUBS[0],
};

export default function Athletes() {
  const { state, dispatch } = useApp();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState<"tous" | Gender>("tous");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state.athletes.filter((a) => {
      if (genderFilter !== "tous" && a.gender !== genderFilter) return false;
      if (!q) return true;
      return (
        `${a.firstName} ${a.lastName}`.toLowerCase().includes(q) ||
        a.club.toLowerCase().includes(q) ||
        a.license.toLowerCase().includes(q)
      );
    });
  }, [state.athletes, query, genderFilter]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!form.firstName.trim()) errs.firstName = "Prénom requis";
    if (!form.lastName.trim()) errs.lastName = "Nom requis";
    const year = Number(form.birthYear);
    if (!year || year < 1940 || year > 2020) errs.birthYear = "Année entre 1940 et 2020";
    if (!form.club.trim()) errs.club = "Club requis";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const athlete: Athlete = {
      id: `ath-${Date.now().toString(36)}`,
      firstName: form.firstName.trim().toUpperCase(),
      lastName: form.lastName.trim().toUpperCase(),
      gender: form.gender,
      birthYear: year,
      club: form.club.trim(),
      license: `FITKD-26-${Math.floor(1000 + Math.random() * 9000)}`,
      weight: null,
      category: null,
      status: "inscrit",
    };
    dispatch({ type: "ADD_ATHLETE", athlete });
    toast(`${athlete.firstName} ${athlete.lastName} inscrit·e — passage à la pesée requis`);
    setForm(emptyForm);
    setOpen(false);
  };

  const remove = (a: Athlete) => {
    const inBracket = Object.values(state.brackets).some((arr) =>
      arr.some((m) => m.a === a.id || m.b === a.id)
    );
    if (inBracket) {
      toast("Impossible : cet athlète figure dans un tirage au sort", "error");
      return;
    }
    dispatch({ type: "DELETE_ATHLETE", id: a.id });
    toast(`${a.firstName} ${a.lastName} retiré·e de la compétition`, "info");
  };

  return (
    <div className="fade-up mx-auto max-w-6xl">
      <PageHead
        title="Athlètes"
        subtitle="Base de données de la compétition"
        actions={
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setOpen(true)}>
            <IconPlus className="h-3.5 w-3.5" />
            Inscrire un athlète
          </button>
        }
      />

      {/* Filtres */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dune" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par nom, club ou licence…"
            className="input pl-10"
            aria-label="Rechercher un athlète"
          />
        </div>
        <div className="flex gap-2">
          {(["tous", "M", "F"] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGenderFilter(g)}
              className={`cursor-pointer border px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-all ${
                genderFilter === g
                  ? "border-gold bg-gold font-semibold text-night"
                  : "border-husk text-dune hover:border-gold/60 hover:text-bone"
              }`}
            >
              {g === "tous" ? "Tous" : g === "M" ? "Hommes" : "Femmes"}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<IconUsers className="h-7 w-7" />}
          title="Aucun athlète trouvé"
          text="Modifiez votre recherche ou inscrivez un nouvel athlète pour alimenter la compétition."
        />
      ) : (
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr>
                <th className="th">Athlète</th>
                <th className="th">Club</th>
                <th className="th">Licence</th>
                <th className="th">Catégorie</th>
                <th className="th">Statut</th>
                <th className="th text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="row-hover">
                  <td className="td">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center border font-mono text-[11px] font-semibold ${
                          a.gender === "M" ? "border-chong/50 text-chong" : "border-flame/50 text-flame"
                        }`}
                        aria-hidden="true"
                      >
                        {a.firstName.charAt(0)}
                        {a.lastName.charAt(0)}
                      </span>
                      <div>
                        <p className="font-bold text-bone">
                          {a.firstName} <span className="uppercase">{a.lastName}</span>
                        </p>
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dune">
                          {a.gender === "M" ? "Homme" : "Femme"} · {a.birthYear}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="td text-dune">{a.club}</td>
                  <td className="td font-mono text-xs text-dune">{a.license}</td>
                  <td className="td">
                    {a.category ? (
                      <span className="text-sm text-bone">{classLabel(a.category)}</span>
                    ) : (
                      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-dune/60">
                        Non pesé
                      </span>
                    )}
                  </td>
                  <td className="td">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="td text-right">
                    <button
                      type="button"
                      onClick={() => remove(a)}
                      className="cursor-pointer p-2 text-dune transition-colors hover:text-flame"
                      aria-label={`Retirer ${a.firstName} ${a.lastName}`}
                      title="Retirer de la compétition"
                    >
                      <IconTrash className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-dune">
        {filtered.length} athlète{filtered.length > 1 ? "s" : ""} affiché
        {filtered.length > 1 ? "s" : ""}
      </p>

      {/* Modale d'inscription */}
      <Modal open={open} onClose={() => setOpen(false)} title="Inscrire un athlète">
        <form onSubmit={submit} noValidate className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="f-first" className="label">Prénom</label>
              <input
                id="f-first"
                className="input"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                placeholder="Aminata"
              />
              {errors.firstName && <p className="mt-1.5 text-xs text-flame">{errors.firstName}</p>}
            </div>
            <div>
              <label htmlFor="f-last" className="label">Nom</label>
              <input
                id="f-last"
                className="input"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                placeholder="SOW"
              />
              {errors.lastName && <p className="mt-1.5 text-xs text-flame">{errors.lastName}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <span className="label">Sexe</span>
              <div className="flex gap-2">
                {(["M", "F"] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setForm({ ...form, gender: g })}
                    className={`flex-1 cursor-pointer border px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-all ${
                      form.gender === g
                        ? "border-gold bg-gold font-semibold text-night"
                        : "border-husk text-dune hover:border-gold/60"
                    }`}
                  >
                    {g === "M" ? "Homme" : "Femme"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="f-year" className="label">Année de naissance</label>
              <input
                id="f-year"
                type="number"
                className="input"
                value={form.birthYear}
                onChange={(e) => setForm({ ...form, birthYear: e.target.value })}
                min={1940}
                max={2020}
              />
              {errors.birthYear && <p className="mt-1.5 text-xs text-flame">{errors.birthYear}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="f-club" className="label">Club</label>
            <input
              id="f-club"
              className="input"
              list="clubs-list"
              value={form.club}
              onChange={(e) => setForm({ ...form, club: e.target.value })}
              placeholder="Taekwondo Club d'Abidjan"
            />
            <datalist id="clubs-list">
              {CLUBS.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            {errors.club && <p className="mt-1.5 text-xs text-flame">{errors.club}</p>}
          </div>

          <div className="flex justify-end gap-3 border-t border-husk pt-4">
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              <IconPlus className="h-3.5 w-3.5" />
              Valider l'inscription
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

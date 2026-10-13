import { useMemo, useState } from "react";
import { useApp } from "../lib/store";
import { athleteName, classLabel } from "../lib/data";
import { PageHead, StatusBadge, useToast, Modal } from "../components/ui";
import { IconFlag, IconPlus, IconCheck, IconX, IconTrash } from "../components/Icons";
import type { Claim, ClaimStatus } from "../lib/types";
import PageBackground from "../components/PageBackground";
import { PAGE_BACKGROUNDS } from "../config/backgrounds";

export default function Claims() {
  const { state, dispatch } = useApp();
  const toast = useToast();
  const [filter, setFilter] = useState<ClaimStatus | "toutes">("toutes");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ matchId: "", athleteId: "", reason: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    if (filter === "toutes") return state.claims;
    return state.claims.filter((c) => c.status === filter);
  }, [state.claims, filter]);

  const stats = useMemo(() => {
    const total = state.claims.length;
    const pending = state.claims.filter((c) => c.status === "soumise" || c.status === "en_examen").length;
    const accepted = state.claims.filter((c) => c.status === "acceptee").length;
    const rejected = state.claims.filter((c) => c.status === "rejetee").length;
    return { total, pending, accepted, rejected };
  }, [state.claims]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.matchId) errs.matchId = "Sélectionnez un combat";
    if (!form.athleteId) errs.athleteId = "Sélectionnez un athlète";
    if (!form.reason.trim()) errs.reason = "Motif requis";
    else if (form.reason.trim().length < 10) errs.reason = "Motif trop court (10 caractères min.)";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const match = Object.values(state.brackets)
      .flat()
      .find((m) => m.id === form.matchId);
    if (!match) {
      toast("Combat introuvable", "error");
      return;
    }

    const claim: Claim = {
      id: `claim-${Date.now()}`,
      matchId: form.matchId,
      catId: match.catId,
      athleteId: form.athleteId,
      reason: form.reason.trim(),
      status: "soumise",
      submittedAt: new Date().toISOString(),
      resolvedAt: null,
      resolution: null,
    };

    dispatch({ type: "ADD_CLAIM", claim });
    toast("Réclamation soumise avec succès");
    setForm({ matchId: "", athleteId: "", reason: "" });
    setOpen(false);
  };

  const updateStatus = (id: string, status: ClaimStatus, resolution?: string) => {
    dispatch({ type: "UPDATE_CLAIM", id, status, resolution });
    const label = status === "acceptee" ? "acceptée" : status === "rejetee" ? "rejetée" : "mise en examen";
    toast(`Réclamation ${label}`);
  };

  const deleteClaim = (id: string) => {
    dispatch({ type: "DELETE_CLAIM", id });
    toast("Réclamation supprimée", "info");
  };

  const getMatchLabel = (matchId: string) => {
    const match = Object.values(state.brackets).flat().find((m) => m.id === matchId);
    if (!match) return "Combat inconnu";
    return `${classLabel(match.catId)} — ${athleteName(state.athletes, match.a)} vs ${athleteName(state.athletes, match.b)}`;
  };

  return (
    <div className="fade-up mx-auto max-w-6xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.claims} opacity={0.1} blur={3} />
      <PageHead
        title="Réclamations"
        subtitle="Gestion des contestations"
        actions={
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setOpen(true)}>
            <IconPlus className="h-3.5 w-3.5" />
            Nouvelle réclamation
          </button>
        }
      />

      {/* Statistiques */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="panel p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-dune">Total</p>
          <p className="mt-2 font-display text-3xl text-bone">{stats.total}</p>
        </div>
        <div className="panel p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">En attente</p>
          <p className="mt-2 font-display text-3xl text-gold">{stats.pending}</p>
        </div>
        <div className="panel p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-forest">Acceptées</p>
          <p className="mt-2 font-display text-3xl text-forest">{stats.accepted}</p>
        </div>
        <div className="panel p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-flame">Rejetées</p>
          <p className="mt-2 font-display text-3xl text-flame">{stats.rejected}</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="mb-5 flex flex-wrap gap-2">
        {(["toutes", "soumise", "en_examen", "acceptee", "rejetee"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`cursor-pointer border px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-all ${
              filter === s
                ? "border-gold bg-gold font-semibold text-night"
                : "border-husk text-dune hover:border-gold/60 hover:text-bone"
            }`}
          >
            {s === "toutes" ? "Toutes" : s === "soumise" ? "Soumises" : s === "en_examen" ? "En examen" : s === "acceptee" ? "Acceptées" : "Rejetées"}
          </button>
        ))}
      </div>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="panel flex flex-col items-center px-8 py-16 text-center">
          <IconFlag className="h-12 w-12 text-dune/40" />
          <p className="mt-4 font-display text-2xl uppercase tracking-wide text-bone">
            Aucune réclamation
          </p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-dune">
            {filter === "toutes"
              ? "Aucune réclamation n'a été soumise pour cette compétition."
              : `Aucune réclamation avec le statut "${filter}".`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((claim) => {
            const athlete = state.athletes.find((a) => a.id === claim.athleteId);
            const isPending = claim.status === "soumise" || claim.status === "en_examen";
            return (
              <div key={claim.id} className="panel p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <StatusBadge status={claim.status} />
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dune">
                        {new Date(claim.submittedAt).toLocaleString("fr-FR")}
                      </p>
                    </div>
                    <p className="mt-2 font-bold text-bone">
                      {athlete ? `${athlete.firstName} ${athlete.lastName}` : "Athlète inconnu"}
                    </p>
                    <p className="mt-1 text-sm text-dune">{getMatchLabel(claim.matchId)}</p>
                    <p className="mt-3 text-sm leading-relaxed text-bone">{claim.reason}</p>
                    {claim.resolution && (
                      <div className="mt-3 border-l-2 border-gold pl-3">
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-gold">
                          Décision
                        </p>
                        <p className="mt-1 text-sm text-bone">{claim.resolution}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {isPending && (
                      <>
                        <button
                          type="button"
                          onClick={() => updateStatus(claim.id, "en_examen")}
                          className="btn btn-ghost btn-sm"
                          title="Mettre en examen"
                        >
                          <IconCheck className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const resolution = prompt("Motif de l'acceptation :");
                            if (resolution) updateStatus(claim.id, "acceptee", resolution);
                          }}
                          className="btn btn-ghost btn-sm hover:border-forest hover:text-forest"
                          title="Accepter"
                        >
                          <IconCheck className="h-3.5 w-3.5 text-forest" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const resolution = prompt("Motif du rejet :");
                            if (resolution) updateStatus(claim.id, "rejetee", resolution);
                          }}
                          className="btn btn-ghost btn-sm hover:border-flame hover:text-flame"
                          title="Rejeter"
                        >
                          <IconX className="h-3.5 w-3.5 text-flame" />
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteClaim(claim.id)}
                      className="btn btn-ghost btn-sm hover:border-flame hover:text-flame"
                      title="Supprimer"
                    >
                      <IconTrash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modale */}
      <Modal open={open} onClose={() => setOpen(false)} title="Nouvelle réclamation">
        <form onSubmit={submit} noValidate className="space-y-4">
          <div>
            <label htmlFor="claim-match" className="label">Combat concerné</label>
            <select
              id="claim-match"
              className="input"
              value={form.matchId}
              onChange={(e) => setForm({ ...form, matchId: e.target.value })}
            >
              <option value="">Sélectionnez un combat</option>
              {Object.values(state.brackets)
                .flat()
                .filter((m) => m.status === "termine")
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {getMatchLabel(m.id)}
                  </option>
                ))}
            </select>
            {errors.matchId && <p className="mt-1.5 text-xs text-flame">{errors.matchId}</p>}
          </div>

          <div>
            <label htmlFor="claim-athlete" className="label">Athlète réclamant</label>
            <select
              id="claim-athlete"
              className="input"
              value={form.athleteId}
              onChange={(e) => setForm({ ...form, athleteId: e.target.value })}
            >
              <option value="">Sélectionnez un athlète</option>
              {state.athletes.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.firstName} {a.lastName}
                </option>
              ))}
            </select>
            {errors.athleteId && <p className="mt-1.5 text-xs text-flame">{errors.athleteId}</p>}
          </div>

          <div>
            <label htmlFor="claim-reason" className="label">Motif de la réclamation</label>
            <textarea
              id="claim-reason"
              className="input min-h-[100px]"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              placeholder="Décrivez précisément le motif de la réclamation..."
            />
            {errors.reason && <p className="mt-1.5 text-xs text-flame">{errors.reason}</p>}
          </div>

          <div className="flex justify-end gap-3 border-t border-husk pt-4">
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              <IconFlag className="h-3.5 w-3.5" />
              Soumettre
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

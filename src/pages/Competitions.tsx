import { useState } from "react";
import { useApp } from "../lib/store";
import { PageHead, Modal, useToast } from "../components/ui";
import { IconPlus, IconEdit, IconTrash, IconCheck } from "../components/Icons";
import type { Competition, CompetitionType, CompetitionStatus } from "../lib/types";
import PageBackground from "../components/PageBackground";
import { PAGE_BACKGROUNDS } from "../config/backgrounds";

export default function Competitions() {
  const { state, dispatch } = useApp();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    type: "locale" as CompetitionType,
    status: "brouillon" as CompetitionStatus,
    organizerId: "",
    startDate: "",
    endDate: "",
    venue: "",
    arenas: 2,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setForm({
      name: "",
      type: "locale",
      status: "brouillon",
      organizerId: "",
      startDate: "",
      endDate: "",
      venue: "",
      arenas: 2,
    });
    setErrors({});
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setOpen(true);
  };

  const openEdit = (comp: Competition) => {
    setForm({
      name: comp.name,
      type: comp.type,
      status: comp.status,
      organizerId: comp.organizerId,
      startDate: comp.startDate,
      endDate: comp.endDate,
      venue: comp.venue,
      arenas: comp.arenas,
    });
    setEditingId(comp.id);
    setOpen(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    
    if (!form.name.trim()) errs.name = "Nom requis";
    else if (form.name.trim().length < 3) errs.name = "Nom trop court (3 caractères min.)";
    
    if (!form.organizerId) errs.organizerId = "Organisateur requis";
    
    if (!form.startDate) errs.startDate = "Date de début requise";
    if (!form.endDate) errs.endDate = "Date de fin requise";
    
    if (form.startDate && form.endDate && form.startDate > form.endDate) {
      errs.endDate = "La date de fin doit être après la date de début";
    }
    
    if (!form.venue.trim()) errs.venue = "Lieu requis";
    
    if (form.arenas < 1 || form.arenas > 10) errs.arenas = "Entre 1 et 10 aires";
    
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (editingId) {
      dispatch({
        type: "UPDATE_COMPETITION",
        id: editingId,
        updates: {
          name: form.name.trim(),
          type: form.type,
          status: form.status,
          organizerId: form.organizerId,
          startDate: form.startDate,
          endDate: form.endDate,
          venue: form.venue.trim(),
          arenas: form.arenas,
        },
      });
      toast("Compétition mise à jour");
    } else {
      const newComp: Competition = {
        id: `comp-${Date.now()}`,
        name: form.name.trim(),
        type: form.type,
        status: form.status,
        organizerId: form.organizerId,
        startDate: form.startDate,
        endDate: form.endDate,
        venue: form.venue.trim(),
        arenas: form.arenas,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch({ type: "ADD_COMPETITION", competition: newComp });
      toast("Compétition créée");
    }

    setOpen(false);
    resetForm();
  };

  const deleteComp = (id: string) => {
    if (!confirm("Supprimer cette compétition ?")) return;
    dispatch({ type: "DELETE_COMPETITION", id });
    toast("Compétition supprimée", "info");
  };

  const setActive = (id: string) => {
    dispatch({ type: "SET_CURRENT_COMPETITION", id });
    toast("Compétition active changée");
  };

  const getTypeLabel = (type: CompetitionType) => {
    const labels = {
      locale: "Locale",
      nationale: "Nationale",
      internationale: "Internationale",
    };
    return labels[type];
  };

  const getStatusLabel = (status: CompetitionStatus) => {
    const labels = {
      brouillon: "Brouillon",
      active: "Active",
      terminee: "Terminée",
      archivee: "Archivée",
    };
    return labels[status];
  };

  const getStatusColor = (status: CompetitionStatus) => {
    const colors = {
      brouillon: "text-dune",
      active: "text-forest",
      terminee: "text-gold",
      archivee: "text-dune",
    };
    return colors[status];
  };

  const getOrganizerName = (id: string) => {
    const org = state.organizers.find((o) => o.id === id);
    return org ? org.name : "Organisateur inconnu";
  };

  return (
    <div className="fade-up mx-auto max-w-6xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.competitions} opacity={0.1} blur={3} />
      <PageHead
        title="Compétitions"
        subtitle="Gestion multi-événements"
        actions={
          <button type="button" className="btn btn-primary btn-sm" onClick={openCreate}>
            <IconPlus className="h-3.5 w-3.5" />
            Nouvelle compétition
          </button>
        }
      />

      {state.competitions.length === 0 ? (
        <div className="panel flex flex-col items-center px-8 py-16 text-center">
          <p className="font-display text-2xl uppercase tracking-wide text-bone">
            Aucune compétition
          </p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-dune">
            Créez votre première compétition pour commencer à gérer vos événements.
          </p>
          <button type="button" className="btn btn-primary mt-6" onClick={openCreate}>
            <IconPlus className="h-4 w-4" />
            Créer une compétition
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {state.competitions.map((comp) => {
            const isActive = state.currentCompetitionId === comp.id;
            return (
              <div
                key={comp.id}
                className={`panel p-6 transition-all ${
                  isActive ? "border-gold border-2" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-display text-xl uppercase tracking-wide text-bone">
                        {comp.name}
                      </h3>
                      {isActive && (
                        <span className="badge text-gold">
                          <IconCheck className="h-3 w-3" />
                          Active
                        </span>
                      )}
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dune">
                          Type
                        </p>
                        <p className="mt-1 font-semibold text-bone">
                          {getTypeLabel(comp.type)}
                        </p>
                      </div>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dune">
                          Statut
                        </p>
                        <p className={`mt-1 font-semibold ${getStatusColor(comp.status)}`}>
                          {getStatusLabel(comp.status)}
                        </p>
                      </div>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dune">
                          Dates
                        </p>
                        <p className="mt-1 text-bone">
                          {new Date(comp.startDate).toLocaleDateString("fr-FR")} -{" "}
                          {new Date(comp.endDate).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dune">
                          Lieu
                        </p>
                        <p className="mt-1 text-bone">{comp.venue}</p>
                      </div>
                    </div>
                    <div className="mt-3 text-sm">
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dune">
                        Organisateur
                      </p>
                      <p className="mt-1 text-bone">{getOrganizerName(comp.organizerId)}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {!isActive && (
                      <button
                        type="button"
                        onClick={() => setActive(comp.id)}
                        className="btn btn-ghost btn-sm"
                        title="Définir comme active"
                      >
                        <IconCheck className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => openEdit(comp)}
                      className="btn btn-ghost btn-sm"
                      title="Modifier"
                    >
                      <IconEdit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteComp(comp.id)}
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

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          resetForm();
        }}
        title={editingId ? "Modifier la compétition" : "Nouvelle compétition"}
      >
        <form onSubmit={submit} noValidate className="space-y-4">
          <div>
            <label htmlFor="comp-name" className="label">
              Nom de la compétition
            </label>
            <input
              id="comp-name"
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ex: Open d'Abidjan 2026"
            />
            {errors.name && <p className="mt-1.5 text-xs text-flame">{errors.name}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="comp-type" className="label">
                Type
              </label>
              <select
                id="comp-type"
                className="input"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as CompetitionType })}
              >
                <option value="locale">Locale</option>
                <option value="nationale">Nationale</option>
                <option value="internationale">Internationale</option>
              </select>
            </div>
            <div>
              <label htmlFor="comp-status" className="label">
                Statut
              </label>
              <select
                id="comp-status"
                className="input"
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as CompetitionStatus })
                }
              >
                <option value="brouillon">Brouillon</option>
                <option value="active">Active</option>
                <option value="terminee">Terminée</option>
                <option value="archivee">Archivée</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="comp-organizer" className="label">
              Organisateur
            </label>
            <select
              id="comp-organizer"
              className="input"
              value={form.organizerId}
              onChange={(e) => setForm({ ...form, organizerId: e.target.value })}
            >
              <option value="">Sélectionnez un organisateur</option>
              {state.organizers.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
            {errors.organizerId && (
              <p className="mt-1.5 text-xs text-flame">{errors.organizerId}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="comp-start" className="label">
                Date de début
              </label>
              <input
                id="comp-start"
                type="date"
                className="input"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
              {errors.startDate && (
                <p className="mt-1.5 text-xs text-flame">{errors.startDate}</p>
              )}
            </div>
            <div>
              <label htmlFor="comp-end" className="label">
                Date de fin
              </label>
              <input
                id="comp-end"
                type="date"
                className="input"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
              {errors.endDate && (
                <p className="mt-1.5 text-xs text-flame">{errors.endDate}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="comp-venue" className="label">
              Lieu
            </label>
            <input
              id="comp-venue"
              className="input"
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
              placeholder="Ex: Palais des Sports, Abidjan"
            />
            {errors.venue && <p className="mt-1.5 text-xs text-flame">{errors.venue}</p>}
          </div>

          <div>
            <label htmlFor="comp-arenas" className="label">
              Nombre d'aires de combat
            </label>
            <input
              id="comp-arenas"
              type="number"
              min="1"
              max="10"
              className="input"
              value={form.arenas}
              onChange={(e) => setForm({ ...form, arenas: Number(e.target.value) })}
            />
            {errors.arenas && <p className="mt-1.5 text-xs text-flame">{errors.arenas}</p>}
          </div>

          <div className="flex justify-end gap-3 border-t border-husk pt-4">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
            >
              Annuler
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              {editingId ? "Mettre à jour" : "Créer"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

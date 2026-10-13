import { useState } from "react";
import { useApp } from "../lib/store";
import { PageHead, Modal, useToast, StatusBadge } from "../components/ui";
import { IconPlus, IconEdit, IconTrash } from "../components/Icons";
import type { Referee } from "../lib/types";
import PageBackground from "../components/PageBackground";
import { PAGE_BACKGROUNDS } from "../config/backgrounds";

export default function Referees() {
  const { state, dispatch } = useApp();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    license: "",
    grade: "",
    phone: "",
    email: "",
    city: "",
    status: "actif" as "actif" | "inactif" | "suspendu",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      license: "",
      grade: "",
      phone: "",
      email: "",
      city: "",
      status: "actif",
    });
    setErrors({});
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setOpen(true);
  };

  const openEdit = (referee: Referee) => {
    setForm({
      firstName: referee.firstName,
      lastName: referee.lastName,
      license: referee.license,
      grade: referee.grade,
      phone: referee.phone,
      email: referee.email,
      city: referee.city,
      status: referee.status,
    });
    setEditingId(referee.id);
    setOpen(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    
    if (!form.firstName.trim()) errs.firstName = "Prénom requis";
    if (!form.lastName.trim()) errs.lastName = "Nom requis";
    if (!form.license.trim()) errs.license = "Licence requise";
    if (!form.grade.trim()) errs.grade = "Grade requis";
    if (!form.city.trim()) errs.city = "Ville requise";
    
    if (!form.email.trim()) errs.email = "Email requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Email invalide";
    }
    
    if (!form.phone.trim()) errs.phone = "Téléphone requis";
    else if (!/^[+]?[\d\s-]{8,}$/.test(form.phone)) {
      errs.phone = "Numéro de téléphone invalide";
    }
    
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (editingId) {
      dispatch({
        type: "UPDATE_REFEREE",
        id: editingId,
        updates: {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          license: form.license.trim(),
          grade: form.grade.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          city: form.city.trim(),
          status: form.status,
        },
      });
      toast("Arbitre mis à jour");
    } else {
      const newReferee: Referee = {
        id: `ref-${Date.now()}`,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        license: form.license.trim(),
        grade: form.grade.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        city: form.city.trim(),
        status: form.status,
        matchesCount: 0,
      };
      dispatch({ type: "ADD_REFEREE", referee: newReferee });
      toast("Arbitre ajouté");
    }

    setOpen(false);
    resetForm();
  };

  const deleteReferee = (id: string) => {
    if (!confirm("Supprimer cet arbitre ?")) return;
    dispatch({ type: "DELETE_REFEREE", id });
    toast("Arbitre supprimé", "info");
  };

  const getStatusColor = (status: Referee["status"]) => {
    const colors = {
      actif: "text-forest",
      inactif: "text-dune",
      suspendu: "text-flame",
    };
    return colors[status];
  };

  return (
    <div className="fade-up mx-auto max-w-6xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.live} opacity={0.08} blur={3} />
      <PageHead
        title="Arbitres"
        subtitle="Gestion des officiels de combat"
        actions={
          <button type="button" className="btn btn-primary btn-sm" onClick={openCreate}>
            <IconPlus className="h-3.5 w-3.5" />
            Nouvel arbitre
          </button>
        }
      />

      {state.referees.length === 0 ? (
        <div className="panel flex flex-col items-center px-8 py-16 text-center">
          <p className="font-display text-2xl uppercase tracking-wide text-bone">
            Aucun arbitre enregistré
          </p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-dune">
            Ajoutez votre premier arbitre pour commencer à gérer les officiels de combat.
          </p>
          <button type="button" className="btn btn-primary mt-6" onClick={openCreate}>
            <IconPlus className="h-4 w-4" />
            Ajouter un arbitre
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {state.referees.map((referee) => (
            <div key={referee.id} className="panel p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-xl uppercase tracking-wide text-bone">
                      {referee.firstName} {referee.lastName}
                    </h3>
                    <StatusBadge status={referee.status} />
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dune">
                        Licence
                      </p>
                      <p className="mt-1 text-bone">{referee.license}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dune">
                        Grade
                      </p>
                      <p className="mt-1 text-gold font-semibold">{referee.grade}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dune">
                        Ville
                      </p>
                      <p className="mt-1 text-bone">{referee.city}</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dune">
                        Email
                      </p>
                      <p className="mt-1 text-bone">{referee.email}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dune">
                        Téléphone
                      </p>
                      <p className="mt-1 text-bone">{referee.phone}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dune">
                        Matchs arbitrés
                      </p>
                      <p className="mt-1 text-bone">{referee.matchesCount}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(referee)}
                    className="btn btn-ghost btn-sm"
                    title="Modifier"
                  >
                    <IconEdit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteReferee(referee.id)}
                    className="btn btn-ghost btn-sm hover:border-flame hover:text-flame"
                    title="Supprimer"
                  >
                    <IconTrash className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          resetForm();
        }}
        title={editingId ? "Modifier l'arbitre" : "Nouvel arbitre"}
      >
        <form onSubmit={submit} noValidate className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ref-firstName" className="label">
                Prénom
              </label>
              <input
                id="ref-firstName"
                className="input"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                placeholder="Ex: Ibrahim"
              />
              {errors.firstName && <p className="mt-1.5 text-xs text-flame">{errors.firstName}</p>}
            </div>
            <div>
              <label htmlFor="ref-lastName" className="label">
                Nom
              </label>
              <input
                id="ref-lastName"
                className="input"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                placeholder="Ex: Koné"
              />
              {errors.lastName && <p className="mt-1.5 text-xs text-flame">{errors.lastName}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ref-license" className="label">
                Licence
              </label>
              <input
                id="ref-license"
                className="input"
                value={form.license}
                onChange={(e) => setForm({ ...form, license: e.target.value })}
                placeholder="Ex: FITKD-ARB-2024-001"
              />
              {errors.license && <p className="mt-1.5 text-xs text-flame">{errors.license}</p>}
            </div>
            <div>
              <label htmlFor="ref-grade" className="label">
                Grade
              </label>
              <input
                id="ref-grade"
                className="input"
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
                placeholder="Ex: Ceinture noire 4e Dan"
              />
              {errors.grade && <p className="mt-1.5 text-xs text-flame">{errors.grade}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="ref-city" className="label">
              Ville
            </label>
            <input
              id="ref-city"
              className="input"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="Ex: Abidjan"
            />
            {errors.city && <p className="mt-1.5 text-xs text-flame">{errors.city}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ref-email" className="label">
                Email
              </label>
              <input
                id="ref-email"
                type="email"
                className="input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="arbitre@example.com"
              />
              {errors.email && <p className="mt-1.5 text-xs text-flame">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="ref-phone" className="label">
                Téléphone
              </label>
              <input
                id="ref-phone"
                type="tel"
                className="input"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+225 07 12 34 56 78"
              />
              {errors.phone && <p className="mt-1.5 text-xs text-flame">{errors.phone}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="ref-status" className="label">
              Statut
            </label>
            <select
              id="ref-status"
              className="input"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as any })}
            >
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
              <option value="suspendu">Suspendu</option>
            </select>
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
              {editingId ? "Mettre à jour" : "Ajouter"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

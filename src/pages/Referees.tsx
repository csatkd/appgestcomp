import { useState } from "react";
import { useApp } from "../lib/store";
import { PageHead, Modal, useToast, StatusBadge } from "../components/ui";
import { IconPlus, IconEdit, IconTrash, IconUsers } from "../components/Icons";
import PageBackground from "../components/PageBackground";
import type { Referee } from "../lib/types";

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
    matchesCount: 0,
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
      matchesCount: 0,
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
      matchesCount: referee.matchesCount,
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
    
    if (!form.phone.trim()) errs.phone = "Téléphone requis";
    else if (!/^[+]?[\d\s-]{8,}$/.test(form.phone)) {
      errs.phone = "Numéro de téléphone invalide";
    }
    
    if (!form.email.trim()) errs.email = "Email requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Email invalide";
    }
    
    if (!form.city.trim()) errs.city = "Ville requise";
    
    if (form.matchesCount < 0) errs.matchesCount = "Nombre de matchs invalide";
    
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
          matchesCount: form.matchesCount,
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
        matchesCount: form.matchesCount,
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

  return (
    <div className="fade-up mx-auto max-w-6xl">
      <PageBackground imageUrl="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1920" opacity={0.08} blur={3} />
      
      <PageHead
        title="Arbitres"
        subtitle="Gestion du corps arbitral"
        actions={
          <button type="button" className="btn btn-primary btn-sm" onClick={openCreate}>
            <IconPlus className="h-3.5 w-3.5" />
            Nouvel arbitre
          </button>
        }
      />

      {state.referees.length === 0 ? (
        <div className="panel flex flex-col items-center px-8 py-16 text-center">
          <IconUsers className="h-16 w-16 text-dune/40 mb-4" />
          <p className="font-display text-2xl uppercase tracking-wide text-bone">
            Aucun arbitre enregistré
          </p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-dune">
            Ajoutez votre premier arbitre pour commencer à gérer les affectations.
          </p>
          <button type="button" className="btn btn-primary mt-6" onClick={openCreate}>
            <IconPlus className="h-4 w-4" />
            Ajouter un arbitre
          </button>
        </div>
      ) : (
        <div className="panel overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-husk">
                <th className="text-left py-3 px-4 font-mono text-xs uppercase tracking-wider text-dune">
                  Arbitre
                </th>
                <th className="text-left py-3 px-4 font-mono text-xs uppercase tracking-wider text-dune">
                  Licence
                </th>
                <th className="text-left py-3 px-4 font-mono text-xs uppercase tracking-wider text-dune">
                  Grade
                </th>
                <th className="text-left py-3 px-4 font-mono text-xs uppercase tracking-wider text-dune">
                  Ville
                </th>
                <th className="text-left py-3 px-4 font-mono text-xs uppercase tracking-wider text-dune">
                  Contact
                </th>
                <th className="text-left py-3 px-4 font-mono text-xs uppercase tracking-wider text-dune">
                  Statut
                </th>
                <th className="text-left py-3 px-4 font-mono text-xs uppercase tracking-wider text-dune">
                  Matchs
                </th>
                <th className="text-right py-3 px-4 font-mono text-xs uppercase tracking-wider text-dune">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {state.referees.map((referee) => (
                <tr key={referee.id} className="border-b border-husk/50 hover:bg-bark/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/20 text-gold font-semibold">
                        {referee.firstName[0]}{referee.lastName[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-bone">
                          {referee.firstName} {referee.lastName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-sm text-dune">
                    {referee.license}
                  </td>
                  <td className="py-3 px-4 text-sm text-bone">
                    {referee.grade}
                  </td>
                  <td className="py-3 px-4 text-sm text-dune">
                    {referee.city}
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1 text-sm">
                      <a href={`mailto:${referee.email}`} className="block text-gold hover:underline">
                        {referee.email}
                      </a>
                      <a href={`tel:${referee.phone}`} className="block text-dune hover:text-gold">
                        {referee.phone}
                      </a>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={referee.status} />
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-display text-lg text-gold">
                      {referee.matchesCount}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2 justify-end">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                placeholder="Ex: Moussa"
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
                placeholder="Ex: ARB-2024-001"
              />
              {errors.license && <p className="mt-1.5 text-xs text-flame">{errors.license}</p>}
            </div>
            <div>
              <label htmlFor="ref-grade" className="label">
                Grade
              </label>
              <select
                id="ref-grade"
                className="input"
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
              >
                <option value="">Sélectionnez un grade</option>
                <option value="Arbitre International">Arbitre International</option>
                <option value="Arbitre Continental">Arbitre Continental</option>
                <option value="Arbitre National">Arbitre National</option>
                <option value="Arbitre Régional">Arbitre Régional</option>
              </select>
              {errors.grade && <p className="mt-1.5 text-xs text-flame">{errors.grade}</p>}
            </div>
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
                placeholder="+225 07 11 22 33 44"
              />
              {errors.phone && <p className="mt-1.5 text-xs text-flame">{errors.phone}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
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
          </div>

          <div>
            <label htmlFor="ref-matches" className="label">
              Nombre de matchs arbitrés
            </label>
            <input
              id="ref-matches"
              type="number"
              min="0"
              className="input"
              value={form.matchesCount}
              onChange={(e) => setForm({ ...form, matchesCount: Number(e.target.value) })}
            />
            {errors.matchesCount && (
              <p className="mt-1.5 text-xs text-flame">{errors.matchesCount}</p>
            )}
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

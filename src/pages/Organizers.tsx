import { useState } from "react";
import { useApp } from "../lib/store";
import { PageHead, Modal, useToast } from "../components/ui";
import { IconPlus, IconEdit, IconTrash } from "../components/Icons";
import type { Organizer } from "../lib/types";

export default function Organizers() {
  const { state, dispatch } = useApp();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      organization: "",
      phone: "",
    });
    setErrors({});
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setOpen(true);
  };

  const openEdit = (org: Organizer) => {
    setForm({
      name: org.name,
      email: org.email,
      organization: org.organization,
      phone: org.phone || "",
    });
    setEditingId(org.id);
    setOpen(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    
    if (!form.name.trim()) errs.name = "Nom requis";
    else if (form.name.trim().length < 3) errs.name = "Nom trop court (3 caractères min.)";
    
    if (!form.email.trim()) errs.email = "Email requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Email invalide";
    }
    
    if (!form.organization.trim()) errs.organization = "Organisation requise";
    
    if (form.phone && !/^[+]?[\d\s-]{8,}$/.test(form.phone)) {
      errs.phone = "Numéro de téléphone invalide";
    }
    
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (editingId) {
      dispatch({
        type: "UPDATE_ORGANIZER",
        id: editingId,
        updates: {
          name: form.name.trim(),
          email: form.email.trim(),
          organization: form.organization.trim(),
          phone: form.phone.trim() || undefined,
        },
      });
      toast("Organisateur mis à jour");
    } else {
      const newOrg: Organizer = {
        id: `org-${Date.now()}`,
        name: form.name.trim(),
        email: form.email.trim(),
        organization: form.organization.trim(),
        phone: form.phone.trim() || undefined,
      };
      dispatch({ type: "ADD_ORGANIZER", organizer: newOrg });
      toast("Organisateur ajouté");
    }

    setOpen(false);
    resetForm();
  };

  const deleteOrg = (id: string) => {
    const hasCompetitions = state.competitions.some((c) => c.organizerId === id);
    if (hasCompetitions) {
      toast("Impossible : cet organisateur a des compétitions associées", "error");
      return;
    }
    if (!confirm("Supprimer cet organisateur ?")) return;
    dispatch({ type: "DELETE_ORGANIZER", id });
    toast("Organisateur supprimé", "info");
  };

  return (
    <div className="fade-up mx-auto max-w-6xl">
      <PageHead
        title="Organisateurs"
        subtitle="Gestion des entités organisatrices"
        actions={
          <button type="button" className="btn btn-primary btn-sm" onClick={openCreate}>
            <IconPlus className="h-3.5 w-3.5" />
            Nouvel organisateur
          </button>
        }
      />

      {state.organizers.length === 0 ? (
        <div className="panel flex flex-col items-center px-8 py-16 text-center">
          <p className="font-display text-2xl uppercase tracking-wide text-bone">
            Aucun organisateur
          </p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-dune">
            Ajoutez votre premier organisateur pour commencer à créer des compétitions.
          </p>
          <button type="button" className="btn btn-primary mt-6" onClick={openCreate}>
            <IconPlus className="h-4 w-4" />
            Ajouter un organisateur
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {state.organizers.map((org) => {
            const compCount = state.competitions.filter((c) => c.organizerId === org.id).length;
            return (
              <div key={org.id} className="panel p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-display text-xl uppercase tracking-wide text-bone">
                      {org.name}
                    </h3>
                    <div className="mt-3 grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dune">
                          Email
                        </p>
                        <p className="mt-1 text-bone">{org.email}</p>
                      </div>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dune">
                          Organisation
                        </p>
                        <p className="mt-1 text-bone">{org.organization}</p>
                      </div>
                      {org.phone && (
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dune">
                            Téléphone
                          </p>
                          <p className="mt-1 text-bone">{org.phone}</p>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 text-sm">
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dune">
                        Compétitions
                      </p>
                      <p className="mt-1 text-bone">
                        {compCount} compétition{compCount > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(org)}
                      className="btn btn-ghost btn-sm"
                      title="Modifier"
                    >
                      <IconEdit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteOrg(org.id)}
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
        title={editingId ? "Modifier l'organisateur" : "Nouvel organisateur"}
      >
        <form onSubmit={submit} noValidate className="space-y-4">
          <div>
            <label htmlFor="org-name" className="label">
              Nom de l'organisateur
            </label>
            <input
              id="org-name"
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ex: Fédération Ivoirienne de Taekwondo"
            />
            {errors.name && <p className="mt-1.5 text-xs text-flame">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="org-email" className="label">
              Email
            </label>
            <input
              id="org-email"
              type="email"
              className="input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="contact@example.com"
            />
            {errors.email && <p className="mt-1.5 text-xs text-flame">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="org-org" className="label">
              Organisation
            </label>
            <input
              id="org-org"
              className="input"
              value={form.organization}
              onChange={(e) => setForm({ ...form, organization: e.target.value })}
              placeholder="Ex: FITKD"
            />
            {errors.organization && (
              <p className="mt-1.5 text-xs text-flame">{errors.organization}</p>
            )}
          </div>

          <div>
            <label htmlFor="org-phone" className="label">
              Téléphone (optionnel)
            </label>
            <input
              id="org-phone"
              type="tel"
              className="input"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+225 27 22 44 55 66"
            />
            {errors.phone && <p className="mt-1.5 text-xs text-flame">{errors.phone}</p>}
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

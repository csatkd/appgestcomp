import { useState } from "react";
import { useApp } from "../lib/store";
import { PageHead, Modal, useToast } from "../components/ui";
import { IconPlus, IconEdit, IconTrash } from "../components/Icons";
import type { Club } from "../lib/types";
import PageBackground from "../components/PageBackground";
import { PAGE_BACKGROUNDS } from "../config/backgrounds";

export default function Clubs() {
  const { state, dispatch } = useApp();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    city: "",
    region: "",
    president: "",
    email: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setForm({
      name: "",
      city: "",
      region: "",
      president: "",
      email: "",
      phone: "",
      address: "",
    });
    setErrors({});
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setOpen(true);
  };

  const openEdit = (club: Club) => {
    setForm({
      name: club.name,
      city: club.city,
      region: club.region,
      president: club.president,
      email: club.email,
      phone: club.phone,
      address: club.address,
    });
    setEditingId(club.id);
    setOpen(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    
    if (!form.name.trim()) errs.name = "Nom requis";
    else if (form.name.trim().length < 3) errs.name = "Nom trop court (3 caractères min.)";
    
    if (!form.city.trim()) errs.city = "Ville requise";
    if (!form.region.trim()) errs.region = "Région requise";
    if (!form.president.trim()) errs.president = "Président requis";
    if (!form.address.trim()) errs.address = "Adresse requise";
    
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
        type: "UPDATE_CLUB",
        id: editingId,
        updates: {
          name: form.name.trim(),
          city: form.city.trim(),
          region: form.region.trim(),
          president: form.president.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
        },
      });
      toast("Club mis à jour");
    } else {
      const newClub: Club = {
        id: `club-${Date.now()}`,
        name: form.name.trim(),
        city: form.city.trim(),
        region: form.region.trim(),
        president: form.president.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        createdAt: new Date().toISOString(),
        athleteCount: 0,
      };
      dispatch({ type: "ADD_CLUB", club: newClub });
      toast("Club ajouté");
    }

    setOpen(false);
    resetForm();
  };

  const deleteClub = (id: string) => {
    const club = state.clubs.find((c) => c.id === id);
    if (!club) return;
    
    const hasAthletes = state.athletes.some((a) => a.club === club.name);
    if (hasAthletes) {
      toast("Impossible : ce club a des athlètes associés", "error");
      return;
    }
    if (!confirm("Supprimer ce club ?")) return;
    dispatch({ type: "DELETE_CLUB", id });
    toast("Club supprimé", "info");
  };

  const getAthleteCount = (clubName: string) => {
    return state.athletes.filter((a) => a.club === clubName).length;
  };

  return (
    <div className="fade-up mx-auto max-w-6xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.dashboard} opacity={0.08} blur={3} />
      <PageHead
        title="Clubs"
        subtitle="Gestion des clubs et équipes"
        actions={
          <button type="button" className="btn btn-primary btn-sm" onClick={openCreate}>
            <IconPlus className="h-3.5 w-3.5" />
            Nouveau club
          </button>
        }
      />

      {state.clubs.length === 0 ? (
        <div className="panel flex flex-col items-center px-8 py-16 text-center">
          <p className="font-display text-2xl uppercase tracking-wide text-bone">
            Aucun club enregistré
          </p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-dune">
            Ajoutez votre premier club pour commencer à gérer vos équipes.
          </p>
          <button type="button" className="btn btn-primary mt-6" onClick={openCreate}>
            <IconPlus className="h-4 w-4" />
            Ajouter un club
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {state.clubs.map((club) => {
            const athleteCount = getAthleteCount(club.name);
            return (
              <div key={club.id} className="panel p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-display text-xl uppercase tracking-wide text-bone">
                      {club.name}
                    </h3>
                    <div className="mt-3 grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dune">
                          Ville
                        </p>
                        <p className="mt-1 text-bone">{club.city}</p>
                      </div>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dune">
                          Région
                        </p>
                        <p className="mt-1 text-bone">{club.region}</p>
                      </div>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dune">
                          Athlètes
                        </p>
                        <p className="mt-1 text-gold font-semibold">{athleteCount}</p>
                      </div>
                    </div>
                    <div className="mt-3 text-sm">
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dune">
                        Président
                      </p>
                      <p className="mt-1 text-bone">{club.president}</p>
                    </div>
                    <div className="mt-3 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dune">
                          Email
                        </p>
                        <p className="mt-1 text-bone">{club.email}</p>
                      </div>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dune">
                          Téléphone
                        </p>
                        <p className="mt-1 text-bone">{club.phone}</p>
                      </div>
                    </div>
                    <div className="mt-3 text-sm">
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dune">
                        Adresse
                      </p>
                      <p className="mt-1 text-bone">{club.address}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(club)}
                      className="btn btn-ghost btn-sm"
                      title="Modifier"
                    >
                      <IconEdit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteClub(club.id)}
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
        title={editingId ? "Modifier le club" : "Nouveau club"}
      >
        <form onSubmit={submit} noValidate className="space-y-4">
          <div>
            <label htmlFor="club-name" className="label">
              Nom du club
            </label>
            <input
              id="club-name"
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ex: Taekwondo Club d'Abidjan"
            />
            {errors.name && <p className="mt-1.5 text-xs text-flame">{errors.name}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="club-city" className="label">
                Ville
              </label>
              <input
                id="club-city"
                className="input"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Ex: Abidjan"
              />
              {errors.city && <p className="mt-1.5 text-xs text-flame">{errors.city}</p>}
            </div>
            <div>
              <label htmlFor="club-region" className="label">
                Région
              </label>
              <input
                id="club-region"
                className="input"
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                placeholder="Ex: Lagunes"
              />
              {errors.region && <p className="mt-1.5 text-xs text-flame">{errors.region}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="club-president" className="label">
              Président(e)
            </label>
            <input
              id="club-president"
              className="input"
              value={form.president}
              onChange={(e) => setForm({ ...form, president: e.target.value })}
              placeholder="Ex: M. Kouamé"
            />
            {errors.president && <p className="mt-1.5 text-xs text-flame">{errors.president}</p>}
          </div>

          <div>
            <label htmlFor="club-address" className="label">
              Adresse
            </label>
            <input
              id="club-address"
              className="input"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Ex: Cocody, Abidjan"
            />
            {errors.address && <p className="mt-1.5 text-xs text-flame">{errors.address}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="club-email" className="label">
                Email
              </label>
              <input
                id="club-email"
                type="email"
                className="input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="club@example.com"
              />
              {errors.email && <p className="mt-1.5 text-xs text-flame">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="club-phone" className="label">
                Téléphone
              </label>
              <input
                id="club-phone"
                type="tel"
                className="input"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+225 27 22 44 55 66"
              />
              {errors.phone && <p className="mt-1.5 text-xs text-flame">{errors.phone}</p>}
            </div>
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

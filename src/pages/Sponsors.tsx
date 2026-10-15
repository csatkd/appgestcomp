import { useState } from "react";
import { useApp } from "../lib/store";
import { Modal, useToast, StatusBadge } from "../components/ui";
import { IconPlus, IconEdit, IconTrash, IconEye, IconFile, IconCalendar } from "../components/Icons";
import { PaymentsManager } from "../components/PaymentsManager";
import { CommunicationsManager } from "../components/CommunicationsManager";
import type { Sponsor, SponsorType, SponsorLevel, SponsorStatus, SponsorVisibility } from "../lib/types";

const SPONSOR_TYPES: { value: SponsorType; label: string }[] = [
  { value: "principal", label: "Sponsor Principal" },
  { value: "officiel", label: "Sponsor Officiel" },
  { value: "partenaire", label: "Partenaire" },
  { value: "media", label: "Partenaire Média" },
  { value: "technique", label: "Partenaire Technique" },
];

const SPONSOR_LEVELS: { value: SponsorLevel; label: string; color: string }[] = [
  { value: "or", label: "Or", color: "text-yellow-500 border-yellow-500" },
  { value: "argent", label: "Argent", color: "text-gray-400 border-gray-400" },
  { value: "bronze", label: "Bronze", color: "text-orange-600 border-orange-600" },
];

const SPONSOR_STATUSES: { value: SponsorStatus; label: string }[] = [
  { value: "actif", label: "Actif" },
  { value: "en_attente", label: "En attente" },
  { value: "expire", label: "Expiré" },
];

const VISIBILITY_OPTIONS: { value: SponsorVisibility; label: string }[] = [
  { value: "site_web", label: "Site web" },
  { value: "tv", label: "Diffusion TV" },
  { value: "affiches", label: "Affiches" },
  { value: "maillots", label: "Maillots" },
  { value: "stand", label: "Stand" },
  { value: "reseaux_sociaux", label: "Réseaux sociaux" },
  { value: "presse", label: "Communiqués de presse" },
];

export default function Sponsors() {
  const { state, dispatch } = useApp();
  const toast = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [viewingSponsor, setViewingSponsor] = useState<Sponsor | null>(null);
  const [advancedTab, setAdvancedTab] = useState<"payments" | "communications" | "visibility">("payments");

  const [filterType, setFilterType] = useState<SponsorType | "all">("all");
  const [filterLevel, setFilterLevel] = useState<SponsorLevel | "all">("all");
  const [filterStatus, setFilterStatus] = useState<SponsorStatus | "all">("all");

  const [formData, setFormData] = useState({
    name: "",
    type: "partenaire" as SponsorType,
    level: "bronze" as SponsorLevel,
    logo: "",
    logoHighRes: "",
    website: "",
    contact: "",
    email: "",
    phone: "",
    startDate: "",
    endDate: "",
    status: "en_attente" as SponsorStatus,
    amount: "",
    description: "",
    visibility: [] as SponsorVisibility[],
    benefits: [] as string[],
    contractFile: "",
    notes: "",
  });

  const filteredSponsors = state.sponsors.filter((sponsor) => {
    if (filterType !== "all" && sponsor.type !== filterType) return false;
    if (filterLevel !== "all" && sponsor.level !== filterLevel) return false;
    if (filterStatus !== "all" && sponsor.status !== filterStatus) return false;
    return true;
  });

  const openCreateModal = () => {
    setEditingSponsor(null);
    setFormData({
      name: "",
      type: "partenaire",
      level: "bronze",
      logo: "",
      logoHighRes: "",
      website: "",
      contact: "",
      email: "",
      phone: "",
      startDate: "",
      endDate: "",
      status: "en_attente",
      amount: "",
      description: "",
      visibility: [],
      benefits: [],
      contractFile: "",
      notes: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (sponsor: Sponsor) => {
    setEditingSponsor(sponsor);
    setFormData({
      name: sponsor.name,
      type: sponsor.type,
      level: sponsor.level,
      logo: sponsor.logo,
      logoHighRes: sponsor.logoHighRes || "",
      website: sponsor.website,
      contact: sponsor.contact,
      email: sponsor.email,
      phone: sponsor.phone,
      startDate: sponsor.startDate,
      endDate: sponsor.endDate,
      status: sponsor.status,
      amount: sponsor.amount?.toString() || "",
      description: sponsor.description || "",
      visibility: sponsor.visibility || [],
      benefits: sponsor.benefits || [],
      contractFile: sponsor.contractFile || "",
      notes: sponsor.notes || "",
    });
    setIsModalOpen(true);
  };

  const openViewModal = (sponsor: Sponsor) => {
    setViewingSponsor(sponsor);
    setIsViewModalOpen(true);
  };

  const openAdvancedModal = (sponsor: Sponsor) => {
    setViewingSponsor(sponsor);
    setAdvancedTab("payments");
    setIsAdvancedModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.contact || !formData.email) {
      toast("Veuillez remplir tous les champs obligatoires", "error");
      return;
    }

    if (editingSponsor) {
      dispatch({
        type: "UPDATE_SPONSOR",
        id: editingSponsor.id,
        updates: {
          name: formData.name,
          type: formData.type,
          level: formData.level,
          logo: formData.logo,
          logoHighRes: formData.logoHighRes || undefined,
          website: formData.website,
          contact: formData.contact,
          email: formData.email,
          phone: formData.phone,
          startDate: formData.startDate,
          endDate: formData.endDate,
          status: formData.status,
          amount: formData.amount ? parseFloat(formData.amount) : undefined,
          description: formData.description,
          visibility: formData.visibility,
          benefits: formData.benefits,
          contractFile: formData.contractFile || undefined,
          notes: formData.notes || undefined,
        },
      });
      toast("Sponsor mis à jour avec succès");
    } else {
      const newSponsor: Sponsor = {
        id: `sponsor-${Date.now()}`,
        name: formData.name,
        type: formData.type,
        level: formData.level,
        logo: formData.logo,
        logoHighRes: formData.logoHighRes || undefined,
        website: formData.website,
        contact: formData.contact,
        email: formData.email,
        phone: formData.phone,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
        amount: formData.amount ? parseFloat(formData.amount) : undefined,
        description: formData.description,
        visibility: formData.visibility,
        benefits: formData.benefits,
        contractFile: formData.contractFile || undefined,
        notes: formData.notes || undefined,
        payments: [],
        communications: [],
      };
      dispatch({ type: "ADD_SPONSOR", sponsor: newSponsor });
      toast("Sponsor ajouté avec succès");
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce sponsor ?")) {
      dispatch({ type: "DELETE_SPONSOR", id });
      toast("Sponsor supprimé", "info");
    }
  };

  const handleUpdatePayments = (sponsorId: string, payments: any[]) => {
    dispatch({
      type: "UPDATE_SPONSOR",
      id: sponsorId,
      updates: { payments },
    });
    setViewingSponsor({ ...viewingSponsor!, payments });
  };

  const handleUpdateCommunications = (sponsorId: string, communications: any[]) => {
    dispatch({
      type: "UPDATE_SPONSOR",
      id: sponsorId,
      updates: { communications },
    });
    setViewingSponsor({ ...viewingSponsor!, communications });
  };

  const getTypeLabel = (type: SponsorType) => {
    return SPONSOR_TYPES.find((t) => t.value === type)?.label || type;
  };

  const getLevelInfo = (level: SponsorLevel) => {
    return SPONSOR_LEVELS.find((l) => l.value === level);
  };

  const getStatusLabel = (status: SponsorStatus) => {
    return SPONSOR_STATUSES.find((s) => s.value === status)?.label || status;
  };

  const getVisibilityLabel = (visibility: SponsorVisibility) => {
    return VISIBILITY_OPTIONS.find((v) => v.value === visibility)?.label || visibility;
  };

  const formatAmount = (amount?: number) => {
    if (!amount) return "Non spécifié";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalAmount = state.sponsors
    .filter((s) => s.status === "actif" && s.amount)
    .reduce((sum, s) => sum + (s.amount || 0), 0);

  const expiringSponsors = state.sponsors.filter((s) => {
    if (s.status !== "actif" || !s.endDate) return false;
    const endDate = new Date(s.endDate);
    const now = new Date();
    const daysUntilExpiry = (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  });

  return (
    <div className="fade-up mx-auto max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-wide text-bone">
            Sponsors & Partenaires
          </h1>
          <p className="mt-2 text-dune">
            Gestion complète des sponsors et partenaires de la compétition
          </p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          <IconPlus className="w-5 h-5" />
          Ajouter un sponsor
        </button>
      </div>

      {/* Alertes */}
      {expiringSponsors.length > 0 && (
        <div className="mb-6 panel border-l-4 border-l-gold p-4">
          <div className="flex items-start gap-3">
            <IconCalendar className="w-6 h-6 text-gold flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-bone mb-1">
                Contrats expirant bientôt
              </h3>
              <p className="text-sm text-dune">
                {expiringSponsors.length} sponsor(s) avec un contrat expirant dans les 30 prochains jours :
              </p>
              <ul className="mt-2 space-y-1">
                {expiringSponsors.map((s) => (
                  <li key={s.id} className="text-sm text-dune">
                    • {s.name} - expire le {new Date(s.endDate).toLocaleDateString("fr-FR")}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Statistiques */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="panel p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-dune">
            Total sponsors
          </p>
          <p className="mt-2 font-display text-3xl text-bone">
            {state.sponsors.length}
          </p>
        </div>
        <div className="panel p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-dune">
            Sponsors actifs
          </p>
          <p className="mt-2 font-display text-3xl text-forest">
            {state.sponsors.filter((s) => s.status === "actif").length}
          </p>
        </div>
        <div className="panel p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-dune">
            Sponsors Or
          </p>
          <p className="mt-2 font-display text-3xl text-yellow-500">
            {state.sponsors.filter((s) => s.level === "or").length}
          </p>
        </div>
        <div className="panel p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-dune">
            Financement total
          </p>
          <p className="mt-2 font-display text-2xl text-gold">
            {formatAmount(totalAmount)}
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="panel mb-6 p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="label">Type de sponsor</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="input"
            >
              <option value="all">Tous les types</option>
              {SPONSOR_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Niveau</label>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value as any)}
              className="input"
            >
              <option value="all">Tous les niveaux</option>
              {SPONSOR_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Statut</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="input"
            >
              <option value="all">Tous les statuts</option>
              {SPONSOR_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Liste des sponsors */}
      {filteredSponsors.length === 0 ? (
        <div className="panel p-12 text-center">
          <p className="text-dune">
            {state.sponsors.length === 0
              ? "Aucun sponsor enregistré. Cliquez sur 'Ajouter un sponsor' pour commencer."
              : "Aucun sponsor ne correspond aux filtres sélectionnés."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSponsors.map((sponsor) => {
            const levelInfo = getLevelInfo(sponsor.level);
            return (
              <div
                key={sponsor.id}
                className={`panel overflow-hidden border-2 ${levelInfo?.color || "border-husk"}`}
              >
                {/* Logo */}
                <div className="flex h-40 items-center justify-center bg-bark p-6">
                  {sponsor.logo ? (
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <div
                    className={`flex h-full w-full items-center justify-center ${
                      sponsor.logo ? "hidden" : ""
                    }`}
                  >
                    <span className="font-display text-4xl text-gold">
                      {sponsor.name.charAt(0)}
                    </span>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-6">
                  <div className="mb-3 flex items-start justify-between">
                    <h3 className="font-display text-xl text-bone">{sponsor.name}</h3>
                    <span
                      className={`badge ${
                        sponsor.status === "actif"
                          ? "text-forest"
                          : sponsor.status === "en_attente"
                          ? "text-gold"
                          : "text-dune"
                      }`}
                    >
                      {getStatusLabel(sponsor.status)}
                    </span>
                  </div>

                  <div className="mb-4 space-y-2 text-sm">
                    <p className="text-dune">
                      <span className="font-semibold text-bone">Type:</span>{" "}
                      {getTypeLabel(sponsor.type)}
                    </p>
                    <p className="text-dune">
                      <span className="font-semibold text-bone">Niveau:</span>{" "}
                      <span className={levelInfo?.color}>{levelInfo?.label}</span>
                    </p>
                    {sponsor.amount && (
                      <p className="text-dune">
                        <span className="font-semibold text-bone">Montant:</span>{" "}
                        <span className="text-gold">{formatAmount(sponsor.amount)}</span>
                      </p>
                    )}
                    <p className="text-dune">
                      <span className="font-semibold text-bone">Contact:</span>{" "}
                      {sponsor.contact}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openViewModal(sponsor)}
                      className="btn btn-ghost flex-1"
                      title="Voir les détails"
                    >
                      <IconEye className="w-4 h-4" />
                      Voir
                    </button>
                    <button
                      onClick={() => openAdvancedModal(sponsor)}
                      className="btn btn-ghost flex-1"
                      title="Gérer paiements et communications"
                    >
                      <IconFile className="w-4 h-4" />
                      Gérer
                    </button>
                    <button
                      onClick={() => openEditModal(sponsor)}
                      className="btn btn-ghost"
                      title="Modifier"
                    >
                      <IconEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(sponsor.id)}
                      className="btn btn-danger"
                      title="Supprimer"
                    >
                      <IconTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de création/édition */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSponsor ? "Modifier le sponsor" : "Ajouter un sponsor"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="label">Nom du sponsor *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                placeholder="Ex: Orange Côte d'Ivoire"
                required
              />
            </div>
            <div>
              <label className="label">Type de sponsor</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as SponsorType })}
                className="input"
              >
                {SPONSOR_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="label">Niveau</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value as SponsorLevel })}
                className="input"
              >
                {SPONSOR_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Statut</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as SponsorStatus })}
                className="input"
              >
                {SPONSOR_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="label">URL du logo</label>
              <input
                type="url"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                className="input"
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div>
              <label className="label">URL logo haute résolution</label>
              <input
                type="url"
                value={formData.logoHighRes}
                onChange={(e) => setFormData({ ...formData, logoHighRes: e.target.value })}
                className="input"
                placeholder="https://example.com/logo-hd.png"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="label">Site web</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="input"
                placeholder="https://www.example.com"
              />
            </div>
            <div>
              <label className="label">Montant (FCFA)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="input"
                placeholder="5000000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="label">Personne de contact *</label>
              <input
                type="text"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                className="input"
                placeholder="M. Jean Dupont"
                required
              />
            </div>
            <div>
              <label className="label">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input"
                placeholder="contact@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Téléphone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input"
              placeholder="+225 07 00 00 00 00"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="label">Date de début</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label">Date de fin</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="label">Visibilité du sponsor</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {VISIBILITY_OPTIONS.map((option) => (
                <label key={option.value} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.visibility.includes(option.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          visibility: [...formData.visibility, option.value],
                        });
                      } else {
                        setFormData({
                          ...formData,
                          visibility: formData.visibility.filter((v) => v !== option.value),
                        });
                      }
                    }}
                    className="checkbox"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input"
              rows={3}
              placeholder="Description du partenariat..."
            />
          </div>

          <div>
            <label className="label">Notes internes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input"
              rows={2}
              placeholder="Notes privées..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn btn-ghost"
            >
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              {editingSponsor ? "Mettre à jour" : "Ajouter"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de visualisation */}
      <Modal
        open={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Détails du sponsor"
      >
        {viewingSponsor && (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Logo */}
            <div className="flex h-48 items-center justify-center bg-bark p-6">
              {viewingSponsor.logo ? (
                <img
                  src={viewingSponsor.logo}
                  alt={viewingSponsor.name}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <span className="font-display text-6xl text-gold">
                  {viewingSponsor.name.charAt(0)}
                </span>
              )}
            </div>

            {/* Informations */}
            <div className="space-y-4">
              <div>
                <h3 className="font-display text-2xl text-bone">{viewingSponsor.name}</h3>
                <div className="mt-2 flex gap-2">
                  <StatusBadge status={viewingSponsor.status} />
                  <span className={`badge ${getLevelInfo(viewingSponsor.level)?.color}`}>
                    {getLevelInfo(viewingSponsor.level)?.label}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-dune">Type</p>
                  <p className="mt-1 text-bone">{getTypeLabel(viewingSponsor.type)}</p>
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-dune">Montant</p>
                  <p className="mt-1 text-gold">{formatAmount(viewingSponsor.amount)}</p>
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-dune">Contact</p>
                  <p className="mt-1 text-bone">{viewingSponsor.contact}</p>
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-dune">Email</p>
                  <p className="mt-1 text-bone">{viewingSponsor.email}</p>
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-dune">Téléphone</p>
                  <p className="mt-1 text-bone">{viewingSponsor.phone || "Non spécifié"}</p>
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-dune">Site web</p>
                  {viewingSponsor.website ? (
                    <a
                      href={viewingSponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-gold hover:underline"
                    >
                      {viewingSponsor.website}
                    </a>
                  ) : (
                    <p className="mt-1 text-dune">Non spécifié</p>
                  )}
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-dune">Période</p>
                  <p className="mt-1 text-bone">
                    {viewingSponsor.startDate && viewingSponsor.endDate
                      ? `${new Date(viewingSponsor.startDate).toLocaleDateString("fr-FR")} - ${new Date(viewingSponsor.endDate).toLocaleDateString("fr-FR")}`
                      : "Non spécifiée"}
                  </p>
                </div>
              </div>

              {viewingSponsor.visibility && viewingSponsor.visibility.length > 0 && (
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-dune">Visibilité</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {viewingSponsor.visibility.map((v) => (
                      <span key={v} className="badge text-gold">
                        {getVisibilityLabel(v)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {viewingSponsor.description && (
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-dune">
                    Description
                  </p>
                  <p className="mt-1 text-bone">{viewingSponsor.description}</p>
                </div>
              )}

              {viewingSponsor.notes && (
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-dune">
                    Notes internes
                  </p>
                  <p className="mt-1 text-bone italic">{viewingSponsor.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="btn btn-ghost"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  openEditModal(viewingSponsor);
                }}
                className="btn btn-primary"
              >
                Modifier
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal avancé (paiements et communications) */}
      <Modal
        open={isAdvancedModalOpen}
        onClose={() => setIsAdvancedModalOpen(false)}
        title={`Gestion avancée - ${viewingSponsor?.name || ""}`}
      >
        {viewingSponsor && (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Onglets */}
            <div className="flex gap-2 border-b border-husk">
              <button
                onClick={() => setAdvancedTab("payments")}
                className={`px-4 py-2 font-mono text-sm uppercase tracking-wider ${
                  advancedTab === "payments"
                    ? "text-gold border-b-2 border-gold"
                    : "text-dune hover:text-bone"
                }`}
              >
                Paiements
              </button>
              <button
                onClick={() => setAdvancedTab("communications")}
                className={`px-4 py-2 font-mono text-sm uppercase tracking-wider ${
                  advancedTab === "communications"
                    ? "text-gold border-b-2 border-gold"
                    : "text-dune hover:text-bone"
                }`}
              >
                Communications
              </button>
            </div>

            {/* Contenu des onglets */}
            {advancedTab === "payments" && (
              <PaymentsManager
                payments={viewingSponsor.payments || []}
                onUpdate={(payments) => handleUpdatePayments(viewingSponsor.id, payments)}
              />
            )}

            {advancedTab === "communications" && (
              <CommunicationsManager
                communications={viewingSponsor.communications || []}
                onUpdate={(communications) =>
                  handleUpdateCommunications(viewingSponsor.id, communications)
                }
              />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

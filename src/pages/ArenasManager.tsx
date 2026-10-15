import { useState } from "react";
import { useApp } from "../lib/store";
import { PageHead, Modal, useToast } from "../components/ui";
import { IconPlus, IconEdit, IconTrash } from "../components/Icons";
import PageBackground from "../components/PageBackground";
import { PAGE_BACKGROUNDS } from "../config/backgrounds";

interface Arena {
  id: string;
  name: string;
  number: number;
  status: "active" | "inactive" | "maintenance";
  currentMatch?: string;
}

export default function ArenasManager() {
  const { state, dispatch } = useApp();
  const toast = useToast();
  const [arenas, setArenas] = useState<Arena[]>(() => {
    // Initialiser avec les aires définies dans l'événement
    return Array.from({ length: state.event.arenas }, (_, i) => ({
      id: `arena-${i + 1}`,
      name: `Aire ${i + 1}`,
      number: i + 1,
      status: "active" as const,
    }));
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArena, setEditingArena] = useState<Arena | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    number: 1,
    status: "active" as Arena["status"],
  });

  const openCreateModal = () => {
    setEditingArena(null);
    setFormData({
      name: `Aire ${arenas.length + 1}`,
      number: arenas.length + 1,
      status: "active",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (arena: Arena) => {
    setEditingArena(arena);
    setFormData({
      name: arena.name,
      number: arena.number,
      status: arena.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingArena) {
      setArenas(arenas.map((a) => (a.id === editingArena.id ? { ...a, ...formData } : a)));
      toast("Aire modifiée avec succès");
    } else {
      const newArena: Arena = {
        id: `arena-${Date.now()}`,
        ...formData,
      };
      setArenas([...arenas, newArena]);
      toast("Aire ajoutée avec succès");
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette aire ?")) {
      setArenas(arenas.filter((a) => a.id !== id));
      toast("Aire supprimée", "info");
    }
  };

  const getStatusColor = (status: Arena["status"]) => {
    switch (status) {
      case "active":
        return "text-forest border-forest";
      case "inactive":
        return "text-dune border-dune";
      case "maintenance":
        return "text-flame border-flame";
    }
  };

  const getStatusLabel = (status: Arena["status"]) => {
    switch (status) {
      case "active":
        return "Active";
      case "inactive":
        return "Inactive";
      case "maintenance":
        return "Maintenance";
    }
  };

  // Compter les combats par aire
  const getMatchesByArena = (arenaId: string) => {
    return Object.values(state.brackets)
      .flat()
      .filter((m) => m.arenaId === arenaId).length;
  };

  return (
    <div className="fade-up mx-auto max-w-6xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.live} opacity={0.08} blur={3} />
      <PageHead
        title="Gestion des Aires de Combat"
        subtitle="Configuration et suivi des tatamis"
        actions={
          <button onClick={openCreateModal} className="btn btn-primary btn-sm">
            <IconPlus className="w-4 h-4" />
            Ajouter une aire
          </button>
        }
      />

      {/* Statistiques */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="panel p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-dune">
            Total des aires
          </p>
          <p className="font-display text-3xl text-bone mt-2">{arenas.length}</p>
        </div>
        <div className="panel p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-dune">
            Aires actives
          </p>
          <p className="font-display text-3xl text-forest mt-2">
            {arenas.filter((a) => a.status === "active").length}
          </p>
        </div>
        <div className="panel p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-dune">
            Combats programmés
          </p>
          <p className="font-display text-3xl text-gold mt-2">
            {Object.values(state.brackets).flat().length}
          </p>
        </div>
      </div>

      {/* Liste des aires */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {arenas.map((arena) => (
          <div key={arena.id} className="panel p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-display text-xl uppercase tracking-wide text-bone">
                  {arena.name}
                </h3>
                <p className="text-sm text-dune mt-1">Aire #{arena.number}</p>
              </div>
              <span className={`badge ${getStatusColor(arena.status)}`}>
                {getStatusLabel(arena.status)}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-dune">Combats programmés</span>
                <span className="font-semibold text-bone">
                  {getMatchesByArena(arena.id)}
                </span>
              </div>
              {arena.currentMatch && (
                <div className="flex justify-between text-sm">
                  <span className="text-dune">Combat en cours</span>
                  <span className="font-semibold text-flame">
                    #{arena.currentMatch}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => openEditModal(arena)}
                className="btn btn-ghost btn-sm flex-1"
              >
                <IconEdit className="w-4 h-4" />
                Modifier
              </button>
              <button
                onClick={() => handleDelete(arena.id)}
                className="btn btn-danger btn-sm"
              >
                <IconTrash className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingArena ? "Modifier l'aire" : "Ajouter une aire"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Nom de l'aire</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              placeholder="Ex: Aire 1, Tatami Principal"
              required
            />
          </div>

          <div>
            <label className="label">Numéro</label>
            <input
              type="number"
              value={formData.number}
              onChange={(e) =>
                setFormData({ ...formData, number: parseInt(e.target.value) })
              }
              className="input"
              min="1"
              required
            />
          </div>

          <div>
            <label className="label">Statut</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as Arena["status"] })
              }
              className="input"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="maintenance">Maintenance</option>
            </select>
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
              {editingArena ? "Mettre à jour" : "Ajouter"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

import { useState } from "react";
import { Modal, useToast } from "../components/ui";
import { IconPlus, IconEdit, IconTrash } from "../components/Icons";
import type { SponsorCommunication } from "../lib/types";

interface CommunicationsManagerProps {
  communications: SponsorCommunication[];
  onUpdate: (communications: SponsorCommunication[]) => void;
}

export function CommunicationsManager({
  communications,
  onUpdate,
}: CommunicationsManagerProps) {
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCommunication, setEditingCommunication] =
    useState<SponsorCommunication | null>(null);
  const [formData, setFormData] = useState({
    date: "",
    type: "email" as SponsorCommunication["type"],
    subject: "",
    content: "",
    participants: "",
  });

  const openCreateModal = () => {
    setEditingCommunication(null);
    setFormData({
      date: new Date().toISOString().split("T")[0],
      type: "email",
      subject: "",
      content: "",
      participants: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (communication: SponsorCommunication) => {
    setEditingCommunication(communication);
    setFormData({
      date: communication.date,
      type: communication.type,
      subject: communication.subject,
      content: communication.content,
      participants: communication.participants?.join(", ") || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.date || !formData.subject || !formData.content) {
      toast("Veuillez remplir tous les champs obligatoires", "error");
      return;
    }

    const communicationData: SponsorCommunication = {
      id: editingCommunication?.id || `comm-${Date.now()}`,
      date: formData.date,
      type: formData.type,
      subject: formData.subject,
      content: formData.content,
      participants: formData.participants
        ? formData.participants.split(",").map((p) => p.trim())
        : undefined,
    };

    if (editingCommunication) {
      const updated = communications.map((c) =>
        c.id === editingCommunication.id ? communicationData : c
      );
      onUpdate(updated);
      toast("Communication mise à jour avec succès");
    } else {
      onUpdate([...communications, communicationData]);
      toast("Communication ajoutée avec succès");
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette communication ?")) {
      onUpdate(communications.filter((c) => c.id !== id));
      toast("Communication supprimée", "info");
    }
  };

  const getTypeIcon = (type: SponsorCommunication["type"]) => {
    switch (type) {
      case "email":
        return "📧";
      case "telephone":
        return "📞";
      case "reunion":
        return "🤝";
      case "autre":
        return "📝";
    }
  };

  const getTypeLabel = (type: SponsorCommunication["type"]) => {
    switch (type) {
      case "email":
        return "Email";
      case "telephone":
        return "Téléphone";
      case "reunion":
        return "Réunion";
      case "autre":
        return "Autre";
    }
  };

  return (
    <div className="space-y-4">
      {/* Bouton ajouter */}
      <button onClick={openCreateModal} className="btn btn-ghost w-full">
        <IconPlus className="w-4 h-4" />
        Ajouter une communication
      </button>

      {/* Liste des communications */}
      {communications.length === 0 ? (
        <div className="panel p-6 text-center">
          <p className="text-dune">Aucune communication enregistrée</p>
        </div>
      ) : (
        <div className="space-y-2">
          {communications
            .sort(
              (a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .map((communication) => (
              <div
                key={communication.id}
                className="panel p-4 flex items-start justify-between gap-3"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">
                      {getTypeIcon(communication.type)}
                    </span>
                    <div>
                      <p className="font-semibold text-bone">
                        {communication.subject}
                      </p>
                      <p className="text-xs text-dune">
                        {new Date(communication.date).toLocaleDateString(
                          "fr-FR"
                        )}{" "}
                        · {getTypeLabel(communication.type)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-dune mt-2">
                    {communication.content}
                  </p>
                  {communication.participants &&
                    communication.participants.length > 0 && (
                      <p className="text-xs text-dune mt-2">
                        Participants : {communication.participants.join(", ")}
                      </p>
                    )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(communication)}
                    className="btn btn-ghost"
                    title="Modifier"
                  >
                    <IconEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(communication.id)}
                    className="btn btn-danger"
                    title="Supprimer"
                  >
                    <IconTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingCommunication
            ? "Modifier la communication"
            : "Ajouter une communication"
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Date *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">Type</label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as SponsorCommunication["type"],
                })
              }
              className="input"
            >
              <option value="email">Email</option>
              <option value="telephone">Téléphone</option>
              <option value="reunion">Réunion</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <div>
            <label className="label">Sujet *</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              className="input"
              placeholder="Objet de la communication"
              required
            />
          </div>

          <div>
            <label className="label">Contenu *</label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="input"
              rows={5}
              placeholder="Détails de la communication..."
              required
            />
          </div>

          <div>
            <label className="label">Participants</label>
            <input
              type="text"
              value={formData.participants}
              onChange={(e) =>
                setFormData({ ...formData, participants: e.target.value })
              }
              className="input"
              placeholder="Noms séparés par des virgules"
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
              {editingCommunication ? "Mettre à jour" : "Ajouter"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

import { useState } from "react";
import { Modal, useToast } from "../components/ui";
import { IconPlus, IconEdit, IconTrash } from "../components/Icons";
import type { SponsorPayment } from "../lib/types";

interface PaymentsManagerProps {
  payments: SponsorPayment[];
  onUpdate: (payments: SponsorPayment[]) => void;
}

export function PaymentsManager({ payments, onUpdate }: PaymentsManagerProps) {
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<SponsorPayment | null>(null);
  const [formData, setFormData] = useState({
    amount: "",
    date: "",
    status: "en_attente" as SponsorPayment["status"],
    method: "",
    reference: "",
    notes: "",
  });

  const openCreateModal = () => {
    setEditingPayment(null);
    setFormData({
      amount: "",
      date: new Date().toISOString().split("T")[0],
      status: "en_attente",
      method: "",
      reference: "",
      notes: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (payment: SponsorPayment) => {
    setEditingPayment(payment);
    setFormData({
      amount: payment.amount.toString(),
      date: payment.date,
      status: payment.status,
      method: payment.method || "",
      reference: payment.reference || "",
      notes: payment.notes || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || !formData.date) {
      toast("Veuillez remplir tous les champs obligatoires", "error");
      return;
    }

    const paymentData: SponsorPayment = {
      id: editingPayment?.id || `payment-${Date.now()}`,
      amount: parseFloat(formData.amount),
      date: formData.date,
      status: formData.status,
      method: formData.method || undefined,
      reference: formData.reference || undefined,
      notes: formData.notes || undefined,
    };

    if (editingPayment) {
      const updated = payments.map((p) =>
        p.id === editingPayment.id ? paymentData : p
      );
      onUpdate(updated);
      toast("Paiement mis à jour avec succès");
    } else {
      onUpdate([...payments, paymentData]);
      toast("Paiement ajouté avec succès");
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce paiement ?")) {
      onUpdate(payments.filter((p) => p.id !== id));
      toast("Paiement supprimé", "info");
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: SponsorPayment["status"]) => {
    switch (status) {
      case "paye":
        return "text-forest border-forest";
      case "en_attente":
        return "text-gold border-gold";
      case "en_retard":
        return "text-flame border-flame";
    }
  };

  const getStatusLabel = (status: SponsorPayment["status"]) => {
    switch (status) {
      case "paye":
        return "Payé";
      case "en_attente":
        return "En attente";
      case "en_retard":
        return "En retard";
    }
  };

  const totalPaid = payments
    .filter((p) => p.status === "paye")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter((p) => p.status === "en_attente")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalOverdue = payments
    .filter((p) => p.status === "en_retard")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-4">
      {/* Statistiques */}
      <div className="grid grid-cols-3 gap-3">
        <div className="panel p-3">
          <p className="font-mono text-xs uppercase tracking-wider text-dune">
            Payé
          </p>
          <p className="mt-1 font-display text-xl text-forest">
            {formatAmount(totalPaid)}
          </p>
        </div>
        <div className="panel p-3">
          <p className="font-mono text-xs uppercase tracking-wider text-dune">
            En attente
          </p>
          <p className="mt-1 font-display text-xl text-gold">
            {formatAmount(totalPending)}
          </p>
        </div>
        <div className="panel p-3">
          <p className="font-mono text-xs uppercase tracking-wider text-dune">
            En retard
          </p>
          <p className="mt-1 font-display text-xl text-flame">
            {formatAmount(totalOverdue)}
          </p>
        </div>
      </div>

      {/* Bouton ajouter */}
      <button onClick={openCreateModal} className="btn btn-ghost w-full">
        <IconPlus className="w-4 h-4" />
        Ajouter un paiement
      </button>

      {/* Liste des paiements */}
      {payments.length === 0 ? (
        <div className="panel p-6 text-center">
          <p className="text-dune">Aucun paiement enregistré</p>
        </div>
      ) : (
        <div className="space-y-2">
          {payments
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((payment) => (
              <div
                key={payment.id}
                className="panel p-4 flex items-start justify-between gap-3"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-display text-lg text-bone">
                      {formatAmount(payment.amount)}
                    </p>
                    <span
                      className={`badge ${getStatusColor(payment.status)}`}
                    >
                      {getStatusLabel(payment.status)}
                    </span>
                  </div>
                  <p className="text-sm text-dune">
                    {new Date(payment.date).toLocaleDateString("fr-FR")}
                  </p>
                  {payment.method && (
                    <p className="text-sm text-dune">
                      Méthode : {payment.method}
                    </p>
                  )}
                  {payment.reference && (
                    <p className="text-sm text-dune">
                      Référence : {payment.reference}
                    </p>
                  )}
                  {payment.notes && (
                    <p className="text-sm text-dune mt-1 italic">
                      {payment.notes}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(payment)}
                    className="btn btn-ghost"
                    title="Modifier"
                  >
                    <IconEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(payment.id)}
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
        title={editingPayment ? "Modifier le paiement" : "Ajouter un paiement"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Montant (FCFA) *</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="input"
              placeholder="5000000"
              required
            />
          </div>

          <div>
            <label className="label">Date *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">Statut</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as SponsorPayment["status"] })
              }
              className="input"
            >
              <option value="paye">Payé</option>
              <option value="en_attente">En attente</option>
              <option value="en_retard">En retard</option>
            </select>
          </div>

          <div>
            <label className="label">Méthode de paiement</label>
            <input
              type="text"
              value={formData.method}
              onChange={(e) => setFormData({ ...formData, method: e.target.value })}
              className="input"
              placeholder="Virement bancaire, Chèque, Espèces..."
            />
          </div>

          <div>
            <label className="label">Référence</label>
            <input
              type="text"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              className="input"
              placeholder="Numéro de transaction, numéro de chèque..."
            />
          </div>

          <div>
            <label className="label">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input"
              rows={3}
              placeholder="Notes supplémentaires..."
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
              {editingPayment ? "Mettre à jour" : "Ajouter"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

import { useState } from "react";
import { X, Plus, AlertCircle, CheckCircle2 } from "lucide-react";
import type {
  BudgetPlan,
  BudgetPlanCategory,
  ReservationFormData,
} from "../../types/entities";
import {
  createReservation,
  calculateAvailableAmount,
} from "../../services/reservationService";
import { parseAmount } from "../../utils/parseAmount";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: BudgetPlan;
  category?: BudgetPlanCategory;
  onReservationCreated?: () => void;
  currentUser: string; // In a real app, this would come from auth context
}

const defaultFormData: ReservationFormData = {
  categoryId: "",
  amount: "",
  purpose: "",
  notes: "",
};

export default function ReservationModal({
  isOpen,
  onClose,
  plan,
  category,
  onReservationCreated,
  currentUser,
}: ReservationModalProps) {
  const [formData, setFormData] = useState<ReservationFormData>(
    category
      ? { ...defaultFormData, categoryId: category.id }
      : defaultFormData
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  if (!isOpen) return null;

  const selectedCategory = plan.categories.find((c) => c.id === formData.categoryId);
  const availableAmount = selectedCategory
    ? calculateAvailableAmount(plan.id, selectedCategory.id)
    : 0;
  const requestedAmount = parseAmount(formData.amount);
  const remainingAfterReservation = availableAmount - (isNaN(requestedAmount) ? 0 : requestedAmount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const result = createReservation(plan.id, formData, currentUser);

      if (result.success) {
        setFeedback({
          type: "success",
          message: "Réservation créée avec succès !",
        });
        
        // Reset form and close modal after a short delay
        setTimeout(() => {
          setFormData(defaultFormData);
          onReservationCreated?.();
          onClose();
          setFeedback(null);
        }, 1500);
      } else {
        setFeedback({
          type: "error",
          message: result.error || "Erreur lors de la création de la réservation",
        });
      }
    } catch (error) {
      setFeedback({
        type: "error",
        message: "Une erreur inattendue s'est produite",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData(defaultFormData);
    setFeedback(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-mist p-6">
          <div>
            <h2 className="text-xl font-semibold text-charcoal">
              Nouvelle Réservation
            </h2>
            <p className="mt-1 text-sm text-charcoal/60">
              Plan: {plan.name}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-full p-2 text-charcoal/60 transition hover:bg-mist hover:text-charcoal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Category Selection */}
            <div>
              <label className="text-sm font-semibold text-charcoal">
                Catégorie
                <select
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value })
                  }
                  className="mt-2 w-full rounded-2xl border border-mist px-3 py-2 text-sm"
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  {plan.categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label} - {cat.owner}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Amount */}
            <div>
              <label className="text-sm font-semibold text-charcoal">
                Montant à réserver
                <input
                  type="number"
                  min={0}
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  className="mt-2 w-full rounded-2xl border border-mist px-3 py-2 text-sm"
                  placeholder="0"
                  required
                />
              </label>
              {selectedCategory && (
                <div className="mt-2 space-y-1 text-xs text-charcoal/60">
                  <p>
                    Alloué: {selectedCategory.allocated.toLocaleString("fr-FR")}{" "}
                    {plan.currency}
                  </p>
                  <p>
                    Disponible: {availableAmount.toLocaleString("fr-FR")}{" "}
                    {plan.currency}
                  </p>
                  {requestedAmount > 0 && (
                    <p
                      className={
                        remainingAfterReservation >= 0
                          ? "text-teal"
                          : "text-rose-500"
                      }
                    >
                      Après réservation:{" "}
                      {remainingAfterReservation.toLocaleString("fr-FR")}{" "}
                      {plan.currency}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Purpose */}
            <div>
              <label className="text-sm font-semibold text-charcoal">
                Objet de la réservation
                <textarea
                  value={formData.purpose}
                  onChange={(e) =>
                    setFormData({ ...formData, purpose: e.target.value })
                  }
                  className="mt-2 w-full rounded-2xl border border-mist px-3 py-2 text-sm"
                  rows={3}
                  placeholder="Décrivez l'objectif de cette réservation..."
                  required
                />
              </label>
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm font-semibold text-charcoal">
                Notes additionnelles (optionnel)
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="mt-2 w-full rounded-2xl border border-mist px-3 py-2 text-sm"
                  rows={2}
                  placeholder="Informations complémentaires..."
                />
              </label>
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <div
              className={`mt-4 rounded-2xl border px-4 py-2 text-sm ${
                feedback.type === "error"
                  ? "border-rose-200 bg-rose-50 text-rose-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
            >
              <div className="flex items-center gap-2">
                {feedback.type === "error" ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                <span>{feedback.message}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full border border-mist px-6 py-2 text-sm text-charcoal/70 transition hover:bg-mist"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.categoryId || !formData.purpose || !formData.amount}
              className="inline-flex items-center gap-2 rounded-full bg-teal px-6 py-2 text-sm font-semibold text-white transition hover:bg-ocean disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
              {isSubmitting ? "Création..." : "Créer la réservation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

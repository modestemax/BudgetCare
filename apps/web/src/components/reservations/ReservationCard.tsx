import { useState } from "react";
import {
  Calendar,
  User,
  DollarSign,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  ArrowRight,
} from "lucide-react";
import type { Reservation, BudgetPlan } from "../../types/entities";
import {
  convertReservationToExpense,
  cancelReservation,
} from "../../services/reservationService";

interface ReservationCardProps {
  reservation: Reservation;
  plan: BudgetPlan;
  onStatusChange: () => void;
  onConvert?: (reservation: Reservation) => void;
  onCancel?: (reservation: Reservation) => void;
  showActions?: boolean;
}

const statusConfig = {
  active: {
    label: "Active",
    icon: DollarSign,
    classes: "bg-teal-100 text-teal-800 border-teal-200",
    iconColor: "text-teal-600",
  },
  utilized: {
    label: "Utilisée",
    icon: CheckCircle2,
    classes: "bg-emerald-100 text-emerald-800 border-emerald-200",
    iconColor: "text-emerald-600",
  },
  cancelled: {
    label: "Annulée",
    icon: XCircle,
    classes: "bg-rose-100 text-rose-800 border-rose-200",
    iconColor: "text-rose-600",
  },
};

export default function ReservationCard({
  reservation,
  plan,
  onStatusChange,
  onConvert,
  onCancel,
  showActions = true,
}: ReservationCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const status = statusConfig[reservation.status];
  const StatusIcon = status.icon;

  const handleConvertToExpense = async () => {
    if (!onConvert) return;
    
    setIsProcessing(true);
    try {
      const result = convertReservationToExpense(reservation.id, {
        transactionType: "expense",
        vendor: "Vendeur à définir",
        date: new Date().toISOString().split("T")[0],
      });

      if (result.success) {
        onStatusChange();
      }
    } catch (error) {
      console.error("Error converting reservation:", error);
    } finally {
      setIsProcessing(false);
      setShowDropdown(false);
    }
  };

  const handleCancelReservation = async () => {
    if (!onCancel) return;
    
    setIsProcessing(true);
    try {
      const reason = prompt("Raison de l'annulation :");
      if (reason) {
        const result = cancelReservation(reservation.id, { reason });
        if (result.success) {
          onStatusChange();
        }
      }
    } catch (error) {
      console.error("Error cancelling reservation:", error);
    } finally {
      setIsProcessing(false);
      setShowDropdown(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="rounded-3xl border border-mist bg-white p-6 shadow-card">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className={`rounded-full border p-2 ${status.classes}`}>
              <StatusIcon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-charcoal">
                {reservation.purpose}
              </h3>
              <p className="text-sm text-charcoal/60">
                {reservation.amount.toLocaleString("fr-FR")} {plan.currency}
              </p>
            </div>
          </div>
        </div>

        {/* Actions Dropdown */}
        {showActions && reservation.status === "active" && (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="rounded-full border border-mist p-2 text-charcoal/60 transition hover:border-teal hover:text-teal"
              disabled={isProcessing}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-mist bg-white p-2 shadow-lg z-10">
                <button
                  onClick={handleConvertToExpense}
                  disabled={isProcessing}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-charcoal transition hover:bg-mist/50"
                >
                  <ArrowRight className="h-4 w-4 text-teal" />
                  Convertir en dépense
                </button>
                <button
                  onClick={handleCancelReservation}
                  disabled={isProcessing}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-rose-600 transition hover:bg-rose-50"
                >
                  <XCircle className="h-4 w-4" />
                  Annuler la réservation
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="mt-4 space-y-3">
        {/* Category */}
        <div className="flex items-center gap-2 text-sm text-charcoal/70">
          <FileText className="h-4 w-4" />
          <span>
            Catégorie:{" "}
            <span className="font-medium text-charcoal">
              {plan.categories.find((c) => c.id === reservation.categoryId)?.label ||
                "Catégorie inconnue"}
            </span>
          </span>
        </div>

        {/* Reserved by */}
        <div className="flex items-center gap-2 text-sm text-charcoal/70">
          <User className="h-4 w-4" />
          <span>
            Par:{" "}
            <span className="font-medium text-charcoal">
              {reservation.reservedBy}
            </span>
          </span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-charcoal/70">
          <Calendar className="h-4 w-4" />
          <span>
            Réservé le:{" "}
            <span className="font-medium text-charcoal">
              {formatDate(reservation.reservedDate)}
            </span>
          </span>
        </div>

        {/* Utilized date */}
        {reservation.status === "utilized" && reservation.utilizedDate && (
          <div className="flex items-center gap-2 text-sm text-charcoal/70">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>
              Utilisé le:{" "}
              <span className="font-medium text-charcoal">
                {formatDate(reservation.utilizedDate)}
              </span>
            </span>
          </div>
        )}

        {/* Cancellation reason */}
        {reservation.status === "cancelled" && reservation.cancellationReason && (
          <div className="flex items-start gap-2 text-sm text-rose-600">
            <AlertCircle className="h-4 w-4 mt-0.5" />
            <div>
              <span className="font-medium">Raison d'annulation:</span>
              <p className="mt-1">{reservation.cancellationReason}</p>
            </div>
          </div>
        )}
      </div>

      {/* Notes */}
      {reservation.notes && (
        <div className="mt-4 rounded-2xl bg-mist/30 p-3">
          <h4 className="text-xs font-semibold text-charcoal/70 uppercase tracking-wide">
            Notes
          </h4>
          <p className="mt-1 text-sm text-charcoal/80">{reservation.notes}</p>
        </div>
      )}

      {/* Status-specific footer */}
      {reservation.status === "active" && (
        <div className="mt-4 rounded-2xl border border-teal/20 bg-teal/5 p-3">
          <div className="flex items-center gap-2 text-sm text-teal-700">
            <DollarSign className="h-4 w-4" />
            <span className="font-medium">
              {reservation.amount.toLocaleString("fr-FR")} {plan.currency} réservée
            </span>
          </div>
          <p className="mt-1 text-xs text-teal-600">
            Ce montant est retenu du budget disponible pour cette catégorie.
          </p>
        </div>
      )}
    </div>
  );
}
import type {
  Reservation,
  ReservationFormData,
  ReservationConversionData,
  ReservationCancellationData,
  ReservationSummary,
} from "../types/entities";
import { budgetPlans } from "../data/budgetPlans";

// Mock data for reservations
let reservations: Reservation[] = [
  {
    id: "res-001",
    planId: "plan-2025",
    categoryId: "cat-education",
    amount: 2000000,
    purpose: "Déploiement clinique mobile Nord",
    reservedBy: "Clarisse Ebode",
    reservedDate: "2025-12-05T10:30:00Z",
    status: "active",
    notes: "Achat véhicules + équipement médical",
  },
  {
    id: "res-002",
    planId: "plan-2025",
    categoryId: "cat-health",
    amount: 5000000,
    purpose: "Bourses scolaires S2",
    reservedBy: "Agnès Mbarga",
    reservedDate: "2025-12-02T14:15:00Z",
    status: "utilized",
    utilizedDate: "2025-12-04T09:20:00Z",
    notes: "120 bourses d'études",
  },
  {
    id: "res-003",
    planId: "plan-2026-draft",
    categoryId: "draft-rapid-response",
    amount: 1500000,
    purpose: "Équipement d'urgence saison sèche",
    reservedBy: "Eric Nganou",
    reservedDate: "2025-12-04T16:45:00Z",
    status: "cancelled",
    cancellationReason: "Projet reporté à 2026",
    notes: "Délai procurement dépassé",
  },
];

/**
 * Get all reservations for a specific plan
 */
export function getReservationsByPlan(planId: string): Reservation[] {
  return reservations.filter((reservation) => reservation.planId === planId);
}

/**
 * Get all reservations for a specific category
 */
export function getReservationsByCategory(
  planId: string,
  categoryId: string
): Reservation[] {
  return reservations.filter(
    (reservation) =>
      reservation.planId === planId && reservation.categoryId === categoryId
  );
}

/**
 * Get reservation summary for a category
 */
export function getReservationSummary(
  planId: string,
  categoryId: string
): ReservationSummary {
  const categoryReservations = getReservationsByCategory(planId, categoryId);
  
  const totalReserved = categoryReservations.reduce(
    (sum, res) => sum + res.amount,
    0
  );
  
  const activeReservations = categoryReservations
    .filter((res) => res.status === "active")
    .reduce((sum, res) => sum + res.amount, 0);
    
  const utilizedReservations = categoryReservations
    .filter((res) => res.status === "utilized")
    .reduce((sum, res) => sum + res.amount, 0);
    
  const cancelledReservations = categoryReservations
    .filter((res) => res.status === "cancelled")
    .reduce((sum, res) => sum + res.amount, 0);

  return {
    totalReserved,
    activeReservations,
    utilizedReservations,
    cancelledReservations,
  };
}

/**
 * Create a new reservation
 */
export function createReservation(
  planId: string,
  formData: ReservationFormData,
  reservedBy: string
): { success: boolean; error?: string; reservation?: Reservation } {
  // Validate form data
  const amount = parseAmount(formData.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { success: false, error: "Le montant doit être supérieur à 0." };
  }

  // Find the plan and category
  const plan = budgetPlans.find((p) => p.id === planId);
  if (!plan) {
    return { success: false, error: "Plan budgétaire non trouvé." };
  }

  const category = plan.categories.find((c) => c.id === formData.categoryId);
  if (!category) {
    return { success: false, error: "Catégorie non trouvée." };
  }

  // Check available amount
  const availableAmount = category.allocated - category.utilized - category.reserved;
  if (amount > availableAmount) {
    return {
      success: false,
      error: `Montant insuffisant. Disponible: ${availableAmount.toLocaleString(
        "fr-FR"
      )} ${plan.currency}`,
    };
  }

  // Create reservation
  const newReservation: Reservation = {
    id: `res-${Date.now()}`,
    planId,
    categoryId: formData.categoryId,
    amount,
    purpose: formData.purpose.trim(),
    reservedBy,
    reservedDate: new Date().toISOString(),
    status: "active",
    notes: formData.notes?.trim() || undefined,
  };

  reservations.push(newReservation);
  return { success: true, reservation: newReservation };
}

/**
 * Convert a reservation to an expense
 */
export function convertReservationToExpense(
  reservationId: string,
  conversionData: ReservationConversionData
): { success: boolean; error?: string } {
  const reservationIndex = reservations.findIndex(
    (res) => res.id === reservationId
  );

  if (reservationIndex === -1) {
    return { success: false, error: "Réservation non trouvée." };
  }

  const reservation = reservations[reservationIndex];
  
  if (reservation.status !== "active") {
    return {
      success: false,
      error: "Seules les réservations actives peuvent être converties.",
    };
  }

  // Update reservation status
  reservations[reservationIndex] = {
    ...reservation,
    status: "utilized",
    utilizedDate: new Date().toISOString(),
    notes: reservation.notes
      ? `${reservation.notes}\n\nConverti le: ${new Date().toLocaleDateString(
          "fr-FR"
        )}\nVendeur: ${conversionData.vendor}`
      : `Converti le: ${new Date().toLocaleDateString(
          "fr-FR"
        )}\nVendeur: ${conversionData.vendor}`,
  };

  return { success: true };
}

/**
 * Cancel a reservation
 */
export function cancelReservation(
  reservationId: string,
  cancellationData: ReservationCancellationData
): { success: boolean; error?: string } {
  const reservationIndex = reservations.findIndex(
    (res) => res.id === reservationId
  );

  if (reservationIndex === -1) {
    return { success: false, error: "Réservation non trouvée." };
  }

  const reservation = reservations[reservationIndex];
  
  if (reservation.status !== "active") {
    return {
      success: false,
      error: "Seules les réservations actives peuvent être annulées.",
    };
  }

  // Update reservation status
  reservations[reservationIndex] = {
    ...reservation,
    status: "cancelled",
    cancellationReason: cancellationData.reason.trim(),
  };

  return { success: true };
}

/**
 * Delete a reservation (for cleanup/management)
 */
export function deleteReservation(
  reservationId: string
): { success: boolean; error?: string } {
  const reservation = reservations.find((res) => res.id === reservationId);
  
  if (!reservation) {
    return { success: false, error: "Réservation non trouvée." };
  }

  if (reservation.status === "active") {
    return {
      success: false,
      error: "Impossible de supprimer une réservation active. Annulez-la d'abord.",
    };
  }

  reservations = reservations.filter((res) => res.id !== reservationId);
  return { success: true };
}

/**
 * Calculate available amount for a category
 */
export function calculateAvailableAmount(
  planId: string,
  categoryId: string
): number {
  const plan = budgetPlans.find((p) => p.id === planId);
  if (!plan) return 0;

  const category = plan.categories.find((c) => c.id === categoryId);
  if (!category) return 0;

  const reservationSummary = getReservationSummary(planId, categoryId);
  return category.allocated - category.utilized - reservationSummary.totalReserved;
}

/**
 * Get all reservations (for admin/management)
 */
export function getAllReservations(): Reservation[] {
  return [...reservations];
}

/**
 * Parse amount string to number
 */
function parseAmount(value: string): number {
  if (value.trim() === "") {
    return NaN;
  }
  // Remove spaces and parse
  return Number(value.replace(/\s/g, ""));
}

/**
 * Export reservations to CSV format
 */
export function exportReservationsToCSV(planId: string): string {
  const planReservations = getReservationsByPlan(planId);
  const plan = budgetPlans.find((p) => p.id === planId);
  
  if (!planReservations.length) {
    return "Aucune réservation trouvée pour ce plan.";
  }

  if (!plan) {
    return "Plan budgétaire non trouvé.";
  }

  const headers = [
    "ID",
    "Catégorie",
    "Montant",
    "Devise",
    "Purpose",
    "Réservé par",
    "Date réservation",
    "Statut",
    "Date utilisation",
    "Raison annulation",
    "Notes",
  ];

  const csvRows = [
    headers.join(","),
    ...planReservations.map((reservation) => {
      const category = plan.categories.find((c) => c.id === reservation.categoryId);
      return [
        reservation.id,
        `"${category?.label || "Catégorie inconnue"}"`,
        reservation.amount,
        plan.currency,
        `"${reservation.purpose}"`,
        `"${reservation.reservedBy}"`,
        new Date(reservation.reservedDate).toLocaleDateString("fr-FR"),
        reservation.status,
        reservation.utilizedDate
          ? new Date(reservation.utilizedDate).toLocaleDateString("fr-FR")
          : "",
        `"${reservation.cancellationReason || ""}"`,
        `"${reservation.notes || ""}"`,
      ].join(",");
    }),
  ];

  return csvRows.join("\n");
}
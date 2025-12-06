import { useState, useMemo } from "react";
import {
  Plus,
  Download,
  Search,
  Calendar,
  DollarSign,
  FileText,
} from "lucide-react";
import ReservationCard from "../components/reservations/ReservationCard";
import ReservationModal from "../components/reservations/ReservationModal";
import { budgetPlans } from "../data/budgetPlans";
import {
  getReservationsByPlan,
  getAllReservations,
  exportReservationsToCSV,
} from "../services/reservationService";

const statusFilters = [
  { value: "all", label: "Toutes les réservations" },
  { value: "active", label: "Actives" },
  { value: "utilized", label: "Utilisées" },
  { value: "cancelled", label: "Annulées" },
];

export default function ReservationsPage() {
  const [selectedPlanId, setSelectedPlanId] = useState(budgetPlans[0]?.id || "");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Mock current user - in real app would come from auth context
  const currentUser = "Utilisateur Test";

  const selectedPlan = useMemo(
    () => budgetPlans.find((p) => p.id === selectedPlanId),
    [selectedPlanId]
  );

  const allReservations = useMemo(() => {
    const planReservations = selectedPlanId === "all" 
      ? getAllReservations()
      : getReservationsByPlan(selectedPlanId);
    
    return planReservations.filter((reservation) => {
      // Status filter
      if (statusFilter !== "all" && reservation.status !== statusFilter) {
        return false;
      }

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          reservation.purpose.toLowerCase().includes(searchLower) ||
          reservation.reservedBy.toLowerCase().includes(searchLower) ||
          (reservation.notes && reservation.notes.toLowerCase().includes(searchLower))
        );
      }

      return true;
    });
  }, [selectedPlanId, statusFilter, searchTerm, refreshKey]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const planReservations = selectedPlanId === "all" 
      ? getAllReservations()
      : getReservationsByPlan(selectedPlanId);

    const activeAmount = planReservations
      .filter(r => r.status === "active")
      .reduce((sum, r) => sum + r.amount, 0);
    
    const utilizedAmount = planReservations
      .filter(r => r.status === "utilized")
      .reduce((sum, r) => sum + r.amount, 0);
    
    const totalReservations = planReservations.length;

    return {
      totalReservations,
      activeAmount,
      utilizedAmount,
      activeCount: planReservations.filter(r => r.status === "active").length,
      utilizedCount: planReservations.filter(r => r.status === "utilized").length,
      cancelledCount: planReservations.filter(r => r.status === "cancelled").length,
    };
  }, [selectedPlanId, refreshKey]);

  const handleExportCSV = () => {
    if (selectedPlanId === "all") {
      alert("Veuillez sélectionner un plan spécifique pour l'export.");
      return;
    }

    const csv = exportReservationsToCSV(selectedPlanId);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `reservations-${selectedPlan?.name || "plan"}-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (!selectedPlan && selectedPlanId !== "all") {
    return (
      <div className="min-h-screen bg-mist py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-charcoal">Plan non trouvé</h1>
            <p className="mt-2 text-charcoal/60">
              Le plan budgétaire sélectionné n'existe pas.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mist py-10">
      <div className="mx-auto max-w-7xl space-y-8 px-6">
        {/* Header */}
        <header className="rounded-3xl bg-gradient-to-r from-[#0F3D5C] to-[#1BA8A4] p-8 text-white shadow-card">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-white/80">
                Gestion des réservations
              </p>
              <h1 className="font-display text-4xl">Réservations de Crédits</h1>
              <p className="text-white/80">
                Suivez, gérez et convertissez vos réservations budgétaires.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 rounded-full bg-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/30"
              >
                <Plus className="h-5 w-5" />
                Nouvelle réservation
              </button>
            </div>
          </div>
        </header>

        {/* Statistics */}
        <section className="grid gap-4 md:grid-cols-4">
          <article className="rounded-3xl border border-mist bg-white p-5 shadow-card">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-teal" />
              <p className="text-sm font-semibold text-charcoal/70">
                Total réservations
              </p>
            </div>
            <p className="mt-3 font-display text-3xl text-ocean">
              {statistics.totalReservations}
            </p>
          </article>

          <article className="rounded-3xl border border-mist bg-white p-5 shadow-card">
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-teal" />
              <p className="text-sm font-semibold text-charcoal/70">
                Montant actif
              </p>
            </div>
            <p className="mt-3 font-display text-2xl text-ocean">
              {statistics.activeAmount.toLocaleString("fr-FR")}{" "}
              {selectedPlan?.currency || "XAF"}
            </p>
            <p className="mt-1 text-sm text-charcoal/60">
              {statistics.activeCount} réservations actives
            </p>
          </article>

          <article className="rounded-3xl border border-mist bg-white p-5 shadow-card">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-emerald-600" />
              <p className="text-sm font-semibold text-charcoal/70">
                Montant utilisé
              </p>
            </div>
            <p className="mt-3 font-display text-2xl text-ocean">
              {statistics.utilizedAmount.toLocaleString("fr-FR")}{" "}
              {selectedPlan?.currency || "XAF"}
            </p>
            <p className="mt-1 text-sm text-charcoal/60">
              {statistics.utilizedCount} réservations utilisées
            </p>
          </article>

          <article className="rounded-3xl border border-mist bg-white p-5 shadow-card">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-rose-500" />
              <p className="text-sm font-semibold text-charcoal/70">
                Annulées
              </p>
            </div>
            <p className="mt-3 font-display text-2xl text-ocean">
              {statistics.cancelledCount}
            </p>
            <p className="mt-1 text-sm text-charcoal/60">
              Réservations annulées
            </p>
          </article>
        </section>

        {/* Filters */}
        <section className="rounded-3xl border border-mist bg-white p-6 shadow-card">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-wrap items-end gap-4">
              {/* Plan selector */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-charcoal/60">
                  Plan budgétaire
                </label>
                <select
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-mist px-4 py-2 text-sm font-semibold text-charcoal outline-none focus:ring-2 focus:ring-teal"
                >
                  <option value="all">Tous les plans</option>
                  {budgetPlans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status filter */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-charcoal/60">
                  Statut
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-mist px-4 py-2 text-sm font-semibold text-charcoal outline-none focus:ring-2 focus:ring-teal"
                >
                  {statusFilters.map((filter) => (
                    <option key={filter.value} value={filter.value}>
                      {filter.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 rounded-2xl border border-mist pl-10 pr-4 py-2 text-sm text-charcoal outline-none focus:ring-2 focus:ring-teal"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="rounded-full border border-mist px-4 py-2 text-sm text-charcoal/70 transition hover:border-teal hover:text-teal"
              >
                Actualiser
              </button>
              {selectedPlanId !== "all" && (
                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-2 rounded-full bg-teal px-4 py-2 text-sm font-semibold text-white transition hover:bg-ocean"
                >
                  <Download className="h-4 w-4" />
                  Exporter CSV
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Reservations List */}
        <section className="space-y-6">
          {allReservations.length === 0 ? (
            <div className="rounded-3xl border border-mist bg-white p-12 text-center shadow-card">
              <Calendar className="mx-auto h-12 w-12 text-charcoal/30" />
              <h3 className="mt-4 text-lg font-semibold text-charcoal">
                Aucune réservation trouvée
              </h3>
              <p className="mt-2 text-charcoal/60">
                {searchTerm
                  ? "Aucun résultat pour votre recherche."
                  : "Commencez par créer votre première réservation."}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-teal px-6 py-3 font-semibold text-white transition hover:bg-ocean"
                >
                  <Plus className="h-5 w-5" />
                  Créer une réservation
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allReservations.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  plan={selectedPlan || budgetPlans[0]}
                  onStatusChange={handleRefresh}
                  showActions={true}
                />
              ))}
            </div>
          )}
        </section>

        {/* Create Modal */}
        {selectedPlan && (
          <ReservationModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            plan={selectedPlan}
            onReservationCreated={handleRefresh}
            currentUser={currentUser}
          />
        )}
      </div>
    </div>
  );
}

import { useEffect, useMemo, useReducer, useState } from "react";
import {
  Activity,
  ArrowRight,
  Check,
  ClipboardList,
  Info,
  Pencil,
  Plus,
  RefreshCw,
  Target,
  Trash2,
  Wallet,
  X,
  CreditCard,
} from "lucide-react";
import {
  budgetPlans,
  createEditableCategories,
  executionEntries,
  planRevisions,
} from "../data/budgetPlans";
import type { BudgetPlan, BudgetPlanCategory } from "../types/entities";
import ReservationModal from "../components/reservations/ReservationModal";

const statusTokens: Record<
  BudgetPlan["status"],
  { label: string; classes: string }
> = {
  draft: { label: "Brouillon", classes: "bg-amber-100 text-amber-800" },
  validated: { label: "Validé", classes: "bg-emerald-100 text-emerald-800" },
  reforecast: { label: "Reforecast", classes: "bg-sky-100 text-sky-800" },
};

const riskTokens = {
  low: "bg-emerald-100 text-emerald-800",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-rose-100 text-rose-800",
};

const defaultAddForm = {
  label: "",
  owner: "",
  allocated: "",
  utilized: "",
  notes: "",
};

type AddFormState = typeof defaultAddForm;

type Feedback =
  | {
      type: "success" | "error";
      message: string;
    }
  | null;

type EditingDraft = {
  id: string;
  label: string;
  owner: string;
  allocated: string;
  utilized: string;
  notes: string;
};

type EditorState = {
  planId: string;
  categories: BudgetPlanCategory[];
  editingDraft: EditingDraft | null;
  showAddForm: boolean;
  addForm: AddFormState;
  feedback: Feedback;
};

type EditorAction =
  | { type: "hydrate"; planId: string; categories: BudgetPlanCategory[] }
  | { type: "toggleAddForm"; open?: boolean }
  | { type: "updateAddForm"; field: keyof AddFormState; value: string }
  | { type: "addCategory" }
  | { type: "startEdit"; categoryId: string }
  | { type: "cancelEdit" }
  | { type: "updateEditingField"; field: keyof EditingDraft; value: string }
  | { type: "saveEdit" }
  | { type: "deleteCategory"; categoryId: string }
  | { type: "clearFeedback" };

function buildInitialEditorState(initialPlanId: string): EditorState {
  return {
    planId: initialPlanId,
    categories: initialPlanId ? createEditableCategories(initialPlanId) : [],
    editingDraft: null,
    showAddForm: false,
    addForm: defaultAddForm,
    feedback: null,
  };
}

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "hydrate":
      return {
        ...state,
        planId: action.planId,
        categories: action.categories,
        editingDraft: null,
        showAddForm: false,
        addForm: defaultAddForm,
        feedback: null,
      };
    case "toggleAddForm":
      return {
        ...state,
        showAddForm: action.open ?? !state.showAddForm,
        addForm: action.open === false ? defaultAddForm : state.addForm,
        feedback: null,
      };
    case "updateAddForm":
      return {
        ...state,
        addForm: { ...state.addForm, [action.field]: action.value },
      };
    case "addCategory": {
      const allocated = parseAmount(state.addForm.allocated);
      const utilized =
        state.addForm.utilized.trim() === ""
          ? 0
          : parseAmount(state.addForm.utilized);
      const errors = validateCategoryPayload({
        label: state.addForm.label,
        owner: state.addForm.owner,
        allocated,
        utilized,
      });

      if (errors.length) {
        return {
          ...state,
          feedback: { type: "error", message: errors.join(" ") },
        };
      }

      const newCategory: BudgetPlanCategory = {
        id: `cat-${Date.now()}`,
        label: state.addForm.label.trim(),
        owner: state.addForm.owner.trim(),
        allocated,
        utilized,
        reserved: 0,
        notes: sanitizeNotes(state.addForm.notes),
      };

      return {
        ...state,
        categories: [...state.categories, newCategory],
        addForm: defaultAddForm,
        showAddForm: false,
        feedback: { type: "success", message: "Ligne budgétaire ajoutée." },
      };
    }
    case "startEdit": {
      const target = state.categories.find(
        (category) => category.id === action.categoryId
      );
      if (!target) {
        return state;
      }
      return {
        ...state,
        editingDraft: convertCategoryToDraft(target),
        feedback: null,
      };
    }
    case "cancelEdit":
      return { ...state, editingDraft: null };
    case "updateEditingField":
      if (!state.editingDraft) {
        return state;
      }
      return {
        ...state,
        editingDraft: {
          ...state.editingDraft,
          [action.field]: action.value,
        },
      };
    case "saveEdit":
      if (!state.editingDraft) {
        return state;
      }
      const parsed = convertDraftToCategory(state.editingDraft);
      const errors = validateCategoryPayload({
        label: parsed.label,
        owner: parsed.owner,
        allocated: parsed.allocated,
        utilized: parsed.utilized,
      });
      if (errors.length) {
        return {
          ...state,
          feedback: { type: "error", message: errors.join(" ") },
        };
      }
      return {
        ...state,
        categories: state.categories.map((category) =>
          category.id === parsed.id ? parsed : category
        ),
        editingDraft: null,
        feedback: { type: "success", message: "Ligne mise à jour." },
      };
    case "deleteCategory":
      return {
        ...state,
        categories: state.categories.filter(
          (category) => category.id !== action.categoryId
        ),
        editingDraft:
          state.editingDraft?.id === action.categoryId
            ? null
            : state.editingDraft,
        feedback: { type: "success", message: "Ligne supprimée." },
      };
    case "clearFeedback":
      return { ...state, feedback: null };
    default:
      return state;
  }
}

function parseAmount(value: string) {
  if (value.trim() === "") {
    return NaN;
  }
  return Number(value.replace(/\s/g, ""));
}

function sanitizeNotes(value: string) {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

function validateCategoryPayload(params: {
  label: string;
  owner: string;
  allocated: number;
  utilized: number;
}) {
  const errors: string[] = [];
  if (!params.label.trim()) {
    errors.push("Le nom de la catégorie est requis.");
  }
  if (!params.owner.trim()) {
    errors.push("Merci d indiquer un responsable.");
  }
  if (!Number.isFinite(params.allocated) || params.allocated <= 0) {
    errors.push("Le montant alloué doit être supérieur à 0.");
  }
  if (!Number.isFinite(params.utilized) || params.utilized < 0) {
    errors.push("Le montant utilisé doit être positif.");
  }
  if (
    Number.isFinite(params.allocated) &&
    Number.isFinite(params.utilized) &&
    params.utilized > params.allocated
  ) {
    errors.push("Le montant utilisé ne peut pas dépasser l allocation.");
  }
  return errors;
}

function convertCategoryToDraft(category: BudgetPlanCategory): EditingDraft {
  return {
    id: category.id,
    label: category.label,
    owner: category.owner,
    allocated: category.allocated.toString(),
    utilized: category.utilized.toString(),
    notes: category.notes ?? "",
  };
}

function convertDraftToCategory(draft: EditingDraft): BudgetPlanCategory {
  return {
    id: draft.id,
    label: draft.label.trim(),
    owner: draft.owner.trim(),
    allocated: parseAmount(draft.allocated),
    utilized:
      draft.utilized.trim() === "" ? 0 : parseAmount(draft.utilized.trim()),
    reserved: 0, // For now, editing doesn't change reserved
    notes: sanitizeNotes(draft.notes),
  };
}

function calculatePercentage(utilized: number, allocated: number) {
  if (!allocated || !Number.isFinite(utilized) || !Number.isFinite(allocated)) {
    return 0;
  }
  return Math.min(100, Math.max(0, Math.round((utilized / allocated) * 100)));
}

export default function BudgetManagementPage() {
  const initialPlanId = budgetPlans[0]?.id ?? "";
  const [selectedPlanId, setSelectedPlanId] = useState(initialPlanId);
  const [editorState, dispatch] = useReducer(
    editorReducer,
    initialPlanId,
    (planId) => buildInitialEditorState(planId)
  );
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedCategoryForReservation, setSelectedCategoryForReservation] = useState<BudgetPlanCategory | undefined>();

  const activePlan =
    useMemo(
      () => budgetPlans.find((plan) => plan.id === selectedPlanId),
      [selectedPlanId]
    ) ?? budgetPlans[0];

  useEffect(() => {
    if (!activePlan) {
      return;
    }
    dispatch({
      type: "hydrate",
      planId: activePlan.id,
      categories: createEditableCategories(activePlan.id),
    });
  }, [activePlan?.id]);

  useEffect(() => {
    if (!editorState.feedback) {
      return;
    }
    const timeout = setTimeout(() => {
      dispatch({ type: "clearFeedback" });
    }, 3200);
    return () => clearTimeout(timeout);
  }, [editorState.feedback]);

  const revisions = useMemo(
    () => planRevisions.filter((rev) => rev.planId === activePlan.id),
    [activePlan.id]
  );

  const executions = useMemo(
    () => executionEntries.filter((entry) => entry.planId === activePlan.id),
    [activePlan.id]
  );

  const categories =
    editorState.planId === activePlan.id
      ? editorState.categories
      : createEditableCategories(activePlan.id);

  const totalUtilized = categories.reduce(
    (sum, category) => sum + category.utilized,
    0
  );
  const totalReserved = categories.reduce(
    (sum, category) => sum + category.reserved,
    0
  );
  const totalCommitted = totalUtilized + totalReserved;
  const utilizationRate = activePlan.totalBudget
    ? totalCommitted / activePlan.totalBudget
    : 0;
  const reserve = Math.max(activePlan.totalBudget - totalCommitted, 0);
  const isDraftPlan = activePlan.status === "draft";
  const editingPercent = editorState.editingDraft
    ? calculatePercentage(
        editorState.editingDraft.utilized.trim()
          ? parseAmount(editorState.editingDraft.utilized)
          : 0,
        parseAmount(editorState.editingDraft.allocated)
      )
    : 0;
  const addPercent = calculatePercentage(
    editorState.addForm.utilized.trim()
      ? parseAmount(editorState.addForm.utilized)
      : 0,
    parseAmount(editorState.addForm.allocated)
  );

  const handleCreateReservation = (category?: BudgetPlanCategory) => {
    setSelectedCategoryForReservation(category);
    setShowReservationModal(true);
  };

  const handleReservationCreated = () => {
    // Refresh the page data when a reservation is created
    window.location.reload();
  };

  return (
    <>
        <header className="rounded-3xl bg-gradient-to-r from-[#0F3D5C] to-[#1BA8A4] p-8 text-white shadow-card">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-white/80">
                Gestion des budgets
              </p>
              <h1 className="font-display text-4xl">{activePlan.name}</h1>
              <p className="text-white/80">
                Pilotez vos plans financiers, documentez les ajustements et
                suivez l'exécution terrain en temps réel.
              </p>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm">
                <RefreshCw className="h-4 w-4" />
                Mis à jour le{" "}
                {new Date(activePlan.updatedAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
            <div className="w-full max-w-sm rounded-2xl bg-white/95 p-4 text-charcoal shadow-lg">
              <label className="text-xs font-semibold uppercase tracking-wide text-charcoal/60">
                Plan suivi
              </label>
              <select
                value={activePlan.id}
                onChange={(event) => setSelectedPlanId(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-mist px-4 py-2 text-sm font-semibold text-charcoal outline-none focus:ring-2 focus:ring-teal"
              >
                {budgetPlans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                  </option>
                ))}
              </select>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                <span
                  className={`rounded-full px-3 py-1 font-semibold ${statusTokens[activePlan.status].classes}`}
                >
                  {statusTokens[activePlan.status].label}
                </span>
                <span className="text-charcoal/60">
                  Responsable: {activePlan.owner}
                </span>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-3xl border border-mist bg-white p-5 shadow-card">
            <div className="flex items-center gap-3">
              <Wallet className="h-5 w-5 text-teal" />
              <p className="text-sm font-semibold text-charcoal/70">
                Budget global
              </p>
            </div>
            <p className="mt-3 font-display text-3xl text-ocean">
              {activePlan
                ? `${activePlan.totalBudget.toLocaleString("fr-FR")} ${
                    activePlan.currency
                  }`
                : "-"}
            </p>
            <div className="mt-4">
              <p className="text-xs uppercase text-charcoal/50">
                Taux d'engagement
              </p>
              <div className="mt-2 h-2 w-full rounded-full bg-mist">
                <div
                  className="h-2 rounded-full bg-teal transition-all"
                  style={{ width: `${Math.min(utilizationRate * 100, 100)}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-charcoal/70">
                {Math.round(utilizationRate * 100)}% engagé |{" "}
                {totalCommitted.toLocaleString("fr-FR")} {activePlan.currency}
              </p>
            </div>
          </article>

          <article className="rounded-3xl border border-mist bg-white p-5 shadow-card">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-teal" />
              <p className="text-sm font-semibold text-charcoal/70">
                Objectifs clés
              </p>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-charcoal/80">
              {activePlan.objectives.map((objective) => (
                <li key={objective} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-teal" />
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-mist bg-white p-5 shadow-card">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-teal" />
              <p className="text-sm font-semibold text-charcoal/70">
                Réserves disponibles
              </p>
            </div>
            <p className="mt-3 font-display text-3xl text-ocean">
              {reserve.toLocaleString("fr-FR")} {activePlan.currency}
            </p>
            <p className="mt-2 text-sm text-charcoal/70">
              Permet de financer {reserve > 0 ? "≈2 mois" : "0 mois"} de charges
              critiques en cas de risque.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-mist/60 px-3 py-1 text-xs text-charcoal/70">
              <ArrowRight className="h-4 w-4" />
              Scenario inflation revu en mai
            </div>
          </article>
        </section>

        <section className="rounded-3xl border border-mist bg-white p-6 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <ClipboardList className="h-5 w-5 text-teal" />
              <div>
                <p className="text-sm uppercase tracking-wide text-charcoal/50">
                  Architecture budgétaire
                </p>
                <h2 className="text-xl font-semibold text-charcoal">
                  Répartition par catégorie
                </h2>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {isDraftPlan ? (
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => dispatch({ type: "toggleAddForm" })}
                    className="inline-flex items-center gap-2 rounded-full bg-teal px-4 py-2 text-sm font-semibold text-white shadow-card transition hover:bg-ocean"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter une ligne
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCreateReservation()}
                    className="inline-flex items-center gap-2 rounded-full border border-teal bg-teal/10 px-4 py-2 text-sm font-semibold text-teal transition hover:bg-teal hover:text-white"
                  >
                    <CreditCard className="h-4 w-4" />
                    Nouvelle réservation
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 rounded-full bg-mist/60 px-4 py-2 text-xs font-medium text-charcoal/70">
                    <Info className="h-4 w-4 text-teal" />
                    Édition disponible uniquement pour un plan brouillon.
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCreateReservation()}
                    className="inline-flex items-center gap-2 rounded-full border border-teal bg-teal/10 px-4 py-2 text-sm font-semibold text-teal transition hover:bg-teal hover:text-white"
                  >
                    <CreditCard className="h-4 w-4" />
                    Gérer les réservations
                  </button>
                </div>
              )}
              <p className="text-sm text-charcoal/60">
                Ventilation {activePlan.fiscalPeriod.start} —{" "}
                {activePlan.fiscalPeriod.end}
              </p>
            </div>
          </div>

          {editorState.feedback && (
            <div
              className={`mt-4 rounded-2xl border px-4 py-2 text-sm ${
                editorState.feedback.type === "error"
                  ? "border-rose-200 bg-rose-50 text-rose-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
            >
              {editorState.feedback.message}
            </div>
          )}

          {editorState.showAddForm && isDraftPlan && (
            <div className="mt-5 rounded-3xl border border-dashed border-teal bg-mist/40 p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm font-semibold text-charcoal">
                  Intitulé
                  <input
                    className="mt-2 w-full rounded-2xl border border-mist px-3 py-2 text-sm"
                    value={editorState.addForm.label}
                    onChange={(event) =>
                      dispatch({
                        type: "updateAddForm",
                        field: "label",
                        value: event.target.value,
                      })
                    }
                  />
                </label>
                <label className="text-sm font-semibold text-charcoal">
                  Responsable
                  <input
                    className="mt-2 w-full rounded-2xl border border-mist px-3 py-2 text-sm"
                    value={editorState.addForm.owner}
                    onChange={(event) =>
                      dispatch({
                        type: "updateAddForm",
                        field: "owner",
                        value: event.target.value,
                      })
                    }
                  />
                </label>
                <label className="text-sm font-semibold text-charcoal">
                  Montant alloué
                  <input
                    type="number"
                    min={0}
                    className="mt-2 w-full rounded-2xl border border-mist px-3 py-2 text-sm"
                    value={editorState.addForm.allocated}
                    onChange={(event) =>
                      dispatch({
                        type: "updateAddForm",
                        field: "allocated",
                        value: event.target.value,
                      })
                    }
                  />
                </label>
                <label className="text-sm font-semibold text-charcoal">
                  Montant utilisé
                  <input
                    type="number"
                    min={0}
                    className="mt-2 w-full rounded-2xl border border-mist px-3 py-2 text-sm"
                    value={editorState.addForm.utilized}
                    onChange={(event) =>
                      dispatch({
                        type: "updateAddForm",
                        field: "utilized",
                        value: event.target.value,
                      })
                    }
                  />
                </label>
                <label className="text-sm font-semibold text-charcoal md:col-span-2">
                  Notes
                  <textarea
                    rows={3}
                    className="mt-2 w-full rounded-2xl border border-mist px-3 py-2 text-sm"
                    value={editorState.addForm.notes}
                    onChange={(event) =>
                      dispatch({
                        type: "updateAddForm",
                        field: "notes",
                        value: event.target.value,
                      })
                    }
                  />
                </label>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-charcoal/70">
                <span>
                  Utilisation projetée:{" "}
                  <strong className="text-charcoal">{addPercent}%</strong>
                </span>
                <div className="ml-auto flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border border-mist px-4 py-2 text-sm text-charcoal/70"
                    onClick={() => dispatch({ type: "toggleAddForm", open: false })}
                  >
                    <X className="h-4 w-4" />
                    Annuler
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full bg-teal px-4 py-2 text-sm font-semibold text-white"
                    onClick={() => dispatch({ type: "addCategory" })}
                  >
                    <Check className="h-4 w-4" />
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-charcoal/50">
                  <th className="py-3 font-medium">Catégorie</th>
                  <th className="py-3 font-medium">Responsable</th>
                  <th className="py-3 font-medium">Alloué</th>
                  <th className="py-3 font-medium">Utilisé</th>
                  <th className="py-3 font-medium">Réservé</th>
                  <th className="py-3 font-medium">Taux</th>
                  {isDraftPlan && (
                    <th className="py-3 text-right font-medium">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => {
                  const isEditingRow =
                    editorState.editingDraft?.id === category.id;
                  const progress = calculatePercentage(
                    category.utilized + category.reserved,
                    category.allocated
                  );

                  return (
                    <tr key={category.id} className="border-t border-mist/60">
                      <td className="py-4">
                        {isEditingRow ? (
                          <input
                            className="w-full rounded-2xl border border-mist px-3 py-2 text-sm font-semibold text-charcoal"
                            value={editorState.editingDraft?.label ?? ""}
                            onChange={(event) =>
                              dispatch({
                                type: "updateEditingField",
                                field: "label",
                                value: event.target.value,
                              })
                            }
                          />
                        ) : (
                          <div>
                            <p className="font-semibold text-charcoal">
                              {category.label}
                            </p>
                            {category.notes && (
                              <p className="text-xs text-charcoal/60">
                                {category.notes}
                              </p>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-4 text-charcoal/70">
                        {isEditingRow ? (
                          <input
                            className="w-full rounded-2xl border border-mist px-3 py-2 text-sm"
                            value={editorState.editingDraft?.owner ?? ""}
                            onChange={(event) =>
                              dispatch({
                                type: "updateEditingField",
                                field: "owner",
                                value: event.target.value,
                              })
                            }
                          />
                        ) : (
                          category.owner
                        )}
                      </td>
                      <td className="py-4 text-charcoal/70">
                        {isEditingRow ? (
                          <input
                            type="number"
                            min={0}
                            className="w-full rounded-2xl border border-mist px-3 py-2 text-sm"
                            value={editorState.editingDraft?.allocated ?? ""}
                            onChange={(event) =>
                              dispatch({
                                type: "updateEditingField",
                                field: "allocated",
                                value: event.target.value,
                              })
                            }
                          />
                        ) : (
                          `${category.allocated.toLocaleString("fr-FR")} ${
                            activePlan.currency
                          }`
                        )}
                      </td>
                      <td className="py-4 text-charcoal/70">
                        {isEditingRow ? (
                          <div>
                            <input
                              type="number"
                              min={0}
                              className="w-full rounded-2xl border border-mist px-3 py-2 text-sm"
                              value={editorState.editingDraft?.utilized ?? ""}
                              onChange={(event) =>
                                dispatch({
                                  type: "updateEditingField",
                                  field: "utilized",
                                  value: event.target.value,
                                })
                              }
                            />
                            <p className="mt-1 text-xs text-charcoal/60">
                              Utilisation: <strong>{editingPercent}%</strong>
                            </p>
                          </div>
                        ) : (
                          `${category.utilized.toLocaleString("fr-FR")} ${
                            activePlan.currency
                          }`
                        )}
                      </td>
                      <td className="py-4 text-charcoal/70">
                        {`${category.reserved.toLocaleString("fr-FR")} ${
                          activePlan.currency
                        }`}
                      </td>
                      <td className="py-4">
                        <div className="text-right font-semibold text-ocean">
                          {progress}%
                        </div>
                        <div className="mt-2 h-1.5 rounded-full bg-mist">
                          <div
                            className="h-1.5 rounded-full bg-teal"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                      </td>
                      {isDraftPlan && (
                        <td className="py-4">
                          {isEditingRow ? (
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                className="inline-flex items-center gap-1 rounded-full bg-teal px-3 py-1 text-xs font-semibold text-white"
                                onClick={() => dispatch({ type: "saveEdit" })}
                              >
                                <Check className="h-3.5 w-3.5" />
                                Enregistrer
                              </button>
                              <button
                                type="button"
                                className="inline-flex items-center gap-1 rounded-full border border-mist px-3 py-1 text-xs text-charcoal/70"
                                onClick={() => dispatch({ type: "cancelEdit" })}
                              >
                                <X className="h-3.5 w-3.5" />
                                Annuler
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                className="rounded-full border border-mist p-2 text-charcoal/70 transition hover:border-teal hover:text-teal"
                                onClick={() =>
                                  dispatch({
                                    type: "startEdit",
                                    categoryId: category.id,
                                  })
                                }
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCreateReservation(category)}
                                className="rounded-full border border-teal/50 bg-teal/10 p-2 text-teal transition hover:bg-teal hover:text-white"
                                title="Créer une réservation pour cette catégorie"
                              >
                                <CreditCard className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                className="rounded-full border border-rose-200 p-2 text-rose-500 transition hover:bg-rose-50"
                                onClick={() =>
                                  dispatch({
                                    type: "deleteCategory",
                                    categoryId: category.id,
                                  })
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <article className="rounded-3xl border border-mist bg-white p-6 shadow-card">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 text-teal" />
              <div>
                <p className="text-sm uppercase tracking-wide text-charcoal/50">
                  Modifications
                </p>
                <h2 className="text-xl font-semibold text-charcoal">
                  Journal des révisions
                </h2>
              </div>
            </div>
            <ol className="mt-6 space-y-4">
              {revisions.map((revision) => (
                <li
                  key={revision.id}
                  className="rounded-2xl border border-mist bg-mist/40 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-charcoal">
                        {new Date(revision.date).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                        })}
                      </p>
                      <p className="text-xs text-charcoal/60">
                        Par {revision.author}
                      </p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-charcoal/70">
                      {revision.type === "donor-request"
                        ? "Req. bailleur"
                        : revision.type === "risk-mitigation"
                        ? "Mitigation"
                        : "Ajustement"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-charcoal/80">
                    {revision.summary}
                  </p>
                  <div className="mt-4 space-y-2">
                    {revision.impacts.map((impact) => (
                      <div
                        key={`${revision.id}-${impact.category}`}
                        className="flex items-start justify-between gap-4 rounded-2xl bg-white/70 px-3 py-2 text-sm"
                      >
                        <div>
                          <p className="font-semibold text-charcoal">
                            {impact.category}
                          </p>
                          <p className="text-xs text-charcoal/60">
                            {impact.narrative}
                          </p>
                        </div>
                        <span
                          className={`text-sm font-semibold ${
                            impact.delta >= 0 ? "text-teal" : "text-rose-500"
                          }`}
                        >
                          {impact.delta >= 0 ? "+" : ""}
                          {impact.delta.toLocaleString("fr-FR")} XAF
                        </span>
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ol>
          </article>

          <article className="rounded-3xl border border-mist bg-white p-6 shadow-card">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-teal" />
              <div>
                <p className="text-sm uppercase tracking-wide text-charcoal/50">
                  Exécution
                </p>
                <h2 className="text-xl font-semibold text-charcoal">
                  Avancement terrain
                </h2>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {executions.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-2xl border border-mist bg-mist/40 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-semibold text-charcoal">{entry.period}</p>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        riskTokens[entry.riskLevel]
                      }`}
                    >
                      Risque {entry.riskLevel}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-charcoal/70">
                    {entry.highlight}
                  </p>
                  {entry.blocker && (
                    <p className="mt-1 text-xs text-rose-500">
                      ⚠︎ {entry.blocker}
                    </p>
                  )}
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-charcoal/50">Engagé</p>
                      <p className="font-semibold text-charcoal">
                        {entry.committed.toLocaleString("fr-FR")}{" "}
                        {activePlan.currency}
                      </p>
                    </div>
                    <div>
                      <p className="text-charcoal/50">Décaissé</p>
                      <p className="font-semibold text-charcoal">
                        {entry.disbursed.toLocaleString("fr-FR")}{" "}
                        {activePlan.currency}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-charcoal/60">
                      <span>Taux d'achèvement</span>
                      <span className="font-semibold text-ocean">
                        {Math.round(entry.completionRate * 100)}%
                      </span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-white">
                      <div
                        className="h-2 rounded-full bg-teal"
                        style={{
                          width: `${Math.min(entry.completionRate * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        {/* Reservation Modal */}
        {activePlan && (
          <ReservationModal
            isOpen={showReservationModal}
            onClose={() => {
              setShowReservationModal(false);
              setSelectedCategoryForReservation(undefined);
            }}
            plan={activePlan}
            category={selectedCategoryForReservation}
            onReservationCreated={handleReservationCreated}
            currentUser="Utilisateur Test" // In real app, would come from auth context
          />
        )}
    </>
  );
}
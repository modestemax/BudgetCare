import type { BudgetPlan, ExecutionEntry, PlanRevision } from "../types/entities";

export const budgetPlans: BudgetPlan[] = [
  {
    id: "plan-2025",
    organizationId: "ngo-001",
    name: "Plan budgétaire 2025",
    owner: "Agnès Mbarga",
    fiscalPeriod: {
      start: "2025-01-01",
      end: "2025-12-31",
    },
    totalBudget: 150000000,
    currency: "XAF",
    status: "validated",
    categories: [
      {
        id: "cat-education",
        label: "Education inclusive",
        owner: "Agnès Mbarga",
        allocated: 48000000,
        utilized: 32000000,
        notes: "Priorité équipements pédagogiques et bourses",
      },
      {
        id: "cat-health",
        label: "Santé communautaire",
        owner: "Eric Nganou",
        allocated: 42000000,
        utilized: 31000000,
        notes: "Opérations cliniques mobiles et stocks pharmaceutiques",
      },
      {
        id: "cat-climate",
        label: "Agroécologie et climat",
        owner: "Fanny Essama",
        allocated: 28000000,
        utilized: 9000000,
        notes: "Reboisement zones critiques et kits coopératives",
      },
      {
        id: "cat-ops",
        label: "Fonctionnement et conformité",
        owner: "Service Finance",
        allocated: 32000000,
        utilized: 18000000,
        notes: "Audit externe, systèmes d'information et contingence",
      },
    ],
    objectives: [
      "Stabiliser les programmes prioritaires tout en gardant 20% de réserve",
      "Garantir la conformité bailleurs UNICEF et AFD",
      "Accélérer l'autonomie des coopératives agroécologiques",
    ],
    updatedAt: "2025-11-28T09:15:00Z",
  },
  {
    id: "plan-2024-reforecast",
    organizationId: "ngo-001",
    name: "Reforecast S2 2024",
    owner: "Comité Budget",
    fiscalPeriod: {
      start: "2024-07-01",
      end: "2024-12-31",
    },
    totalBudget: 72000000,
    currency: "XAF",
    status: "reforecast",
    categories: [
      {
        id: "cat-education-2024",
        label: "Education inclusive",
        owner: "Agnès Mbarga",
        allocated: 25000000,
        utilized: 21000000,
      },
      {
        id: "cat-health-2024",
        label: "Santé communautaire",
        owner: "Eric Nganou",
        allocated: 22000000,
        utilized: 19500000,
      },
      {
        id: "cat-ops-2024",
        label: "Fonctionnement et conformité",
        owner: "Service Finance",
        allocated: 25000000,
        utilized: 20000000,
        notes: "Renfort logistique S2",
      },
    ],
    objectives: [
      "Réattribuer les reliquats suite au glissement de planning",
      "Assurer l'ajustement des salaires terrain face à l'inflation",
    ],
    updatedAt: "2024-10-15T17:45:00Z",
  },
];

export const planRevisions: PlanRevision[] = [
  {
    id: "rev-001",
    planId: "plan-2025",
    date: "2025-02-12",
    author: "Eric Nganou",
    type: "adjustment",
    summary: "Réallocation d'urgence vers la clinique mobile Nord",
    impacts: [
      {
        category: "Santé communautaire",
        delta: 3000000,
        narrative: "Augmentation couverture carburant et maintenance des vans",
      },
      {
        category: "Fonctionnement et conformité",
        delta: -3000000,
        narrative: "Réduction du budget contingence Q1",
      },
    ],
  },
  {
    id: "rev-002",
    planId: "plan-2025",
    date: "2025-05-30",
    author: "Comité Budget",
    type: "donor-request",
    summary: "Alignement sur nouvelle matrice UNICEF",
    impacts: [
      {
        category: "Education inclusive",
        delta: 2500000,
        narrative: "Financement de 1 200 kits STEM filles",
      },
    ],
  },
  {
    id: "rev-003",
    planId: "plan-2024-reforecast",
    date: "2024-09-08",
    author: "Service Finance",
    type: "risk-mitigation",
    summary: "Gel des dépenses non critiques jusqu'à réception tranche bailleur",
    impacts: [
      {
        category: "Fonctionnement et conformité",
        delta: -1500000,
        narrative: "Gel consultants externes",
      },
    ],
  },
];

export const executionEntries: ExecutionEntry[] = [
  {
    id: "exec-jan",
    planId: "plan-2025",
    period: "Janvier 2025",
    committed: 11800000,
    disbursed: 9400000,
    completionRate: 0.78,
    riskLevel: "medium",
    highlight: "Lancement des cohortes scolaires et campagne vaccination",
    blocker: "Retard d'approvisionnement TICE",
  },
  {
    id: "exec-mar",
    planId: "plan-2025",
    period: "Mars 2025",
    committed: 14200000,
    disbursed: 12600000,
    completionRate: 0.89,
    riskLevel: "low",
    highlight: "Achèvement audit externe et signature bailleurs",
  },
  {
    id: "exec-may",
    planId: "plan-2025",
    period: "Mai 2025",
    committed: 16500000,
    disbursed: 14900000,
    completionRate: 0.9,
    riskLevel: "medium",
    highlight: "Déploiement de 3 nouvelles cliniques mobiles",
    blocker: "Plafond bancaire atteint sur compte projet santé",
  },
  {
    id: "exec-oct-2024",
    planId: "plan-2024-reforecast",
    period: "Octobre 2024",
    committed: 9800000,
    disbursed: 8200000,
    completionRate: 0.84,
    riskLevel: "high",
    highlight: "Maintien des classes communautaires malgré retards de dons",
    blocker: "Cash-call bailleur différé de 3 semaines",
  },
];
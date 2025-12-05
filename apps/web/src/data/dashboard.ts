import type { Program } from "../types/entities";

export type KpiCard = {
  id: string;
  label: string;
  value: string;
  delta: number;
  trend: "up" | "down";
  helper: string;
};

export type BudgetSeries = {
  month: string;
  budget: number;
  actual: number;
};

export type TransactionItem = {
  id: string;
  type: "income" | "expense";
  label: string;
  program: string;
  amount: number;
  date: string;
  channel: string;
};

export type AlertItem = {
  id: string;
  title: string;
  description: string;
  severity: "warning" | "info";
};

export const kpiCards: KpiCard[] = [
  {
    id: "budget",
    label: "Budget annuel engagé",
    value: "132 M XAF",
    delta: 12,
    trend: "up",
    helper: "vs. l année dernière",
  },
  {
    id: "spend",
    label: "Dépenses réalisées",
    value: "82 M XAF",
    delta: 6,
    trend: "up",
    helper: "49 transactions ce mois",
  },
  {
    id: "burn",
    label: "Taux de consommation",
    value: "62%",
    delta: 4,
    trend: "down",
    helper: "Objectif < 70%",
  },
  {
    id: "beneficiaries",
    label: "Bénéficiaires servis",
    value: "18 420",
    delta: 15,
    trend: "up",
    helper: "Programmes Education & Santé",
  },
];

export const programs: Program[] = [
  {
    id: "education",
    organizationId: "ngo-001",
    title: "Education inclusive",
    owner: "Agnès Mbarga",
    description: "Appui scolaire zones rurales Ouest",
    annualBudget: 45000000,
    spentToDate: 28500000,
    impactFocus: "Scolarisation",
  },
  {
    id: "sante",
    organizationId: "ngo-001",
    title: "Santé communautaire",
    owner: "Eric Nganou",
    description: "Clinique mobile pour femmes enceintes",
    annualBudget: 38000000,
    spentToDate: 29500000,
    impactFocus: "Santé",
  },
  {
    id: "environment",
    organizationId: "ngo-001",
    title: "Agroécologie",
    owner: "Fanny Essama",
    description: "Formations coopératives et reboisement",
    annualBudget: 26000000,
    spentToDate: 9000000,
    impactFocus: "Environnement",
  },
];

export const budgetSeries: BudgetSeries[] = [
  { month: "Jan", budget: 9.5, actual: 7.8 },
  { month: "Fev", budget: 10.2, actual: 8.7 },
  { month: "Mar", budget: 11.0, actual: 9.3 },
  { month: "Avr", budget: 11.4, actual: 10.1 },
  { month: "Mai", budget: 11.9, actual: 10.9 },
  { month: "Juin", budget: 12.3, actual: 11.7 },
  { month: "Juil", budget: 12.8, actual: 12.1 },
  { month: "Août", budget: 13.1, actual: 11.9 },
  { month: "Sep", budget: 13.5, actual: 12.4 },
  { month: "Oct", budget: 13.8, actual: 12.7 },
  { month: "Nov", budget: 14.1, actual: 13.2 },
  { month: "Dec", budget: 14.6, actual: 13.8 },
];

export const transactions: TransactionItem[] = [
  {
    id: "txn-001",
    type: "expense",
    label: "Achat kits scolaires",
    program: "Education inclusive",
    amount: 1850000,
    date: "5 déc.",
    channel: "Bon de commande",
  },
  {
    id: "txn-002",
    type: "income",
    label: "Tranche bailleur UNICEF",
    program: "Santé communautaire",
    amount: 12000000,
    date: "3 déc.",
    channel: "Virement",
  },
  {
    id: "txn-003",
    type: "expense",
    label: "Per diem mission terrain",
    program: "Agroécologie",
    amount: 640000,
    date: "30 nov.",
    channel: "Cash advance",
  },
  {
    id: "txn-004",
    type: "expense",
    label: "Audit externe S1",
    program: "Transversal",
    amount: 2200000,
    date: "28 nov.",
    channel: "Virement",
  },
];

export const alerts: AlertItem[] = [
  {
    id: "alert-001",
    title: "Catégorie logistique proche du seuil",
    description:
      "Le programme Santé communautaire a consommé 82% du budget logistique.",
    severity: "warning",
  },
  {
    id: "alert-002",
    title: "Rapport bailleur trimestriel",
    description: "Deadline UNICEF fixée au 15 décembre.",
    severity: "info",
  },
];
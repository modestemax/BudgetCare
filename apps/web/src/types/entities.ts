export type CurrencyCode = "XAF" | "USD";

/**
 * Core organizational profile
 */
export interface Organization {
  id: string;
  name: string;
  country: string;
  city: string;
  currency: CurrencyCode;
  fiscalYearStart: string;
  fiscalYearEnd: string;
}

/**
 * Strategic initiative tracked annually
 */
export interface Program {
  id: string;
  organizationId: string;
  title: string;
  owner: string;
  description: string;
  annualBudget: number;
  spentToDate: number;
  impactFocus: string;
}

/**
 * Budget line item attached to a program
 */
export interface BudgetLine {
  id: string;
  programId: string;
  category: string;
  allocated: number;
  spent: number;
  notes?: string;
}

/**
 * Financial transaction (income or expense)
 */
export interface Transaction {
  id: string;
  programId: string;
  type: "income" | "expense";
  amount: number;
  vendor: string;
  date: string;
  note?: string;
}

/**
 * Marketing KPI displayed on landing page
 */
export interface ImpactMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  trend: "up" | "steady" | "down";
}

/**
 * Authenticated NGO administrator
 */
export interface User {
  id: string;
  name: string;
  email: string;
  organizationId: string;
}
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

/**
 * Budget allocation bucket within a plan
 */
export interface BudgetPlanCategory {
  id: string;
  label: string;
  owner: string;
  allocated: number;
  utilized: number;
  notes?: string;
}

/**
 * Annual or seasonal budget planning artifact
 */
export interface BudgetPlan {
  id: string;
  organizationId: string;
  name: string;
  owner: string;
  fiscalPeriod: {
    start: string;
    end: string;
  };
  totalBudget: number;
  currency: CurrencyCode;
  status: "draft" | "validated" | "reforecast";
  categories: BudgetPlanCategory[];
  objectives: string[];
  updatedAt: string;
}

/**
 * Logged adjustment applied to a plan
 */
export interface PlanRevision {
  id: string;
  planId: string;
  date: string;
  author: string;
  type: "adjustment" | "donor-request" | "risk-mitigation";
  summary: string;
  impacts: {
    category: string;
    delta: number;
    narrative: string;
  }[];
}

/**
 * Snapshot of execution compared to the plan
 */
export interface ExecutionEntry {
  id: string;
  planId: string;
  period: string;
  committed: number;
  disbursed: number;
  completionRate: number;
  riskLevel: "low" | "medium" | "high";
  highlight: string;
  blocker?: string;
}
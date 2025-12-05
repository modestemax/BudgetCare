import { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  ClipboardList,
  RefreshCw,
  Target,
  Wallet,
} from "lucide-react";
import {
  budgetPlans,
  executionEntries,
  planRevisions,
} from "../data/budgetPlans";
import type { BudgetPlan } from "../types/entities";

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

const formatCurrency = (value: number, currency: string) =>
  `${value.toLocaleString("fr-FR")} ${currency}`;

export default function BudgetManagementPage() {
  const [selectedPlanId, setSelectedPlanId] = useState(
    budgetPlans[0]?.id ?? ""
  );

  const activePlan =
    useMemo(
      () => budgetPlans.find((plan) => plan.id === selectedPlanId),
      [selectedPlanId]
    ) ?? budgetPlans[0];

  const revisions = useMemo(
    () => planRevisions.filter((rev) => rev.planId === activePlan.id),
    [activePlan.id]
  );

  const executions = useMemo(
    () => executionEntries.filter((entry) => entry.planId === activePlan.id),
    [activePlan.id]
  );

  const totalUtilized = activePlan.categories.reduce(
    (sum, category) => sum + category.utilized,
    0
  );
  const utilizationRate = activePlan.totalBudget
    ? totalUtilized / activePlan.totalBudget
    : 0;
  const reserve = Math.max(activePlan.totalBudget - totalUtilized, 0);

  return (
    <div className="min-h-screen bg-mist py-10">
      <div className="mx-auto max-w-7xl space-y-8 px-6">
        <header className="rounded-3xl bg-gradient-to-r from-[#0F3D5C] to-[#1BA8A4] p-8 text-white shadow-card">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-white/80">
                Gestion des budgets
              </p>
              <h1 className="font-display text-4xl">
                {activePlan.name}
              </h1>
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
              <div className="mt-4 flex items-center gap-2 text-xs">
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
              {formatCurrency(activePlan.totalBudget, activePlan.currency)}
            </p>
            <div className="mt-4">
              <p className="text-xs uppercase text-charcoal/50">
                Taux de consommation
              </p>
              <div className="mt-2 h-2 w-full rounded-full bg-mist">
                <div
                  className="h-2 rounded-full bg-teal transition-all"
                  style={{ width: `${Math.min(utilizationRate * 100, 100)}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-charcoal/70">
                {Math.round(utilizationRate * 100)}% utilisé |{" "}
                {formatCurrency(totalUtilized, activePlan.currency)}
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
              {formatCurrency(reserve, activePlan.currency)}
            </p>
            <p className="mt-2 text-sm text-charcoal/70">
              Permet de financer {reserve > 0 ? "2 mois" : "0 mois"} de charges
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
            <p className="text-sm text-charcoal/60">
              Ventilation {activePlan.fiscalPeriod.start} —{" "}
              {activePlan.fiscalPeriod.end}
            </p>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-charcoal/50">
                  <th className="py-3 font-medium">Catégorie</th>
                  <th className="py-3 font-medium">Responsable</th>
                  <th className="py-3 font-medium">Alloué</th>
                  <th className="py-3 font-medium">Utilisé</th>
                  <th className="py-3 font-medium">
                    Taux
                  </th>
                </tr>
              </thead>
              <tbody>
                {activePlan.categories.map((category) => {
                  const progress = category.allocated
                    ? Math.min(
                        Math.round((category.utilized / category.allocated) * 100),
                        200
                      )
                    : 0;
                  return (
                    <tr key={category.id} className="border-t border-mist/60">
                      <td className="py-4">
                        <p className="font-semibold text-charcoal">
                          {category.label}
                        </p>
                        {category.notes && (
                          <p className="text-xs text-charcoal/60">
                            {category.notes}
                          </p>
                        )}
                      </td>
                      <td className="py-4 text-charcoal/70">{category.owner}</td>
                      <td className="py-4 text-charcoal/70">
                        {formatCurrency(category.allocated, activePlan.currency)}
                      </td>
                      <td className="py-4 text-charcoal/70">
                        {formatCurrency(category.utilized, activePlan.currency)}
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
                        {formatCurrency(entry.committed, activePlan.currency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-charcoal/50">Décaissé</p>
                      <p className="font-semibold text-charcoal">
                        {formatCurrency(entry.disbursed, activePlan.currency)}
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
      </div>
    </div>
  );
}
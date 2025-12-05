import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

type OrganizationForm = {
  name: string;
  city: string;
  currency: string;
  fiscalYearStart: string;
  fiscalYearEnd: string;
};

type ProgramForm = {
  id: string;
  title: string;
  owner: string;
  annualBudget: number;
};

const steps = [
  { id: "organization", label: "Organisation", description: "Identité & fiscalité" },
  { id: "programs", label: "Programmes annuels", description: "Objectifs & budgets" },
  { id: "categories", label: "Catégories budgétaires", description: "Postes recommandés" },
  { id: "summary", label: "Résumé", description: "Validation finale" },
];

const currencyOptions = ["XAF", "USD", "EUR"];

const categoryOptions = [
  { id: "personnel", label: "Personnel", description: "Salaires & consultants" },
  { id: "logistique", label: "Logistique", description: "Transport, per diem, carburant" },
  { id: "sensibilisation", label: "Sensibilisation", description: "Ateliers, communication" },
  { id: "equipement", label: "Équipement", description: "Matériel, maintenance" },
  { id: "monitoring", label: "Suivi & évaluation", description: "Audits, études" },
];

const createProgram = (): ProgramForm => ({
  id: `program-${Math.random().toString(36).slice(2, 9)}`,
  title: "",
  owner: "",
  annualBudget: 0,
});

export function OnboardingWizard() {
  const [stepIndex, setStepIndex] = useState(0);
  const [organization, setOrganization] = useState<OrganizationForm>({
    name: "",
    city: "Douala",
    currency: "XAF",
    fiscalYearStart: "2025-01-01",
    fiscalYearEnd: "2025-12-31",
  });
  const [programs, setPrograms] = useState<ProgramForm[]>([
    {
      id: createProgram().id,
      title: "Programme Éducation",
      owner: "Responsable Programmes",
      annualBudget: 25000000,
    },
  ]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "personnel",
    "logistique",
    "sensibilisation",
  ]);

  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === steps.length - 1;

  const canContinue = useMemo(() => {
    switch (steps[stepIndex].id) {
      case "organization":
        return (
          organization.name.trim().length > 2 &&
          organization.city.trim().length > 2
        );
      case "programs":
        return programs.every(
          (program) =>
            program.title.trim().length > 2 &&
            program.owner.trim().length > 2 &&
            program.annualBudget > 0
        );
      case "categories":
        return selectedCategories.length >= 2;
      default:
        return true;
    }
  }, [organization, programs, selectedCategories, stepIndex]);

  const totalBudget = useMemo(
    () => programs.reduce((sum, program) => sum + program.annualBudget, 0),
    [programs]
  );

  const handleProgramChange = (
    id: string,
    field: keyof ProgramForm,
    value: string
  ) => {
    setPrograms((prev) =>
      prev.map((program) =>
        program.id === id
          ? {
              ...program,
              [field]:
                field === "annualBudget" ? Number(value || 0) : value,
            }
          : program
      )
    );
  };

  const addProgram = () => {
    setPrograms((prev) => [...prev, createProgram()]);
  };

  const removeProgram = (id: string) => {
    setPrograms((prev) => (prev.length > 1 ? prev.filter((p) => p.id !== id) : prev));
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const nextStep = () => setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setStepIndex((prev) => Math.max(prev - 1, 0));

  const renderStepContent = () => {
    switch (steps[stepIndex].id) {
      case "organization":
        return (
          <div className="space-y-6">
            <h2 className="font-display text-2xl text-ocean">
              Renseignez votre organisation
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm text-charcoal/80">
                Nom de l'organisation
                <input
                  className="rounded-2xl border border-mist bg-white px-4 py-3 focus:border-teal focus:outline-none"
                  value={organization.name}
                  onChange={(event) =>
                    setOrganization((prev) => ({ ...prev, name: event.target.value }))
                  }
                  placeholder="Ex: Solidarité Cameroun"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-charcoal/80">
                Ville principale
                <input
                  className="rounded-2xl border border-mist bg-white px-4 py-3 focus:border-teal focus:outline-none"
                  value={organization.city}
                  onChange={(event) =>
                    setOrganization((prev) => ({ ...prev, city: event.target.value }))
                  }
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-charcoal/80">
                Devise de travail
                <select
                  className="rounded-2xl border border-mist bg-white px-4 py-3 focus:border-teal focus:outline-none"
                  value={organization.currency}
                  onChange={(event) =>
                    setOrganization((prev) => ({ ...prev, currency: event.target.value }))
                  }
                >
                  {currencyOptions.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm text-charcoal/80">
                Début d'exercice
                <input
                  type="date"
                  className="rounded-2xl border border-mist bg-white px-4 py-3 focus:border-teal focus:outline-none"
                  value={organization.fiscalYearStart}
                  onChange={(event) =>
                    setOrganization((prev) => ({
                      ...prev,
                      fiscalYearStart: event.target.value,
                    }))
                  }
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-charcoal/80">
                Fin d'exercice
                <input
                  type="date"
                  className="rounded-2xl border border-mist bg-white px-4 py-3 focus:border-teal focus:outline-none"
                  value={organization.fiscalYearEnd}
                  onChange={(event) =>
                    setOrganization((prev) => ({
                      ...prev,
                      fiscalYearEnd: event.target.value,
                    }))
                  }
                />
              </label>
            </div>
          </div>
        );

      case "programs":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl text-ocean">
                  Programmes de l'année
                </h2>
                <p className="text-sm text-charcoal/70">
                  Ajoutez vos initiatives prioritaires, leurs responsables et budgets.
                </p>
              </div>
              <button
                type="button"
                onClick={addProgram}
                className="inline-flex items-center gap-2 rounded-full border border-teal px-4 py-2 text-sm font-semibold text-teal transition hover:bg-teal/10"
              >
                <PlusCircle className="h-4 w-4" /> Ajouter un programme
              </button>
            </div>

            <div className="space-y-4">
              {programs.map((program, index) => (
                <div
                  key={program.id}
                  className="rounded-3xl border border-mist bg-white p-6 shadow-card"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-charcoal/80">
                      Programme #{index + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeProgram(program.id)}
                      className="rounded-full p-2 text-charcoal/50 transition hover:bg-mist hover:text-charcoal"
                      disabled={programs.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <label className="flex flex-col gap-1 text-sm text-charcoal/80">
                      Nom du programme
                      <input
                        className="rounded-2xl border border-mist bg-white px-4 py-3 focus:border-teal focus:outline-none"
                        value={program.title}
                        onChange={(event) =>
                          handleProgramChange(program.id, "title", event.target.value)
                        }
                        placeholder="Programme santé communautaire"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm text-charcoal/80">
                      Responsable
                      <input
                        className="rounded-2xl border border-mist bg-white px-4 py-3 focus:border-teal focus:outline-none"
                        value={program.owner}
                        onChange={(event) =>
                          handleProgramChange(program.id, "owner", event.target.value)
                        }
                        placeholder="Nom du manager"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm text-charcoal/80">
                      Budget annuel ({organization.currency})
                      <input
                        type="number"
                        min={0}
                        className="rounded-2xl border border-mist bg-white px-4 py-3 focus:border-teal focus:outline-none"
                        value={program.annualBudget}
                        onChange={(event) =>
                          handleProgramChange(program.id, "annualBudget", event.target.value)
                        }
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "categories":
        return (
          <div className="space-y-6">
            <h2 className="font-display text-2xl text-ocean">
              Sélectionnez vos catégories budgétaires
            </h2>
            <p className="text-sm text-charcoal/70">
              Ces postes seront proposés automatiquement lors de la saisie des dépenses.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {categoryOptions.map((category) => {
                const active = selectedCategories.includes(category.id);
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    className={`text-left rounded-2xl border px-4 py-4 transition ${
                      active
                        ? "border-teal bg-teal/10 text-charcoal"
                        : "border-mist bg-white text-charcoal/80 hover:border-teal/40"
                    }`}
                  >
                    <p className="font-semibold">{category.label}</p>
                    <p className="text-sm text-charcoal/60">{category.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <h2 className="font-display text-2xl text-ocean">
              Vérifiez vos informations
            </h2>
            <div className="grid gap-4">
              <div className="rounded-3xl border border-mist bg-white p-6">
                <p className="text-sm uppercase tracking-wide text-charcoal/50">
                  Organisation
                </p>
                <p className="text-lg font-semibold text-charcoal">{organization.name}</p>
                <p className="text-sm text-charcoal/70">
                  {organization.city} • Exercice {organization.fiscalYearStart} →{" "}
                  {organization.fiscalYearEnd} • Devise {organization.currency}
                </p>
              </div>

              <div className="rounded-3xl border border-mist bg-white p-6">
                <p className="text-sm uppercase tracking-wide text-charcoal/50">
                  Programmes ({programs.length})
                </p>
                <ul className="mt-2 space-y-2 text-sm text-charcoal/80">
                  {programs.map((program) => (
                    <li key={program.id} className="flex items-center justify-between">
                      <span>
                        {program.title} — <span className="text-charcoal/60">{program.owner}</span>
                      </span>
                      <span className="font-semibold text-ocean">
                        {program.annualBudget.toLocaleString("fr-FR")}{" "}
                        {organization.currency}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-right text-sm font-semibold text-teal">
                  Budget total : {totalBudget.toLocaleString("fr-FR")} {organization.currency}
                </p>
              </div>

              <div className="rounded-3xl border border-mist bg-white p-6">
                <p className="text-sm uppercase tracking-wide text-charcoal/50">
                  Catégories retenues
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedCategories.map((categoryId) => {
                    const category = categoryOptions.find((option) => option.id === categoryId);
                    return (
                      <span
                        key={categoryId}
                        className="rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal"
                      >
                        {category?.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-teal bg-teal/5 p-6 text-sm text-charcoal">
              <p className="flex items-center gap-2 font-semibold text-teal">
                <CheckCircle2 className="h-5 w-5" />
                Prochaine étape
              </p>
              <p className="mt-2">
                Nous chargerons vos informations dans le tableau de bord et connecterons la
                future API pour synchroniser les données.
              </p>
              <Link
                to="/app"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-charcoal px-5 py-2 text-sm font-semibold text-white transition hover:bg-charcoal/90"
              >
                Aller vers le tableau de bord (bientôt disponible)
              </Link>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-mist">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
        <div className="flex flex-col gap-4">
          <p className="text-sm uppercase tracking-[0.3em] text-teal">
            Étape {stepIndex + 1} / {steps.length}
          </p>
          <h1 className="font-display text-3xl text-ocean">
            Onboarding BudgetCare
          </h1>
          <p className="text-sm text-charcoal/70">
            Renseignez les informations clés pour personnaliser votre espace ONG.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="space-y-3 rounded-3xl border border-mist bg-white p-6">
            {steps.map((step, index) => {
              const active = index === stepIndex;
              const completed = index < stepIndex;
              return (
                <div
                  key={step.id}
                  className={`flex items-start gap-3 rounded-2xl p-3 ${
                    active
                      ? "bg-teal/10 text-charcoal"
                      : completed
                      ? "text-teal"
                      : "text-charcoal/60"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold ${
                      active || completed
                        ? "border-teal text-teal"
                        : "border-mist text-charcoal/50"
                    }`}
                  >
                    {completed ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{step.label}</p>
                    <p className="text-xs text-charcoal/60">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </aside>

          <section className="rounded-4xl space-y-6 rounded-3xl bg-white p-8 shadow-card">
            {renderStepContent()}

            <div className="flex flex-wrap justify-between gap-4 border-t border-mist pt-6">
              <button
                type="button"
                onClick={prevStep}
                disabled={isFirstStep}
                className={`inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold ${
                  isFirstStep
                    ? "cursor-not-allowed border-mist text-charcoal/30"
                    : "border-charcoal/40 text-charcoal transition hover:bg-charcoal/5"
                }`}
              >
                <ArrowLeft className="h-4 w-4" /> Retour
              </button>

              {!isLastStep && (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!canContinue}
                  className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition ${
                    canContinue
                      ? "bg-teal shadow-card hover:translate-y-0.5 hover:bg-teal/90"
                      : "cursor-not-allowed bg-mist text-charcoal/40"
                  }`}
                >
                  Continuer <ArrowRight className="h-4 w-4" />
                </button>
              )}

              {isLastStep && (
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full bg-ocean px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-ocean/90"
                >
                  Valider l'onboarding
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default OnboardingWizard;
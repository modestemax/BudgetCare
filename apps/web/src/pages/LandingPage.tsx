import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  ctaContent,
  featureHighlights,
  impactMetrics,
  testimonials,
} from "../data/marketing";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean/95 via-ocean/80 to-charcoal text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16">
        <header className="flex flex-col gap-4">
          <p className="text-sm uppercase tracking-[0.3em] text-teal">
            BudgetCare Cameroun
          </p>
          <h1 className="font-display text-4xl leading-tight sm:text-5xl">
            Pilotez vos programmes avec transparence et confiance.
          </h1>
          <p className="max-w-2xl text-lg text-mist/90">
            Une plateforme pensée pour les organisations à but non lucratif au
            Cameroun. Visualisez vos budgets, racontez votre impact, rassurez vos
            bailleurs.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/onboarding"
              className="inline-flex items-center justify-center rounded-full bg-teal px-6 py-3 font-semibold text-charcoal shadow-card transition hover:translate-y-0.5"
            >
              Demander un accès
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <a
              href="#temoignages"
              className="rounded-full border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Découvrir la plateforme
            </a>
          </div>
        </header>

        <section className="grid gap-6 rounded-3xl bg-white/10 p-8 backdrop-blur">
          <div className="grid gap-6 text-charcoal md:grid-cols-3">
            {impactMetrics.map((metric) => (
              <div
                key={metric.id}
                className="rounded-2xl bg-white/90 p-6 shadow-card"
              >
                <p className="text-sm uppercase tracking-wide text-charcoal/60">
                  {metric.label}
                </p>
                <p className="mt-2 font-display text-3xl text-ocean">
                  {metric.value}
                </p>
                <p className="text-sm text-charcoal/70">{metric.detail}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featureHighlights.map(({ id, title, description, icon: Icon }) => (
              <article
                key={id}
                className="rounded-2xl border border-white/20 bg-charcoal/40 p-6 text-mist"
              >
                <Icon className="h-6 w-6 text-teal" />
                <h3 className="mt-4 font-display text-xl text-white">{title}</h3>
                <p className="mt-2 text-sm text-mist/80">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="temoignages"
          className="grid gap-8 rounded-3xl bg-white px-8 py-12 text-charcoal shadow-card"
        >
          <header>
            <p className="text-sm uppercase tracking-[0.3em] text-teal">
              Témoignages ONG
            </p>
            <h2 className="mt-2 font-display text-3xl text-ocean">
              Ils ont renforcé la confiance de leurs bailleurs
            </h2>
          </header>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <blockquote
                key={t.id}
                className="rounded-2xl border border-mist bg-mist/40 p-6"
              >
                <p className="text-sm italic text-charcoal/90">“{t.quote}”</p>
                <div className="mt-4 text-sm">
                  <p className="font-semibold text-charcoal">{t.author}</p>
                  <p className="text-charcoal/60">
                    {t.role} • {t.organization}
                  </p>
                </div>
              </blockquote>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-gradient-to-r from-teal to-mist p-10 text-charcoal shadow-card">
          <h2 className="font-display text-3xl">{ctaContent.title}</h2>
          <p className="mt-2 text-charcoal/80">{ctaContent.subtitle}</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              to="/onboarding"
              className="inline-flex items-center rounded-full bg-charcoal px-6 py-3 font-semibold text-white transition hover:bg-charcoal/90"
            >
              {ctaContent.primaryLabel}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <a
              href="/assets/fact-sheet.pdf"
              className="rounded-full border border-charcoal/20 px-6 py-3 font-semibold text-charcoal hover:bg-white/50"
            >
              {ctaContent.secondaryLabel}
            </a>
          </div>
        </section>

        <footer className="flex flex-col gap-2 text-sm text-mist/80">
          <p>
            © {new Date().getFullYear()} BudgetCare • Conçu à Douala pour les ONG
            camerounaises.
          </p>
          <p>support@budgetcare.org</p>
        </footer>
      </div>
    </div>
  );
}

export default LandingPage;
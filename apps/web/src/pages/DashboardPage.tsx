import {
  AlertTriangle,
  Bell,
  LineChart,
  LogOut,
  Menu,
  Wallet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  alerts,
  budgetSeries,
  kpiCards,
  programs,
  transactions,
} from "../data/dashboard";

const navItems = [
  { label: "Vue d ensemble", href: "/app", icon: LineChart },
  { label: "Onboarding", href: "/onboarding", icon: Wallet },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-mist">
      <div className="mx-auto flex max-w-7xl gap-6 px-6 py-8">
        <aside className="hidden w-64 flex-shrink-0 flex-col rounded-3xl border border-mist bg-white p-6 shadow-card lg:flex">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-teal/20 p-2 text-teal">
              <Menu className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-charcoal">BudgetCare</p>
              <p className="text-xs text-charcoal/60">NGO Finance</p>
            </div>
          </div>
          <nav className="mt-8 space-y-2 text-sm">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-2xl px-3 py-2 text-charcoal/70 transition hover:bg-teal/10 hover:text-charcoal"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mt-auto rounded-3xl bg-mist/60 p-4 text-sm text-charcoal/80">
            <p className="font-semibold">Besoin d aide ?</p>
            <p>support@budgetcare.org</p>
          </div>
          <button className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-mist px-4 py-2 text-sm text-charcoal/60">
            <LogOut className="h-4 w-4" /> Déconnexion
          </button>
        </aside>

        <main className="flex-1 space-y-6">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-teal">
                Tableau de bord
              </p>
              <h1 className="font-display text-3xl text-ocean">
                ONG Solidarité Cameroun
              </h1>
            </div>
            <button className="inline-flex items-center gap-2 rounded-full border border-mist bg-white px-4 py-2 text-sm font-semibold text-charcoal">
              <Bell className="h-4 w-4" />
              Alertes (2)
            </button>
          </header>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {kpiCards.map((card) => (
              <article
                key={card.id}
                className="rounded-3xl border border-mist bg-white p-5 shadow-card"
              >
                <p className="text-xs uppercase tracking-wide text-charcoal/60">
                  {card.label}
                </p>
                <p className="mt-2 font-display text-3xl text-ocean">
                  {card.value}
                </p>
                <p
                  className={`mt-1 text-sm font-semibold ${
                    card.trend === "up" ? "text-teal" : "text-rose-500"
                  }`}
                >
                  {card.trend === "up" ? "+" : "-"}
                  {card.delta}% • {card.helper}
                </p>
              </article>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-3xl border border-mist bg-white p-6 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-charcoal/60">
                    Budget vs. Réel (M XAF)
                  </p>
                  <p className="font-display text-xl text-ocean">
                    Consommation mensuelle
                  </p>
                </div>
              </div>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={budgetSeries}>
                    <defs>
                      <linearGradient id="budgetArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1BA8A4" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#1BA8A4" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="actualArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0F3D5C" stopOpacity={0.7} />
                        <stop offset="95%" stopColor="#0F3D5C" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E1F0F4" />
                    <XAxis dataKey="month" stroke="#8AA0B4" />
                    <YAxis stroke="#8AA0B4" />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="budget"
                      stroke="#1BA8A4"
                      fill="url(#budgetArea)"
                    />
                    <Area
                      type="monotone"
                      dataKey="actual"
                      stroke="#0F3D5C"
                      fill="url(#actualArea)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-3xl border border-mist bg-white p-6 shadow-card">
              <div className="flex items-center gap-2 text-charcoal">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <p className="font-semibold">Alertes</p>
              </div>
              <ul className="mt-4 space-y-4 text-sm">
                {alerts.map((alert) => (
                  <li
                    key={alert.id}
                    className="rounded-2xl border border-mist bg-mist/50 p-4"
                  >
                    <p className="font-semibold text-charcoal">{alert.title}</p>
                    <p className="text-charcoal/70">{alert.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-3xl border border-mist bg-white p-6 shadow-card">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-charcoal">
                  Programmes prioritaires
                </p>
                <span className="text-xs uppercase text-charcoal/60">
                  Budget vs. réel
                </span>
              </div>
              <table className="mt-4 w-full text-sm">
                <thead>
                  <tr className="text-left text-charcoal/50">
                    <th className="py-2 font-medium">Programme</th>
                    <th className="py-2 font-medium">Responsable</th>
                    <th className="py-2 font-medium">Budget</th>
                    <th className="py-2 font-medium text-right">Consommation</th>
                  </tr>
                </thead>
                <tbody>
                  {programs.map((program) => (
                    <tr key={program.id} className="border-t border-mist/60">
                      <td className="py-3">
                        <p className="font-semibold text-charcoal">
                          {program.title}
                        </p>
                        <p className="text-xs text-charcoal/60">
                          {program.description}
                        </p>
                      </td>
                      <td className="py-3 text-charcoal/70">{program.owner}</td>
                      <td className="py-3 text-charcoal/70">
                        {program.annualBudget.toLocaleString("fr-FR")} XAF
                      </td>
                      <td className="py-3 text-right text-ocean font-semibold">
                        {Math.round(
                          (program.spentToDate / program.annualBudget) * 100
                        )}
                        %
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-3xl border border-mist bg-white p-6 shadow-card">
              <p className="font-semibold text-charcoal">Flux financiers</p>
              <ul className="mt-4 space-y-4 text-sm">
                {transactions.map((transaction) => (
                  <li
                    key={transaction.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-mist/70 px-4 py-3"
                  >
                    <div>
                      <p className="font-semibold text-charcoal">
                        {transaction.label}
                      </p>
                      <p className="text-xs text-charcoal/60">
                        {transaction.date} • {transaction.program}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          transaction.type === "income"
                            ? "text-teal"
                            : "text-rose-500"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {transaction.amount.toLocaleString("fr-FR")} XAF
                      </p>
                      <p className="text-xs text-charcoal/50">
                        {transaction.channel}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
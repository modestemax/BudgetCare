import { ClipboardList, CreditCard, LineChart, LogOut, Menu, Wallet } from "lucide-react";

const navItems = [
  { label: "Vue d ensemble", href: "/app", icon: LineChart },
  { label: "Onboarding", href: "/onboarding", icon: Wallet },
  { label: "Gestion budgets", href: "/app/budgets", icon: ClipboardList },
  { label: "Réservations crédits", href: "/app/reservations", icon: CreditCard },
];

export default function Sidebar() {
  return (
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
  );
}
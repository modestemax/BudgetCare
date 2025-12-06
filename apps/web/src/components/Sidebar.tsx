import { useState } from "react";
import { ClipboardList, CreditCard, LineChart, LogOut, Menu, Wallet } from "lucide-react";

const navItems = [
  { label: "Vue d ensemble", href: "/app", icon: LineChart },
  { label: "Onboarding", href: "/onboarding", icon: Wallet },
  { label: "Gestion budgets", href: "/app/budgets", icon: ClipboardList },
  { label: "Réservations crédits", href: "/app/reservations", icon: CreditCard },
];

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside
      className={`hidden flex-shrink-0 flex-col rounded-3xl border border-mist bg-white shadow-card lg:flex transition-all duration-300 ${
        isExpanded ? 'w-64 p-6' : 'w-16 p-4'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className={`flex items-center ${isExpanded ? 'gap-3' : 'justify-center'}`}>
        <div className="rounded-full bg-teal/20 p-2 text-teal">
          <Menu className="h-5 w-5" />
        </div>
        {isExpanded && (
          <div>
            <p className="text-sm font-semibold text-charcoal">BudgetCare</p>
            <p className="text-xs text-charcoal/60">NGO Finance</p>
          </div>
        )}
      </div>
      <nav className={`mt-8 space-y-2 ${isExpanded ? 'text-sm' : 'text-xs'}`}>
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            title={!isExpanded ? item.label : undefined}
            className={`flex items-center rounded-2xl py-2 text-charcoal/70 transition hover:bg-teal/10 hover:text-charcoal ${
              isExpanded ? 'gap-3 px-3' : 'justify-center px-2'
            }`}
          >
            <item.icon className="h-4 w-4" />
            {isExpanded && item.label}
          </a>
        ))}
      </nav>
      {isExpanded && (
        <div className="mt-auto rounded-3xl bg-mist/60 p-4 text-sm text-charcoal/80">
          <p className="font-semibold">Besoin d aide ?</p>
          <p>support@budgetcare.org</p>
        </div>
      )}
      <button
        className={`mt-4 inline-flex items-center justify-center rounded-full border border-mist text-charcoal/60 ${
          isExpanded ? 'gap-2 px-4 py-2 text-sm' : 'p-2'
        }`}
      >
        <LogOut className="h-4 w-4" />
        {isExpanded && 'Déconnexion'}
      </button>
    </aside>
  );
}
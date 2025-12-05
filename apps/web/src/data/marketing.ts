import type { LucideIcon } from "lucide-react";
import { HeartHandshake, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

export interface ImpactMetric {
  id: string;
  label: string;
  value: string;
  detail: string;
}

export interface FeatureHighlight {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  organization: string;
}

export const impactMetrics: ImpactMetric[] = [
  {
    id: "programs",
    label: "Programmes financés",
    value: "48",
    detail: "Suivis dans 7 régions du Cameroun",
  },
  {
    id: "beneficiaries",
    label: "Bénéficiaires touchés",
    value: "120K",
    detail: "Familles et communautés accompagnées",
  },
  {
    id: "transparency",
    label: "Indice de transparence",
    value: "98%",
    detail: "Rapports partagés avec les bailleurs",
  },
];

export const featureHighlights: FeatureHighlight[] = [
  {
    id: "onboarding",
    title: "Onboarding guidé",
    description:
      "Collectez les informations clés de votre ONG, créez vos programmes et catégories budgétaires en quelques minutes.",
    icon: ShieldCheck,
  },
  {
    id: "tracking",
    title: "Suivi budgétaire intelligent",
    description:
      "Comparez budget vs. dépenses réelles, recevez des alertes quand un poste dépasse 80 % et ajustez vos priorités.",
    icon: TrendingUp,
  },
  {
    id: "reports",
    title: "Rapports prêts pour les bailleurs",
    description:
      "Générez des rapports francophones avec indicateurs d’impact et pièces jointes pour rassurer vos partenaires.",
    icon: Sparkles,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "adef",
    quote:
      "BudgetCare nous a permis d’unifier nos budgets terrain et siège. Les bailleurs voient en direct l’avancement des programmes.",
    author: "Nathalie Nguimdo",
    role: "Directrice Administrative",
    organization: "ADEF Cameroun",
  },
  {
    id: "green",
    quote:
      "La plateforme a professionnalisé nos tableaux de bord et simplifié la formation des équipes régionales.",
    author: "Jean-Paul Etoundi",
    role: "Responsable Programmes",
    organization: "GreenRoots",
  },
  {
    id: "health",
    quote:
      "Les alertes de dépassement budgétaire nous évitent des surprises pendant les audits des bailleurs internationaux.",
    author: "Solange Mballa",
    role: "Coordinatrice Finance",
    organization: "Santé Pour Tous",
  },
];

export const ctaContent = {
  title: "Prêt à offrir plus de transparence à vos bailleurs?",
  subtitle:
    "Réservez une démonstration en français ou en anglais avec notre équipe basée à Douala.",
  primaryLabel: "Réserver une démo",
  secondaryLabel: "Télécharger la fiche produit",
};
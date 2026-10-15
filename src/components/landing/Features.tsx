import { useScrollReveal } from "../../hooks/useScrollReveal";
import {
  IconGrid,
  IconUsers,
  IconScale,
  IconBracket,
  IconLive,
  IconTrophy,
  IconFlag,
  IconTv,
  IconQr,
  IconGear,
  IconCalendar,
  IconBuilding,
} from "../Icons";

const features = [
  {
    icon: IconCalendar,
    title: "Multi-Compétitions",
    description:
      "Gérez simultanément plusieurs compétitions : locales, nationales ou internationales. Basculez entre événements en un clic.",
    color: "text-gold",
  },
  {
    icon: IconBuilding,
    title: "Gestion des Organisateurs",
    description:
      "Centralisez les informations des fédérations, ligues et clubs. Attribution automatique des compétitions.",
    color: "text-flame",
  },
  {
    icon: IconUsers,
    title: "Base Athlètes",
    description:
      "Base de données complète des compétiteurs avec licences FITKD, recherche avancée et filtrage par catégorie.",
    color: "text-forest",
  },
  {
    icon: IconScale,
    title: "Pesée Intelligente",
    description:
      "Contrôle officiel des poids avec validation en temps réel et assignation automatique aux catégories WT.",
    color: "text-chong",
  },
  {
    icon: IconBracket,
    title: "Tirages au Sort",
    description:
      "Génération automatique de tableaux à élimination directe avec seeding équilibré et gestion des exempts.",
    color: "text-gold",
  },
  {
    icon: IconLive,
    title: "Live Scoring WT",
    description:
      "Régie de combat en temps réel : chronomètre WT, scoring complet, Gam-jeom, point en or. Persistance automatique.",
    color: "text-flame",
  },
  {
    icon: IconTrophy,
    title: "Résultats & Podiums",
    description:
      "Affichage automatique des médaillés, classement des clubs et statistiques par catégorie.",
    color: "text-forest",
  },
  {
    icon: IconFlag,
    title: "Réclamations",
    description:
      "Workflow complet de gestion des contestations avec historique détaillé et statistiques en temps réel.",
    color: "text-chong",
  },
  {
    icon: IconTv,
    title: "Mode TV",
    description:
      "Affichage grand écran optimisé pour les cérémonies : podiums, classements et statistiques en direct.",
    color: "text-gold",
  },
  {
    icon: IconQr,
    title: "QR Présences",
    description:
      "Validation rapide des présences et pesées par scan QR avec statistiques de participation.",
    color: "text-flame",
  },
  {
    icon: IconGrid,
    title: "Tableau de Bord",
    description:
      "Vue d'ensemble complète avec KPIs en temps réel, file des combats et progression des catégories.",
    color: "text-forest",
  },
  {
    icon: IconGear,
    title: "Administration",
    description:
      "Configuration complète : paramètres événement, catégories, export/import JSON, journal d'activité.",
    color: "text-chong",
  },
];

export default function Features() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal();

  return (
    <section id="fonctionnalites" className="relative py-24 bg-coal">
      <div className="absolute inset-0 mud-bg opacity-20" />
      
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section header */}
        <div
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-gold/30 bg-gold/5 mb-6">
            <span className="font-mono text-xs uppercase tracking-wider text-gold">
              Fonctionnalités
            </span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-wide text-bone mb-6">
            Tout ce dont vous avez
            <span className="block text-gold mt-2">besoin pour réussir</span>
          </h2>
          <p className="text-lg text-dune max-w-2xl mx-auto">
            12 modules intégrés pour couvrir l'intégralité du cycle de vie d'une compétition de taekwondo.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <FeatureCard key={i} feature={feature} Icon={Icon} index={i} />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  Icon,
  index,
}: {
  feature: (typeof features)[0];
  Icon: any;
  index: number;
}) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`group relative border border-husk bg-night p-6 transition-all duration-700 hover:border-gold/50 hover:bg-bark ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      {/* Icon */}
      <div className={`mb-4 ${feature.color} transition-transform duration-300 group-hover:scale-110`}>
        <Icon className="w-10 h-10" />
      </div>

      {/* Title */}
      <h3 className="font-display text-xl uppercase tracking-wide text-bone mb-3">
        {feature.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-dune leading-relaxed">{feature.description}</p>

      {/* Hover accent */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-gold via-flame to-forest scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </div>
  );
}

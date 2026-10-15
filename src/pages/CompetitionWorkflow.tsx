import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../lib/store";
import { PageHead, ProgressBar, useToast } from "../components/ui";
import {
  IconCheck,
  IconChevron,
  IconUsers,
  IconScale,
  IconBracket,
  IconLive,
  IconTrophy,
  IconLock,
} from "../components/Icons";
import PageBackground from "../components/PageBackground";
import { PAGE_BACKGROUNDS } from "../config/backgrounds";

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  path: string;
  status: "completed" | "active" | "locked";
  details: string[];
}

export default function CompetitionWorkflow() {
  const { state } = useApp();
  const toast = useToast();

  // Calculer le statut de chaque étape
  const totalAthletes = state.athletes.length;
  const weighedAthletes = state.athletes.filter((a) => a.status === "pesé").length;
  const totalCategories = Object.keys(state.catStatus).length;
  const drawnCategories = Object.values(state.catStatus).filter(
    (s) => s === "tirée" || s === "terminée"
  ).length;
  const totalMatches = Object.values(state.brackets).flat().length;
  const completedMatches = Object.values(state.brackets)
    .flat()
    .filter((m) => m.status === "termine").length;
  const totalResults = Object.keys(state.results).length;

  // Déterminer la progression
  const getStepStatus = (stepId: string): "completed" | "active" | "locked" => {
    switch (stepId) {
      case "config":
        return "completed";
      case "registration":
        return totalAthletes > 0 ? "completed" : "active";
      case "weighin":
        if (totalAthletes === 0) return "locked";
        return weighedAthletes === totalAthletes
          ? "completed"
          : weighedAthletes > 0
            ? "active"
            : "active";
      case "brackets":
        if (weighedAthletes === 0) return "locked";
        return drawnCategories === totalCategories
          ? "completed"
          : drawnCategories > 0
            ? "active"
            : "active";
      case "competition":
        if (drawnCategories === 0) return "locked";
        return completedMatches === totalMatches && totalMatches > 0
          ? "completed"
          : completedMatches > 0
            ? "active"
            : "active";
      case "results":
        if (completedMatches === 0) return "locked";
        return totalResults > 0 ? "completed" : "active";
      case "ceremony":
        if (totalResults === 0) return "locked";
        return "active";
      default:
        return "locked";
    }
  };

  const steps: WorkflowStep[] = [
    {
      id: "config",
      title: "Configuration",
      description: "Paramétrer la compétition",
      icon: IconLock,
      path: "/admin",
      status: getStepStatus("config"),
      details: [
        `Nom: ${state.event.name}`,
        `Lieu: ${state.event.venue}`,
        `Date: ${state.event.date}`,
        `${state.event.arenas} aires de combat`,
      ],
    },
    {
      id: "registration",
      title: "Inscriptions",
      description: "Enregistrer les athlètes",
      icon: IconUsers,
      path: "/athletes",
      status: getStepStatus("registration"),
      details: [
        `${totalAthletes} athlète(s) inscrit(s)`,
        `${state.clubs.length} club(s) représenté(s)`,
        totalAthletes === 0
          ? "⚠️ Aucun athlète inscrit"
          : "✓ Inscriptions ouvertes",
      ],
    },
    {
      id: "weighin",
      title: "Pesée Officielle",
      description: "Valider les poids et catégories",
      icon: IconScale,
      path: "/pesee",
      status: getStepStatus("weighin"),
      details: [
        `${weighedAthletes}/${totalAthletes} athlètes pesés`,
        `${Math.round((weighedAthletes / Math.max(totalAthletes, 1)) * 100)}% complété`,
        weighedAthletes === totalAthletes && totalAthletes > 0
          ? "✓ Toutes les pesées validées"
          : "⚠️ Pesées en cours",
      ],
    },
    {
      id: "brackets",
      title: "Tirages au Sort",
      description: "Générer les tableaux",
      icon: IconBracket,
      path: "/tirages",
      status: getStepStatus("brackets"),
      details: [
        `${drawnCategories}/${totalCategories} catégories tirées`,
        `${totalMatches} combat(s) programmé(s)`,
        drawnCategories === totalCategories
          ? "✓ Tous les tirages effectués"
          : "⚠️ Tirages en cours",
      ],
    },
    {
      id: "competition",
      title: "Compétition",
      description: "Diriger les combats",
      icon: IconLive,
      path: "/live",
      status: getStepStatus("competition"),
      details: [
        `${completedMatches}/${totalMatches} combats terminés`,
        `${Math.round((completedMatches / Math.max(totalMatches, 1)) * 100)}% complété`,
        completedMatches === totalMatches && totalMatches > 0
          ? "✓ Tous les combats terminés"
          : "⚠️ Compétition en cours",
      ],
    },
    {
      id: "results",
      title: "Résultats",
      description: "Valider les podiums",
      icon: IconTrophy,
      path: "/resultats",
      status: getStepStatus("results"),
      details: [
        `${totalResults} catégorie(s) terminée(s)`,
        `${Object.keys(state.results).length} podium(s) officialisé(s)`,
        totalResults > 0
          ? "✓ Résultats disponibles"
          : "⚠️ En attente des finales",
      ],
    },
    {
      id: "ceremony",
      title: "Cérémonie",
      description: "Remise des prix",
      icon: IconTrophy,
      path: "/tv",
      status: getStepStatus("ceremony"),
      details: [
        "Mode TV disponible",
        "Affichage des podiums",
        "Affichage des sponsors",
        "✓ Prêt pour la cérémonie",
      ],
    },
  ];

  const completedSteps = steps.filter((s) => s.status === "completed").length;
  const overallProgress = (completedSteps / steps.length) * 100;

  return (
    <div className="fade-up mx-auto max-w-6xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.dashboard} opacity={0.1} blur={3} />
      <PageHead
        title="Cycle de Vie de la Compétition"
        subtitle="Workflow de gestion étape par étape"
      />

      {/* Progression globale */}
      <div className="panel p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-xl uppercase tracking-wide text-bone">
            Progression Globale
          </h3>
          <span className="font-display text-2xl text-gold">
            {Math.round(overallProgress)}%
          </span>
        </div>
        <ProgressBar value={overallProgress} />
        <p className="mt-3 text-sm text-dune">
          {completedSteps} étape(s) complétée(s) sur {steps.length}
        </p>
      </div>

      {/* Étapes du workflow */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isNext =
            step.status === "active" &&
            (index === 0 || steps[index - 1].status === "completed");

          return (
            <div
              key={step.id}
              className={`panel relative overflow-hidden transition-all ${
                step.status === "completed"
                  ? "border-l-4 border-l-forest"
                  : step.status === "active"
                    ? "border-l-4 border-l-gold"
                    : "border-l-4 border-l-husk opacity-60"
              }`}
            >
              <div className="flex items-start gap-4 p-6">
                {/* Numéro d'étape */}
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center border-2 ${
                    step.status === "completed"
                      ? "border-forest bg-forest/10 text-forest"
                      : step.status === "active"
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-husk bg-husk/10 text-dune"
                  }`}
                >
                  {step.status === "completed" ? (
                    <IconCheck className="h-6 w-6" />
                  ) : step.status === "locked" ? (
                    <IconLock className="h-6 w-6" />
                  ) : (
                    <span className="font-display text-xl">{index + 1}</span>
                  )}
                </div>

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="font-display text-xl uppercase tracking-wide text-bone">
                        {step.title}
                      </h3>
                      <p className="text-sm text-dune mt-1">{step.description}</p>
                    </div>
                    {step.status !== "locked" && (
                      <Link
                        to={step.path}
                        className={`btn btn-sm shrink-0 ${
                          isNext ? "btn-primary" : "btn-ghost"
                        }`}
                      >
                        {step.status === "completed" ? "Voir" : "Accéder"}
                        <IconChevron className="h-4 w-4" />
                      </Link>
                    )}
                  </div>

                  {/* Détails */}
                  <div className="mt-3 space-y-1">
                    {step.details.map((detail, i) => (
                      <p
                        key={i}
                        className={`text-sm ${
                          detail.startsWith("✓")
                            ? "text-forest"
                            : detail.startsWith("⚠️")
                              ? "text-gold"
                              : "text-dune"
                        }`}
                      >
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Icône */}
                <Icon
                  className={`h-8 w-8 shrink-0 ${
                    step.status === "completed"
                      ? "text-forest"
                      : step.status === "active"
                        ? "text-gold"
                        : "text-dune/50"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions rapides */}
      <div className="panel p-6 mt-6">
        <h3 className="font-display text-xl uppercase tracking-wide text-bone mb-4">
          Actions Rapides
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link to="/athletes" className="btn btn-ghost">
            <IconUsers className="h-4 w-4" />
            Athlètes
          </Link>
          <Link to="/pesee" className="btn btn-ghost">
            <IconScale className="h-4 w-4" />
            Pesée
          </Link>
          <Link to="/tirages" className="btn btn-ghost">
            <IconBracket className="h-4 w-4" />
            Tirages
          </Link>
          <Link to="/live" className="btn btn-ghost">
            <IconLive className="h-4 w-4" />
            Live
          </Link>
        </div>
      </div>
    </div>
  );
}

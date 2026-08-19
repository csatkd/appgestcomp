export type Discipline =
  | "Kyorugi"
  | "Poomsae"
  | "Casse"
  | "Démonstration"
  | "Formation"
  | "Passage de Grade";

export interface EventItem {
  id: number;
  title: string;
  discipline: Discipline;
  scope: "National" | "International";
  date: string;
  city: string;
  venue: string;
  registered: number;
  capacity: number;
  image: string;
}

export const EVENTS: EventItem[] = [
  {
    id: 1,
    title: "Championnat National Kyorugi 2026",
    discipline: "Kyorugi",
    scope: "National",
    date: "14–16 Mai 2026",
    city: "Alger",
    venue: "Salle Omnisports Harcha",
    registered: 84,
    capacity: 128,
    image:
      "https://image.qwenlm.ai/generated-images/24367f94-1104-46b3-8bcf-537b6416ad3d/_result.png",
  },
  {
    id: 2,
    title: "Open International Poomsae",
    discipline: "Poomsae",
    scope: "International",
    date: "22 Juin 2026",
    city: "Oran",
    venue: "Palais des Sports",
    registered: 87,
    capacity: 120,
    image:
      "https://image.qwenlm.ai/generated-images/1c1719c1-79c5-40fc-8258-450d5ff5ebf9/_result.png",
  },
  {
    id: 3,
    title: "Compétition de Casse — Coupe Nationale",
    discipline: "Casse",
    scope: "National",
    date: "5 Juillet 2026",
    city: "Constantine",
    venue: "Centre Sportif National",
    registered: 38,
    capacity: 60,
    image:
      "https://image.qwenlm.ai/generated-images/02e24231-6d55-4414-a948-85820b199259/_result.png",
  },
  {
    id: 4,
    title: "Gala de Démonstration Nationale",
    discipline: "Démonstration",
    scope: "National",
    date: "19 Juillet 2026",
    city: "Annaba",
    venue: "Salle Ahmed Zemmouri",
    registered: 45,
    capacity: 80,
    image:
      "https://image.qwenlm.ai/generated-images/dc25c22f-48bf-4624-a14c-6cfd46c3a391/_result.png",
  },
  {
    id: 5,
    title: "Stage National Arbitres & Entraîneurs",
    discipline: "Formation",
    scope: "National",
    date: "2–4 Août 2026",
    city: "Sétif",
    venue: "Complexe Sportif Aïn El Fouara",
    registered: 22,
    capacity: 40,
    image:
      "https://image.qwenlm.ai/generated-images/1d397e81-527f-4749-97f1-82409a09c2d5/_result.png",
  },
  {
    id: 6,
    title: "Passage de Grades — Session Nationale",
    discipline: "Passage de Grade",
    scope: "National",
    date: "30 Août 2026",
    city: "Alger",
    venue: "Fédération Nationale de Taekwondo",
    registered: 143,
    capacity: 200,
    image:
      "https://image.qwenlm.ai/generated-images/24ad291d-dce3-4a69-aba2-c6a78a284bab/_result.png",
  },
];

export interface ModuleItem {
  tag: string;
  title: string;
  desc: string;
  icon: string;
}

export const MODULES: ModuleItem[] = [
  {
    tag: "QR Code",
    title: "Vérification des Présences",
    desc: "Enregistrement manuel ou scan QR sur les badges athlètes. Validation instantanée des présences, pesées et données de participation.",
    icon: "qr",
  },
  {
    tag: "Inscriptions",
    title: "Portail d'Inscription",
    desc: "Inscription en ligne pour clubs et athlètes : suivi des droits, paiements et validation. Licence, certificat médical, grade et photo ID centralisés.",
    icon: "badge",
  },
  {
    tag: "Pesée",
    title: "Module de Pesée",
    desc: "Enregistrement des données de pesée pour valider la participation. Division automatique par âge, sexe, poids ou grade.",
    icon: "scale",
  },
  {
    tag: "Brackets",
    title: "Génération de Tableaux",
    desc: "Tirages automatiques : élimination directe, double élimination, repêchage, Round Robin. Tableaux dynamiques mis à jour en temps réel.",
    icon: "bracket",
  },
  {
    tag: "Arbitrage",
    title: "Affectation des Arbitres",
    desc: "Planification des rotations d'arbitres par aire de combat, gestion des convocations et suivi du staff organisationnel.",
    icon: "whistle",
  },
  {
    tag: "Live Scoring",
    title: "Tableau de Bord Live",
    desc: "Pilotage des scores en direct sur chaque tatami, avec tableau d'affichage public : points, Gam-jeom et chronomètre.",
    icon: "board",
  },
  {
    tag: "Réclamations",
    title: "Module de Réclamations",
    desc: "Enregistrement et traitement des recours sur les décisions de combat, avec workflow de validation et historique complet.",
    icon: "flag",
  },
  {
    tag: "Broadcast",
    title: "Diffusion en Direct",
    desc: "Publication des résultats et tableaux de progression sur le web ou application mobile, pour le public et les médias.",
    icon: "antenna",
  },
  {
    tag: "Analytics",
    title: "Statistiques & Rapports",
    desc: "Classements finaux générés automatiquement, archivage des données et listes : meilleure équipe, club et athlète.",
    icon: "chart",
  },
  {
    tag: "Public",
    title: "Page Résultats Publique",
    desc: "Résultats accessibles après l'événement : classements définitifs, palmarès complets et archives consultables par tous.",
    icon: "globe",
  },
  {
    tag: "TV Mode",
    title: "Mode TV Cérémonie",
    desc: "Affichage optimisé grand écran pour les remises de prix : podiums, médailles et classements en plein écran.",
    icon: "tv",
  },
  {
    tag: "PSS / KPNP",
    title: "Intégration PSS Daedo & KPNP",
    desc: "Interfaçage avec les systèmes PSS Daedo et KPNP pour la récupération automatique des données de combat.",
    icon: "plug",
  },
];

export interface FeatureItem {
  title: string;
  desc: string;
}

export const FEATURES: FeatureItem[] = [
  {
    title: "Base de données centralisée",
    desc: "Licence, passeport fédéral, certificat médical, grade, photo ID — tout le dossier de l'athlète au même endroit, sécurisé.",
  },
  {
    title: "Catégorisation automatique",
    desc: "Répartition instantanée par âge, sexe et poids pour le Kyorugi, ou par grade pour le Poomsae.",
  },
  {
    title: "Scoring en direct",
    desc: "Suivi des points sur chaque tatami avec intégration native des systèmes PSS Daedo et KPNP.",
  },
  {
    title: "Classements en temps réel",
    desc: "Meilleure équipe, meilleur club, meilleur athlète — les podiums se dessinent en direct.",
  },
  {
    title: "Gestion des rôles",
    desc: "Athlètes, coaches, arbitres, officiels et administrateurs : chaque acteur dispose de son espace dédié.",
  },
  {
    title: "Tableau d'affichage public",
    desc: "Gam-jeom, chronomètre et avertissements projetés en salle pour le public et les médias.",
  },
];

export const STATS = [
  { value: 12847, suffix: "", label: "Athlètes licenciés" },
  { value: 847, suffix: "", label: "Clubs affiliés" },
  { value: 320, suffix: "+", label: "Événements par an" },
  { value: 48, suffix: "", label: "Ligues couvertes" },
];

export const DISCIPLINES: Discipline[] = [
  "Kyorugi",
  "Poomsae",
  "Casse",
  "Démonstration",
  "Passage de Grade",
];

export const QUICK_CHIPS = [
  { label: "Kyorugi Live", color: "var(--color-flame)" },
  { label: "Poomsae", color: "var(--color-gold)" },
  { label: "Brackets Auto", color: "var(--color-forest)" },
  { label: "QR Présences", color: "var(--color-bone)" },
  { label: "Scoreboard", color: "var(--color-chong)" },
  { label: "Mode TV", color: "var(--color-gold)" },
];

export const ROLES = ["Athlètes", "Coaches", "Arbitres", "Officiels", "Administrateurs"];

export const PILLARS = [
  {
    icon: "badge",
    title: "Gestion des Inscriptions",
    desc: "Portail en ligne pour clubs et athlètes, avec suivi des paiements et validation des droits d'inscription.",
  },
  {
    icon: "qr",
    title: "Base de Données Centralisée",
    desc: "Numéro de licence, passeport fédéral, certificat médical, grade, photo ID et pièce d'identité stockés de manière sécurisée.",
  },
  {
    icon: "bracket",
    title: "Gestion des Catégories",
    desc: "Division automatique par âge, sexe et poids pour le Kyorugi, ou par grade pour le Poomsae.",
  },
  {
    icon: "plug",
    title: "Intégration PSS Daedo & KPNP",
    desc: "Récupération automatique des données de combat pour un scoring en direct sans saisie manuelle.",
  },
];
